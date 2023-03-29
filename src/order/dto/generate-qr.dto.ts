interface QrDto {
    station: number,
    fuel_type: string
}

export interface GenerateQrDto {
    qr: QrDto
}