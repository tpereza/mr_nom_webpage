import axios from "axios";
import { TicketForm } from "../app/page";

export async function buyTicketsApi(data: TicketForm) {
  try {
    const response = await axios.post("https://mrnombackend-production.up.railway.app/checkout", {
      "email": data.email,
      "name": data.name,
      "total_amount": data.quantity
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
    const response = await axios.post("https://mrnombackend-production.up.railway.app/webhook", { payment_id, "status": "succeeded" });
    console.log(response.data);
    const data =  response.data;
    return {
      status: data.success ? "Aprobado" : "Pendiente",
      pdf_url: data.pdfUrl
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
    const response = await axios.post("https://mrnombackend-production.up.railway.app/tickets", { email });
    return response.data;
  // eslint-disable-next-line
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to get tickets. Please try again.");
  }
} 