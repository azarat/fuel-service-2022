export interface MobistaRequest {
    name?: string
    address?: string 
    location?: string 
    phone?: string 
    fuelType?: string 
    fuelAmount?: string 
    date?: string 
    time?: string 
    payMethod?: string 
    comment?: string 
}

export interface MobistaTokenUuidHeadersDto {
    token: string;
    // 'token-mobista': string;  
}