import axios from "axios";
import CryptoJS from "crypto-js";
import { TicketForm } from "../app/page";

const API_KEY = process.env.API_KEY || "";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";

function encryptApiKey(apiKey: string, encryptionKey: string): string {
  const key = CryptoJS.PBKDF2(encryptionKey, 'salt', { keySize: 256/32 });
  const encrypted = CryptoJS.AES.encrypt(apiKey, key).toString();
  return encrypted;
}

function getApiHeaders() {
  const encryptedApiKey = encryptApiKey(API_KEY, ENCRYPTION_KEY);
  return {
    "x-api-key": encryptedApiKey,
    "Content-Type": "application/json",
  };
}

export async function buyTicketsApi(data: TicketForm) {
  try {
    const response = await axios.post("https://mrnombackend-production.up.railway.app/checkout", {
      "email": data.email,
      "name": data.name,
      "total_amount": data.quantity
    }, {
      headers: getApiHeaders()
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
    throw new Error("No pudimos procesar tu compra. Por favor, intenta nuevamente.");
  }
}

export async function checkPaymentStatus(payment_id: string) {
  try {
    const response = await axios.post("https://mrnombackend-production.up.railway.app/webhook", { payment_id, "status": "succeeded" }, {
      headers: getApiHeaders()
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
    throw new Error("No pudimos verificar el estado de tu pago. Por favor, intenta nuevamente.");
  }
}

export async function getTicketsByEmail(email: string) {
  try {
    const response = await axios.post("https://mrnombackend-production.up.railway.app/tickets", { email }, {
      headers: getApiHeaders()
    });
    return response.data;
  // eslint-disable-next-line
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("No pudimos obtener tus tickets. Por favor, intenta nuevamente.");
  }
} 