import axios from 'axios';
import { CLIENT_ID_PAYPAL, SECRET_KEY_PAYPAL } from '../config.js';
const BASE_URL = "https://api-m.sandbox.paypal.com";

export default async function generateAccessToken() {
    try {
        const BASE64_ENCODED_CLIENT_ID_AND_SECRET = Buffer.from(
            `${CLIENT_ID_PAYPAL}:${SECRET_KEY_PAYPAL}`
        ).toString("base64");
        const { data } = await axios({
            url:"https://api-m.sandbox.paypal.com/v1/oauth2/token",
            method: "POST",
            data: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${BASE64_ENCODED_CLIENT_ID_AND_SECRET}`
            }
        })
        return data.access_token

    } catch (error) {
        throw new Error("Ocurrió un error")
    }
} 


export const createOrder = async (cart) => {
    try {
        const {quantity} = cart[0]
        const accessToken = await generateAccessToken();
        const url = `${BASE_URL}/v2/checkout/orders`;
        const payload = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "EUR",
                        value: quantity,
                    },
                },
            ],
        };
        const {data} = await axios({
            url: url,
            method: "POST",
            headers:{
                Authorization: `Bearer ${accessToken}`
            },
            data: payload
        })
        return data
    } catch (error) {
        throw new Error("Ocurrió un error")
    }
};

export async function captureOrderPaypal (orderID){
    try {
        const accessToken = await generateAccessToken();
        const url = `${BASE_URL}/v2/checkout/orders/${orderID}/capture`;
        const {data} = await axios({
            url: url,
            method: "POST",
            headers:{
                "Content-type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            }
        })
        return data
    } catch (error) {
        throw new Error("Ocurrió un error")
    }
}