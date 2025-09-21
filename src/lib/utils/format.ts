export const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  export const formatPrice = (price: string | number): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    });
  };
  
  export const formatTimeAgo = (timestamp: string | Date): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays}d ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths}mo ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}y ago`;
  };
  
  export const formatDomain = (domain: string): string => {
    return domain.toLowerCase().trim();
  };
  
  export const parseDomain = (fullDomain: string): { name: string; extension: string } => {
    const parts = fullDomain.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid domain format');
    }
    
    const extension = parts.pop()!;
    const name = parts.join('.');
    
    return { name, extension };
  };