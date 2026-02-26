import mongoose, { Document } from 'mongoose';
export interface IOrder extends Document {
    orderId: string;
    restaurantName: string;
    itemCount: number;
    isPaid: boolean;
    deliveryDistance: number;
    createdAt: Date;
}
declare const Order: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, mongoose.DefaultSchemaOptions> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IOrder>;
export default Order;
//# sourceMappingURL=Order.d.ts.map