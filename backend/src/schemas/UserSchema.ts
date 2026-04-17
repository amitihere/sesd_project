import mongoose, { Schema, Document } from "mongoose";
import { UserRole } from "../models/User";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  role: UserRole;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: {
      type: String,
      required: true,
      enum: Object.values(UserRole),
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc: any, ret: any) {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);
