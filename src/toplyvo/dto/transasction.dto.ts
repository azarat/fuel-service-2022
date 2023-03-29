import { transactionTypeEnum } from "../enums/transaction-type.enum";

export interface TransactionDto {
    type: transactionTypeEnum
    amount: number
    date: number
    user_uuid: string
    id: number
    discount: number | null
    fuel_type: string | null
    station_id: number | null
    fuel_icon: string | null
    station_icon: string | null

}
  