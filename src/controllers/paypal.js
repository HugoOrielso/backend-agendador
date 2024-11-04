import { captureOrderPaypal, createOrder } from '../services/createPaypalOrder.js';

export async function newOrder(req,res) {
    try {
        const { cart } = req.body;
        const request = await createOrder(cart);
        if(request.status === "CREATED"){
            res.status(201).json(request);
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to create order." });
    }
}

export async function captureOrder(req,res) {
    try {
        const { orderID } = req.params
        const request = await captureOrderPaypal(orderID);
        if(request.status === "COMPLETED"){
            res.status(200).json(request);
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to capture order." });
    }
}


