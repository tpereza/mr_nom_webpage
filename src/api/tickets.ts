import axios from "axios";
import CryptoJS from "crypto-js";
import { TicketForm } from "../app/page";

const API_KEY = process.env.API_KEY || "";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";

// AES-256-CBC encryption function
function encryptApiKey(apiKey: string, encryptionKey: string): string {
  const key = CryptoJS.enc.Utf8.parse(encryptionKey.padEnd(32, '0').slice(0, 32)); // Ensure 32 bytes for AES-256
  const iv = CryptoJS.enc.Utf8.parse(encryptionKey.padEnd(16, '0').slice(0, 16)); // Ensure 16 bytes for IV
  
  const encrypted = CryptoJS.AES.encrypt(apiKey, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return encrypted.toString();
}

const encryptedApiKey = encryptApiKey(API_KEY, ENCRYPTION_KEY);

const apiHeaders = {
  "x-api-key": encryptedApiKey,
  "Content-Type": "application/json",
};

export async function buyTicketsApi(data: TicketForm) {
  try {
    const response = await axios.post("https://mrnombackend-production.up.railway.app/checkout", {
      "email": data.email,
      "name": data.name,
      "total_amount": data.quantity
    }, {
      headers: apiHeaders
    });
    
    return {
      payment_id: response.data.payment_id,
      name: data.name,
      quantity: data.quantity,
      type: data.type,
      email: data.email
    };
  // eslint-disable-next-line
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to process purchase. Please try again.");
  }
}

export async function checkPaymentStatus(payment_id: string) {
  try {
    const response = await axios.post("https://mrnombackend-production.up.railway.app/webhook", { payment_id, "status": "succeeded" }, {
      headers: apiHeaders
    });
    const data =  response.data;
    return {
      status: data.status,
      pdf_url: data.pdf_url
    }
  // eslint-disable-next-line
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to check payment status. Please try again.");
  }
}

export async function getTicketsByEmail(email: string) {
  try {
    const response = await axios.post("https://mrnombackend-production.up.railway.app/tickets", { email }, {
      headers: apiHeaders
    });
    return response.data;
  // eslint-disable-next-line
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to get tickets. Please try again.");
  }
} 