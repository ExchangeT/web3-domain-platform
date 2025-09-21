import { ethers } from 'ethers';

export const validateDomainName = (name: string): { isValid: boolean; error?: string } => {
  if (!name) {
    return { isValid: false, error: 'Domain name is required' };
  }
  
  if (name.length < 3) {
    return { isValid: false, error: 'Domain name must be at least 3 characters' };
  }
  
  if (name.length > 63) {
    return { isValid: false, error: 'Domain name must be less than 64 characters' };
  }
  
  const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  if (!domainRegex.test(name)) {
    return { isValid: false, error: 'Domain name can only contain letters, numbers, and hyphens' };
  }
  
  if (name.startsWith('-') || name.endsWith('-')) {
    return { isValid: false, error: 'Domain name cannot start or end with a hyphen' };
  }
  
  return { isValid: true };
};

export const validateEthereumAddress = (address: string): { isValid: boolean; error?: string } => {
  if (!address) {
    return { isValid: false, error: 'Address is required' };
  }
  
  try {
    ethers.utils.getAddress(address);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid Ethereum address format' };
  }
};

export const validatePrice = (price: string): { isValid: boolean; error?: string } => {
  if (!price) {
    return { isValid: false, error: 'Price is required' };
  }
  
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) {
    return { isValid: false, error: 'Price must be a valid number' };
  }
  
  if (numPrice <= 0) {
    return { isValid: false, error: 'Price must be greater than 0' };
  }
  
  if (numPrice > 1000) {
    return { isValid: false, error: 'Price cannot exceed 1000 ETH' };
  }
  
  return { isValid: true };
};

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: true }; // Email is optional
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  return { isValid: true };
};

export const validateUrl = (url: string): { isValid: boolean; error?: string } => {
  if (!url) {
    return { isValid: true }; // URL is optional
  }
  
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
};