import mongoose, { Schema, Document } from "mongoose";
import { ExpenseStatus, ExpenseType } from "../models/Expense";

export interface IExpenseDocument extends Document {
  type: ExpenseType;
  amount: number;
  description: string;
  employeeId: string;
  status: ExpenseStatus;
}

const ExpenseSchema = new Schema<IExpenseDocument>(
  {
    type: {
      type: String,
      required: true,
      enum: Object.values(ExpenseType),
    },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    employeeId: {
      type: String,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(ExpenseStatus),
      default: ExpenseStatus.DRAFT,
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

export const ExpenseModel = mongoose.model<IExpenseDocument>(
  "Expense",
  ExpenseSchema
);
