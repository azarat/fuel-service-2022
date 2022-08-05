import { Document, Schema, model } from 'mongoose';

export interface OrderDocument extends Document {
  orderId: number;
  user: string;
}

export const OrderSchema = new Schema(
  {
    orderId: {
      type: Number,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Order = model<OrderDocument>('Order', OrderSchema);
