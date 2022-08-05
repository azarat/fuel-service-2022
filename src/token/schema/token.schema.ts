import { Document, Schema, Model, model } from 'mongoose';

export interface TokenDocument extends Document {
  user: string;
  token: string;
  deviceToken: string;
}

export const TokenSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Token = model<TokenDocument>('Token', TokenSchema);
