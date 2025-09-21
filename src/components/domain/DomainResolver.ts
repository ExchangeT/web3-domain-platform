// src/components/domain/DomainResolver.ts
import { ethers } from 'ethers';

// Domain Resolver ABI (simplified version)
const RESOLVER_ABI = [
  "function resolve(string memory domain) external view returns (address)",
  "function setResolution(string memory domain, address addr) external",
  "function owner(string memory domain) external view returns (address)",
  "function reverseResolve(address addr) external view returns (string memory)",
  "function getTextRecord(string memory domain, string memory key) external view returns (string memory)",
  "function setTextRecord(string memory domain, string memory key, string memory value) external"
];

export class DomainResolver {
  private contract: ethers.Contract;
  private provider: ethers.providers.Provider;
  private signer?: ethers.Signer;

  constructor(contractAddress: string, provider: ethers.providers.Provider, signer?: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
    this.contract = new ethers.Contract(
      contractAddress, 
      RESOLVER_ABI, 
      signer || provider
    );
  }

  /**
   * Resolve a domain name to an Ethereum address
   */
  async resolveDomain(domain: string): Promise<string | null> {
    try {
      const address = await this.contract.resolve(domain);
      return address !== ethers.constants.AddressZero ? address : null;
    } catch (error) {
      console.error('Error resolving domain:', error);
      return null;
    }
  }

  /**
   * Reverse resolve an address to find associated domains
   */
  async reverseResolve(address: string): Promise<string | null> {
    try {
      const domain = await this.contract.reverseResolve(address);
      return domain || null;
    } catch (error) {
      console.error('Error reverse resolving address:', error);
      return null;
    }
  }

  /**
   * Set the resolution for a domain (requires ownership)
   */
  async setResolution(domain: string, address: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer required for setting resolution');
    }

    try {
      const tx = await this.contract.setResolution(domain, address);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error setting resolution:', error);
      throw error;
    }
  }

  /**
   * Get the owner of a domain
   */
  async getDomainOwner(domain: string): Promise<string | null> {
    try {
      const owner = await this.contract.owner(domain);
      return owner !== ethers.constants.AddressZero ? owner : null;
    } catch (error) {
      console.error('Error getting domain owner:', error);
      return null;
    }
  }

  /**
   * Get a text record for a domain
   */
  async getTextRecord(domain: string, key: string): Promise<string | null> {
    try {
      const value = await this.contract.getTextRecord(domain, key);
      return value || null;
    } catch (error) {
      console.error('Error getting text record:', error);
      return null;
    }
  }

  /**
   * Set a text record for a domain (requires ownership)
   */
  async setTextRecord(domain: string, key: string, value: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer required for setting text records');
    }

    try {
      const tx = await this.contract.setTextRecord(domain, key, value);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error setting text record:', error);
      throw error;
    }
  }

  /**
   * Batch resolve multiple domains
   */
  async batchResolve(domains: string[]): Promise<Map<string, string | null>> {
    const results = new Map<string, string | null>();
    
    const promises = domains.map(domain => this.resolveDomain(domain));
    const settled = await Promise.allSettled(promises);
    
    settled.forEach((result, index) => {
      const domain = domains[index];
      if (result.status === 'fulfilled') {
        results.set(domain, result.value);
      } else {
        results.set(domain, null);
      }
    });
    
    return results;
  }

  /**
   * Check if a domain is properly configured
   */
  async getDomainStatus(domain: string): Promise<{
    isResolved: boolean;
    resolvedAddress: string | null;
    owner: string | null;
    hasTextRecords: boolean;
  }> {
    try {
      const [resolvedAddress, owner] = await Promise.all([
        this.resolveDomain(domain),
        this.getDomainOwner(domain)
      ]);

      // Check for common text records
      const textRecordKeys = ['email', 'url', 'avatar', 'description'];
      const textRecords = await Promise.all(
        textRecordKeys.map(key => this.getTextRecord(domain, key))
      );
      
      const hasTextRecords = textRecords.some(record => record !== null);

      return {
        isResolved: resolvedAddress !== null,
        resolvedAddress,
        owner,
        hasTextRecords
      };
    } catch (error) {
      console.error('Error getting domain status:', error);
      return {
        isResolved: false,
        resolvedAddress: null,
        owner: null,
        hasTextRecords: false
      };
    }
  }

  /**
   * Validate domain name format
   */
  static validateDomainFormat(domain: string): boolean {
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
    return domainRegex.test(domain) && domain.length >= 3 && domain.length <= 253;
  }

  /**
   * Validate Ethereum address format
   */
  static validateAddress(address: string): boolean {
    return ethers.utils.isAddress(address);
  }
}

// Utility functions for domain resolution
export const DomainUtils = {
  /**
   * Format domain name consistently
   */
  formatDomain: (domain: string): string => {
    return domain.toLowerCase().trim();
  },

  /**
   * Extract name and extension from full domain
   */
  parseDomain: (fullDomain: string): { name: string; extension: string } => {
    const parts = fullDomain.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid domain format');
    }
    
    const extension = parts.pop()!;
    const name = parts.join('.');
    
    return { name, extension };
  },

  /**
   * Check if domain is available (not registered)
   */
  isDomainAvailable: async (resolver: DomainResolver, domain: string): Promise<boolean> => {
    const owner = await resolver.getDomainOwner(domain);
    return owner === null;
  },

  /**
   * Get domain suggestions based on input
   */
  generateSuggestions: (baseName: string, extensions: string[]): string[] => {
    const suggestions: string[] = [];
    
    // Add different extensions
    extensions.forEach(ext => {
      suggestions.push(`${baseName}.${ext}`);
    });
    
    // Add variations with numbers
    for (let i = 1; i <= 3; i++) {
      extensions.forEach(ext => {
        suggestions.push(`${baseName}${i}.${ext}`);
      });
    }
    
    // Add variations with common prefixes/suffixes
    const variations = ['my', 'get', 'the', 'use'];
    variations.forEach(variation => {
      extensions.forEach(ext => {
        suggestions.push(`${variation}${baseName}.${ext}`);
        suggestions.push(`${baseName}${variation}.${ext}`);
      });
    });
    
    return suggestions.slice(0, 10); // Limit to 10 suggestions
  }
};

export default DomainResolver;