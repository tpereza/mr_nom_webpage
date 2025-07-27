"use client";
import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getTicketsByEmail } from "../../api/tickets";
import { useSearchParams } from "next/navigation";

const emailSchema = z.object({
  email: z.string().email("Email inválido"),
});

type EmailForm = z.infer<typeof emailSchema>;

type Ticket = {
  id: string;
  order_id: string;
  uuid: string;
  pdf_url: string;
  qr_code: string;
  created_at: string;
};

function TicketsPageInner() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams?.get("email") || "";
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTickets, setShowTickets] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: emailFromQuery },
  });

  const onSubmit = async (data: EmailForm) => {
    setLoading(true);
    setError(null);
    setTickets(null);
    setShowTickets(false);
    try {
      const ticketsData = await getTicketsByEmail(data.email);
      setShowTickets(true);
      setTickets(ticketsData);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (emailFromQuery && searchParams) {
      setValue("email", emailFromQuery);
      handleSubmit(onSubmit)();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailFromQuery, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex flex-col items-center justify-center py-10 px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-8">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-2 text-center">Consultar tus tickets</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
          <button
            type="submit"
            className="mt-2 px-6 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? "Consultando..." : "Consultar tickets"}
          </button>
        </form>
        {error && <div className="bg-red-100 border border-red-300 text-red-700 rounded p-2 text-center">{error}</div>}
        {showTickets && tickets && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4 text-center">Tus tickets</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {tickets.map(ticket => (
                <div key={ticket.id} className="border rounded-lg p-4 flex flex-col items-center bg-gray-50 shadow">
                  <div className="mb-2 text-sm text-gray-500">Ticket ID: {ticket.id}</div>
                  <div className="mb-2 text-sm text-gray-500">Orden: {ticket.order_id}</div>
                  <img src={"/black-check.webp"} alt="Descargar ticket" className="w-24 h-24 mb-2" />
                  <a
                    href={ticket.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    download
                  >
                    Descargar PDF
                  </a>
                  <div className="mt-2 text-xs text-gray-400">Creado: {new Date(ticket.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TicketsPage() {
  return (
    <Suspense>
      <TicketsPageInner />
    </Suspense>
  );
} 