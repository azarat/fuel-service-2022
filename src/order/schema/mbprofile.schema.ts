import { Document, Schema, model } from 'mongoose';

export interface MbprofileDocument extends Document {
  title: string;
  uuid: string;
  user: string;
}

export const MbprofileSchema = new Schema(
  {
    uuid: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    user: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Mbprofile = model<MbprofileDocument>('Mbprofile', MbprofileSchema);
