export interface Domain {
    id: number
    name: string
    extension: string
    fullName: string
    tokenId?: number
    currentOwner: string
    originalOwner: string
    resolvedAddress?: string
    purchasePrice: string
    currentListPrice?: string
    isListed: boolean
    isPreminted: boolean
    isPremium: boolean
    timesSold: number
    totalVolume: string
    mintedAt: string
    listedAt?: string
    lastSoldAt?: string
    extensionDescription?: string
    ownerName?: string
  }
  
  export interface DomainSearchResult {
    name: string
    extension: string
    fullName: string
    available: boolean
    price?: string
    priceWei?: string
    owner?: string
    isListed?: boolean
    listPrice?: string
    purchasePrice?: string
    contractChecked?: boolean
  }
  
  export interface Extension {
    id: number
    name: string
    basePrice: string
    tierPricing: Record<string, number>
    isEnabled: boolean
    description?: string
    iconUrl?: string
    totalDomainsMinted: number
    totalRevenue: string
    contractPrice?: string
    contractEnabled?: boolean
  }