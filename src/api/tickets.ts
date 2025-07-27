import axios from "axios";
import { TicketForm } from "../app/page";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";


function getApiHeaders() {
  return {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
  };
}

export async function buyTicketsApi(data: TicketForm) {
  try {
    const requestData = {
      "email": data.email,
      "name": data.name,
      "total_amount": data.quantity
    };
    
    const response = await axios.post("https://mrnombackend-production.up.railway.app/checkout", requestData, {
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
      status: data.success ? "Aprobado" : "Pendiente",
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