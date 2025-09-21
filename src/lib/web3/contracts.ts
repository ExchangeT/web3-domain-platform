export const CONTRACT_ADDRESSES = {
    DOMAIN_CORE: process.env.NEXT_PUBLIC_DOMAIN_CORE_ADDRESS!,
    MARKETPLACE: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!,
    EXTENSION_MANAGER: process.env.NEXT_PUBLIC_EXTENSION_MANAGER_ADDRESS!,
    RESOLVER: process.env.NEXT_PUBLIC_RESOLVER_ADDRESS!,
  };
  
  export const DOMAIN_CORE_ABI = [
    "function register(string memory name, string memory extension, address owner) external payable",
    "function ownerOf(uint256 tokenId) external view returns (address)",
    "function tokenURI(uint256 tokenId) external view returns (string memory)",
    "function approve(address to, uint256 tokenId) external",
    "function getApproved(uint256 tokenId) external view returns (address)",
    "function setApprovalForAll(address operator, bool approved) external",
    "function isApprovedForAll(address owner, address operator) external view returns (bool)",
    "function safeTransferFrom(address from, address to, uint256 tokenId) external",
    "function transferFrom(address from, address to, uint256 tokenId) external",
    "function getDomainId(string memory name, string memory extension) external pure returns (uint256)",
    "function getDomainInfo(uint256 tokenId) external view returns (string memory name, string memory extension, address owner, uint256 mintedAt)",
    "function totalSupply() external view returns (uint256)",
    "event DomainRegistered(uint256 indexed tokenId, string name, string extension, address indexed owner, uint256 mintedAt)"
  ];
  
  export const MARKETPLACE_ABI = [
    "function listDomain(uint256 tokenId, uint256 price) external",
    "function unlistDomain(uint256 tokenId) external",
    "function purchaseDomain(uint256 tokenId) external payable",
    "function updatePrice(uint256 tokenId, uint256 newPrice) external",
    "function getListing(uint256 tokenId) external view returns (address seller, uint256 price, uint256 listedAt, bool active)",
    "function getActiveListings() external view returns (uint256[] memory)",
    "function isListed(uint256 tokenId) external view returns (bool)",
    "event DomainListed(uint256 indexed tokenId, address indexed seller, uint256 price, uint256 listedAt)",
    "event DomainSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price, uint256 soldAt)",
    "event DomainUnlisted(uint256 indexed tokenId, address indexed seller, uint256 unlistedAt)"
  ];
  
  export const RESOLVER_ABI = [
    "function resolve(string memory domain) external view returns (address)",
    "function setResolution(string memory domain, address addr) external",
    "function reverseResolve(address addr) external view returns (string memory)",
    "function getTextRecord(string memory domain, string memory key) external view returns (string memory)",
    "function setTextRecord(string memory domain, string memory key, string memory value) external",
    "function removeTextRecord(string memory domain, string memory key) external",
    "function getMultipleTextRecords(string memory domain, string[] memory keys) external view returns (string[] memory)",
    "event ResolutionSet(string indexed domain, address indexed addr, uint256 updatedAt)",
    "event TextRecordSet(string indexed domain, string indexed key, string value, uint256 updatedAt)"
  ];
  
  export const EXTENSION_MANAGER_ABI = [
    "function getExtensionPrice(string memory extension) external view returns (uint256)",
    "function isExtensionActive(string memory extension) external view returns (bool)",
    "function getActiveExtensions() external view returns (string[] memory)",
    "function setExtensionPrice(string memory extension, uint256 price) external",
    "function activateExtension(string memory extension, uint256 price) external",
    "function deactivateExtension(string memory extension) external",
    "event ExtensionActivated(string extension, uint256 price, uint256 activatedAt)",
    "event ExtensionPriceUpdated(string extension, uint256 oldPrice, uint256 newPrice, uint256 updatedAt)"
  ];
  