import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  restaurantName: string;
  itemCount: number;
  isPaid: boolean;
  deliveryDistance: number;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    restaurantName: { type: String, required: true },
    itemCount: { type: Number, required: true, min: 1 },
    isPaid: { type: Boolean, required: true },
    deliveryDistance: { type: Number, required: true, min: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;

