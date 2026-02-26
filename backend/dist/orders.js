"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Order_1 = __importDefault(require("./models/Order"));
const router = (0, express_1.Router)();
// Add Order
router.post('/', async (req, res) => {
    try {
        const { orderId, restaurantName, itemCount, isPaid, deliveryDistance } = req.body;
        if (!orderId || !restaurantName || itemCount == null || isPaid == null || deliveryDistance == null) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const existing = await Order_1.default.findOne({ orderId });
        if (existing) {
            return res.status(400).json({ message: 'Order with this orderId already exists' });
        }
        const order = new Order_1.default({
            orderId,
            restaurantName,
            itemCount,
            isPaid,
            deliveryDistance,
        });
        const saved = await order.save();
        res.status(201).json(saved);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create order' });
    }
});
// View / Filter Orders
router.get('/', async (req, res) => {
    try {
        const { isPaid, maxDistance } = req.query;
        const filter = {};
        if (isPaid !== undefined) {
            filter.isPaid = isPaid === 'true';
        }
        if (maxDistance !== undefined) {
            const max = Number(maxDistance);
            if (!Number.isNaN(max)) {
                filter.deliveryDistance = { $lte: max };
            }
        }
        const orders = await Order_1.default.find(filter).sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});
// Assign Delivery: nearest unpaid within maxDistance
router.post('/assign-delivery', async (req, res) => {
    try {
        const { maxDistance } = req.body;
        const max = Number(maxDistance);
        const distanceFilter = {};
        if (!Number.isNaN(max) && max > 0) {
            distanceFilter.deliveryDistance = { $lte: max };
        }
        const candidate = await Order_1.default.findOne({
            isPaid: false,
            ...distanceFilter,
        }).sort({ deliveryDistance: 1, createdAt: 1 });
        if (!candidate) {
            return res.status(404).json({ message: 'No order available' });
        }
        // mark as paid when assigned (assuming delivery is accepted/locked)
        candidate.isPaid = true;
        await candidate.save();
        res.json({ message: 'Delivery assigned', order: candidate });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to assign delivery' });
    }
});
exports.default = router;
//# sourceMappingURL=orders.js.map