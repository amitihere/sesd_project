import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLogDocument extends Document {
  userId: string;
  expenseId: string;
  action: string;
  fromStatus: string;
  toStatus: string;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    userId: { type: String, required: true, ref: "User" },
    expenseId: { type: String, required: true, ref: "Expense" },
    action: { type: String, required: true },
    fromStatus: { type: String, required: true },
    toStatus: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  {
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

export const AuditLogModel = mongoose.model<IAuditLogDocument>(
  "AuditLog",
  AuditLogSchema
);
