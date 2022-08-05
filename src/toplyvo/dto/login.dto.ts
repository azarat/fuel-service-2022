export interface LoginBodyDto {
  phone: string;
  code: string;
}

export interface LoginResponse {
  phone: string;
  token: string;
}
