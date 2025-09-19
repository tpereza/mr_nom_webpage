'use client';

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import { apiService, PaymentVerifyResponse, DownloadTicketsResponse, PaymentTicketsResponse } from "../services/api";

function VerifyPageContent() {
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentVerifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadResult, setDownloadResult] = useState<DownloadTicketsResponse | null>(null);
  const [tickets, setTickets] = useState<PaymentTicketsResponse[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [ticketsError, setTicketsError] = useState<string | null>(null);
  const hasCalledApi = useRef(false);
  
  const payment_id = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const merchant_order_id = searchParams.get('merchant_order_id');

  // Load payment data when component mounts
  useEffect(() => {
    const loadPaymentData = async () => {
      // Prevent duplicate API calls
      if (hasCalledApi.current) {
        return;
      }

      if (payment_id) {
        hasCalledApi.current = true;
        try {
          setIsLoading(true);
          const data = await apiService.verifyPayment(payment_id);
          setPaymentData(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error al cargar los datos del pago');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadPaymentData();
  }, [payment_id]);

  // Load tickets when payment data is available
  useEffect(() => {
    const loadTickets = async () => {
      if (paymentData?.payment_id) {
        setIsLoadingTickets(true);
        setTicketsError(null);
        
        try {
          const ticketsData = await apiService.getTicketsByPaymentId(paymentData.payment_id);
          setTickets(ticketsData);
        } catch (err) {
          setTicketsError(err instanceof Error ? err.message : 'Error al cargar tickets');
          setTickets([]);
        } finally {
          setIsLoadingTickets(false);
        }
      }
    };

    loadTickets();
  }, [paymentData?.payment_id]);

  // Handle ticket download
  const handleDownloadTickets = async () => {
    if (!paymentData?.payment_id) {
      return;
    }

    setIsDownloading(true);
    setDownloadError(null);
    setDownloadResult(null);

    try {
      const result = await apiService.downloadTickets(paymentData.payment_id);
      setDownloadResult(result);
      console.log('Download result:', result);
      
      // Update tickets state with the newly generated tickets
      if (result.success && result.tickets.length > 0) {
        setTickets(result.tickets);
      }
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : 'Error al descargar tickets');
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle individual ticket download
  const handleDownloadTicket = (ticket: PaymentTicketsResponse) => {
    if (ticket.pdf_url) {
      window.open(ticket.pdf_url, '_blank');
    }
  };

  return (
    <main className="min-h-screen bg-black">
      {/* Header with Logo Only */}
      <header className="max-w-7xl mx-auto px-6 pt-6">
        <a href="/" className="block">
          <Image
            src="/images/logo.png"
            alt="MR+NØM Logo"
            width={120}
            height={40}
            className="cursor-pointer"
          />
        </a>
      </header>

      {/* VERIFY SECTION */}
      <section className="max-w-4xl mx-auto px-6 pt-20">
        <div className="text-center mb-12">
          <h1 className="grad-multiline font-black leading-tight tracking-tight text-[50px] sm:text-[60px] md:text-[70px] lg:text-[80px] px-8">
            <span className="grad-pink-blue">Verificación de</span><br/>
            <span className="grad-pink italic pl-4">pago</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed text-white/80">
            Aquí puedes ver los detalles de tu transacción de pago.
          </p>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 border border-white/15 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Verificando pago...
                </h2>
                <p className="text-white/80">
                  Estamos validando los detalles de tu transacción
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Error al verificar</h2>
                <p className="text-white/80">{error}</p>
              </div>
              
              <button 
                onClick={() => window.location.reload()}
                className="btn-white px-8 py-3"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        )}

        {/* PAYMENT DETAILS */}
        {!isLoading && !error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 border border-white/15 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Detalles del Pago
              </h2>
              
              <div className="space-y-6">
                <div className="bg-black/20 rounded-xl p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 font-medium">Payment ID:</span>
                      <span className="text-white font-mono text-lg">
                        {paymentData?.payment_id || 'No disponible'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 font-medium">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        paymentData?.status === 'approved' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : paymentData?.status === 'rejected'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {paymentData?.status === 'approved' 
                          ? 'Aprobado'
                          : paymentData?.status === 'rejected'
                          ? 'Rechazado'
                          : paymentData?.status
                          ? 'Pendiente'
                          : 'No disponible'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 font-medium">Order ID:</span>
                      <span className="text-white font-mono text-lg">
                        {paymentData?.order_id || 'No disponible'}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Download Success */}
                {downloadResult && downloadResult.success && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                    <div className="mb-2">
                      <svg className="w-6 h-6 text-green-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-green-400 font-semibold">¡Tickets generados exitosamente!</p>
                    </div>
                    <p className="text-green-300 text-sm">
                      {downloadResult.ticketCount} ticket{downloadResult.ticketCount !== 1 ? 's' : ''} generado{downloadResult.ticketCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}

                {/* Download Error */}
                {downloadError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                    <p className="text-red-400 text-sm">{downloadError}</p>
                  </div>
                )}

                {/* Tickets Section - Show when tickets are available */}
                {paymentData?.status === 'approved' && (
                  <div className="pt-6">
                    {/* Loading Tickets */}
                    {isLoadingTickets && (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white/80">Cargando tickets...</p>
                      </div>
                    )}

                    {/* Tickets Error */}
                    {ticketsError && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center mb-4">
                        <p className="text-red-400 text-sm">{ticketsError}</p>
                      </div>
                    )}

                    {/* Show Tickets if Available */}
                    {!isLoadingTickets && !ticketsError && tickets.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-white mb-4 text-center">
                          Tus Tickets ({tickets.length})
                        </h3>
                        <div className="space-y-3">
                          {tickets.map((ticket, index) => (
                            <div key={ticket.id} className="bg-black/20 rounded-xl p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">#{index + 1}</span>
                                  </div>
                                  <div>
                                    <p className="text-white font-medium">Ticket ID: {ticket.id}</p>
                                    <p className="text-white/70 text-sm">UUID: {ticket.uuid}</p>
                                    {ticket.created_at && (
                                      <p className="text-white/70 text-sm">
                                        Creado: {new Date(ticket.created_at).toLocaleDateString('es-CO')}
                                      </p>
                                    )}
                                    {ticket.valid !== undefined && (
                                      <div className="flex items-center mt-1">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                          ticket.valid 
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        }`}>
                                          {ticket.valid ? 'Válido' : 'Inválido'}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDownloadTicket(ticket)}
                                  className="btn-white px-4 py-2 text-sm"
                                >
                                  Descargar
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Download Button - Show when no tickets available */}
                    {!isLoadingTickets && !ticketsError && tickets.length === 0 && (
                      <div className="text-center pt-4">
                        <button
                          onClick={handleDownloadTickets}
                          disabled={isDownloading}
                          className="btn-white px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDownloading ? 'DESCARGANDO...' : 'DESCARGAR TICKETS'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="text-center pt-4">
                  <a
                    href="/shop"
                    className="btn-white px-8 py-3 inline-block"
                  >
                    Volver a la tienda
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black">
        <header className="max-w-7xl mx-auto px-6 pt-6">
          <a href="/" className="block">
            <Image
              src="/images/logo.png"
              alt="MR+NØM Logo"
              width={120}
              height={40}
              className="cursor-pointer"
            />
          </a>
        </header>
        <section className="max-w-4xl mx-auto px-6 pt-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-white/80">Cargando...</p>
          </div>
        </section>
      </main>
    }>
      <VerifyPageContent />
    </Suspense>
  );
}
