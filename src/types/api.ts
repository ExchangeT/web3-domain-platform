export interface ApiResponse<T = unknown> {
    success: boolean
    message?: string
    data?: T
    error?: string
  }
  
  export interface PaginationParams {
    limit?: number
    offset?: number
  }
  
  export interface PaginationResponse {
    total?: number
    limit: number
    offset: number
    hasMore?: boolean
  }