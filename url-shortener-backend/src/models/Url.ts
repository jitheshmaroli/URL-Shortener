import { Schema, model, Document } from 'mongoose';

export interface IUrl extends Document {
  _id: string;
  userId: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: Date;
}

const urlSchema = new Schema<IUrl>({
  userId: { type: String, required: true },
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<IUrl>('Url', urlSchema);
