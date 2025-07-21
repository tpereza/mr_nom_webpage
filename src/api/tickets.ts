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
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as any).response === "object" &&
      (error as any).response.data &&
      (error as any).response.data.message
    ) {
      throw new Error((error as any).response.data.message);
    }
    throw new Error("Failed to process purchase. Please try again.");
  }
} 