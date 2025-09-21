class ApiClient {
    private baseUrl: string;
  
    constructor() {
      this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    }
  
    private async request<T>(
      endpoint: string,
      options: RequestInit = {}
    ): Promise<T> {
      const url = `${this.baseUrl}/api${endpoint}`;
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };
  
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(error.error || 'API request failed');
      }
  
      return response.json();
    }
  
    // Domain methods
    async registerDomain(domain: string, price: string, userAddress: string) {
      return this.request('/domains/register', {
        method: 'POST',
        body: JSON.stringify({ domain, price, userAddress }),
      });
    }
  
    async getUserDomains(address: string) {
      return this.request(`/domains/user/${address}`);
    }
  
    async setResolution(domain: string, address: string, owner: string) {
      return this.request('/domains/resolve', {
        method: 'POST',
        body: JSON.stringify({ domain, address, owner }),
      });
    }
  
    // Marketplace methods
    async getMarketplaceDomains(filters: Record<string, unknown>) {
      return this.request('/marketplace/domains', {
        method: 'POST',
        body: JSON.stringify(filters),
      });
    }
  
    async purchaseDomain(domainId: string, price: string) {
      return this.request('/marketplace/purchase', {
        method: 'POST',
        body: JSON.stringify({ domainId, price }),
      });
    }
  
    async listDomain(domain: string, price: string, seller: string) {
      return this.request('/marketplace/list', {
        method: 'POST',
        body: JSON.stringify({ domain, price, seller }),
      });
    }
  
    // Dashboard methods
    async getTrendingDomains() {
      return this.request('/domains/trending');
    }
  
    async getFeaturedDomains() {
      return this.request('/domains/featured');
    }
  
    async getRecentActivity() {
      return this.request('/activity/recent');
    }
  }
  
  export const apiClient = new ApiClient();
  