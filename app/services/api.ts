import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.API_BASE_URL ||'http://localhost:3000'; //'https://mrnombackend-production.up.railway.app';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

// Types for our API
export interface TicketPurchaseData {
  name: string;
  email: string;
  quantity: number;
  type: string;
}

export interface TicketPurchaseResponse {
  payment_id: string;
  name: string;
  quantity: number;
  type: string;
  email: string;
  payment_url: string;
}

export interface TicketStatus {
  id: string;
  order_id: string;
  uuid: string;
  pdf_url: string;
  qr_code: string;
  created_at: string;
}

export interface PaymentVerifyResponse {
  message: string;
  order_id: string;
  payment_id: string;
  status: string;
}

export interface DownloadTicketsResponse {
  success: boolean;
  status: string;
  ticketCount: number;
  tickets: PaymentTicketsResponse[];
}

export interface PaymentTicketsResponse {
  id: string;
  order_id: string;
  uuid: string;
  pdf_url: string;
  qr_code: string;
  created_at?: string;
  valid?: boolean;
}

function getApiHeaders() {
  return {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
  };
}

// API service class
export class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 100000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Buy tickets API call
  async buyTickets(data: TicketPurchaseData): Promise<TicketPurchaseResponse> {
    try {
      const requestData = {
        "email": data.email,
        "name": data.name,
        "total_amount": data.quantity,
        "type": data.type
      };
      
      const response = await this.axiosInstance.post('/checkout', requestData,{
        headers: getApiHeaders()
      });
      console.log(response.data);
      return {
        payment_id: response.data.payment_id,
        name: data.name,
        quantity: data.quantity,
        type: response.data.type,
        email: data.email,
        payment_url: response.data.payment_url
      };
    } catch (error) {
      console.error('Error comprando tickets:', error);
      throw new Error('No se pudo procesar la compra. Por favor intenta mas tarde.');
    }
  }

  // Check tickets by email
  async checkTicketsByEmail(email: string): Promise<TicketStatus[]> {
    try {
      const response = await this.axiosInstance.post(`/tickets`,{ email }, {
        headers: getApiHeaders()
      })
      
      return response.data;
    } catch (error) {
      console.error('Error checking tickets:', error);
      throw new Error('No se pudo obtener la informacion. Por favor intenta mas tarde.');
    }
  }

  // Verify payment
  async verifyPayment(payment_id: string): Promise<PaymentVerifyResponse> {
    try {
      const response = await this.axiosInstance.get(`/verify?payment_id=${encodeURIComponent(payment_id)}`, {
        headers: getApiHeaders()
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw new Error('No se pudo verificar el pago. Por favor intenta mas tarde.');
    }
  }

  // Download tickets via webhook
  async downloadTickets(payment_id: string): Promise<DownloadTicketsResponse> {
    try {
      const requestData = {
        payment_id
      };
      
      const response = await this.axiosInstance.post('/webhook', requestData, {
        headers: getApiHeaders()
      });
      
      return response.data;
    } catch (error) {
      console.error('Error downloading tickets:', error);
      throw new Error('No se pudieron descargar los tickets. Por favor intenta mas tarde.');
    }
  }

  // Get tickets by payment ID
  async getTicketsByPaymentId(payment_id: string): Promise<PaymentTicketsResponse[]> {
    try {
      const response = await this.axiosInstance.get(`/tickets/payment/${encodeURIComponent(payment_id)}`, {
        headers: getApiHeaders()
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching tickets by payment ID:', error);
      throw new Error('No se pudieron obtener los tickets. Por favor intenta mas tarde.');
    }
  }

  // Future API methods can be added here
  // async getEvents(): Promise<Event[]> { ... }
  // async getUserTickets(userId: string): Promise<Ticket[]> { ... }
}

// Export singleton instance
export const apiService = ApiService.getInstance();