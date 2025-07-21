"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { buyTicketsApi, checkPaymentStatus } from "../api/tickets";
import Link from "next/link";

const ticketSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  quantity: z.number().min(1, "At least 1 ticket").max(10, "Max 10 tickets"),
  type: z.enum(["General", "VIP"]),
});
const orderSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  quantity: z.number().min(1, "At least 1 ticket").max(10, "Max 10 tickets"),
  type: z.enum(["General", "VIP"]),
  payment_id: z.string().min(1, "Payment ID is required"),
});
const paymentStatusSchema = z.object({
  status: z.string().min(2, "Status is required"),
  pdf_url: z.string().min(1, "Url is required"),
});
export type TicketForm = z.infer<typeof ticketSchema>;
export type OrderForm = z.infer<typeof orderSchema>;
export type PaymentStatusForm = z.infer<typeof paymentStatusSchema>;

export default function Home() {
  const [confirmation, setConfirmation] = useState<OrderForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusForm | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [checkedStatus, setCheckedStatus] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TicketForm>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { quantity: 1, type: "General" },
  });

  const onSubmit = async (data: TicketForm) => {
    setLoading(true);
    setError(null);
    try {
      const order = await buyTicketsApi(data);
      setConfirmation(order);
      reset();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex flex-col items-center justify-center py-10 px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-8">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">Mr x NØM </h1>
          <p className="text-lg text-gray-700 mb-1">Octubre 11, 2025 · 6:00 PM</p>
          <p className="text-md text-gray-500">Bogotá, Colombia</p>
        </header>
        <section className="text-center">
          <p className="text-xl text-gray-800 mb-2">Descripción del evento<br/>Obten tus entradas ahora antes de que se agoten.</p>
        </section>
        <section className="mx-auto w-full max-w-md">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">Comprar entradas</h2>
          {confirmation ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-center">
              <h3 className="font-semibold text-lg mb-2">Gracias por tu compra!</h3>
              <p>ID de la compra: <span className="font-medium">{confirmation.payment_id}</span></p>
              <p>Nombre: <span className="font-medium">{confirmation.name}</span></p>
              <p>Email: <span className="font-medium">{confirmation.email}</span></p>
              <p>Entradas: <span className="font-medium">{confirmation.quantity}</span> ({confirmation.type})</p>
              {paymentStatus && (
                <div className="mt-4 p-2 rounded bg-blue-100 text-blue-800">
                  Estado del pago: <span className="font-semibold">{paymentStatus.status}</span>
                </div>
              )}
              {paymentStatus && paymentStatus.pdf_url && (
                <a
                  href={paymentStatus.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition inline-block"
                  download
                >
                  Descargar ticket
                </a>
              )}
              {!checkedStatus || (paymentStatus && paymentStatus.status !== "Aprobado") ? (
                <button
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-60"
                  onClick={async () => {
                    setCheckingStatus(true);
                    setError(null);
                    try {
                      const status = await checkPaymentStatus(confirmation.payment_id);
                      setPaymentStatus(status);
                      if (status.status === "Aprobado") {
                        setCheckedStatus(true);
                      }
                    } catch (err: unknown) {
                      if (err instanceof Error) setError(err.message);
                      else setError("Unknown error");
                    } finally {
                      setCheckingStatus(false);
                    }
                  }}
                  disabled={checkingStatus}
                >
                  {checkingStatus ? "Consultando..." : "Ver estado de pago"}
                </button>
              ) : null}
              {paymentStatus && paymentStatus.status === "Aprobado" && (
                <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                    onClick={() => {
                      setConfirmation(null);
                      setPaymentStatus(null);
                      setCheckedStatus(false);
                    }}
                  >
                    Comprar más entradas
                  </button>
                  <Link
                    href={`/tickets?email=${encodeURIComponent(confirmation.email)}`}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition inline-block"
                  >
                    Consultar mis tickets
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {error && <div className="bg-red-100 border border-red-300 text-red-700 rounded p-2 text-center">{error}</div>}
              {loading && <div className="text-indigo-600 text-center">Procesando compra...</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.name ? "border-red-400" : "border-gray-300"}`}
                  placeholder="Your Name"
                />
                {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.email ? "border-red-400" : "border-gray-300"}`}
                  placeholder="you@email.com"
                />
                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
        </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de entradas</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  {...register("quantity", { valueAsNumber: true, setValueAs: v => v === '' ? undefined : Number(v) })}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.quantity ? "border-red-400" : "border-gray-300"}`}
                />
                {errors.quantity && <span className="text-red-500 text-xs">{errors.quantity.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de entrada</label>
                <select
                  {...register("type")}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.type ? "border-red-400" : "border-gray-300"}`}
                >
                  <option value="General">General</option>
                  <option value="VIP">VIP</option>
                </select>
                {errors.type && <span className="text-red-500 text-xs">{errors.type.message}</span>}
              </div>
              <button
                type="submit"
                className="mt-2 px-6 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition"
                disabled={loading}
              >
                Comprar entradas
              </button>
            </form>
          )}
        </section>
      </div>
      <footer className="mt-10 text-gray-500 text-sm text-center flex flex-col items-center gap-2">
        &copy; 2025 Mr x NØM. All rights reserved.
        <Link
          href="/tickets"
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition inline-block"
        >
          Consultar mis tickets
        </Link>
      </footer>
    </div>
  );
}
