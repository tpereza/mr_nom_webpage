'use client';

import Image from "next/image";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { apiService, TicketPurchaseData, TicketPurchaseResponse } from "../services/api";

export default function ShopPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    ticketType: '',
    ticketCount: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<TicketPurchaseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTimeout, setIsTimeout] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPurchaseResult(null);
    setIsTimeout(false);

    // Set up timeout for the request
    const timeoutId = setTimeout(() => {
      setIsTimeout(true);
      setIsLoading(false);
    }, 30000); // 30 seconds timeout

    try {
      const purchaseData: TicketPurchaseData = {
        name: formData.name,
        email: formData.email,
        quantity: parseInt(formData.ticketCount),
        type: formData.ticketType
      };

      const result = await apiService.buyTickets(purchaseData);
      
      // Clear timeout since request completed
      clearTimeout(timeoutId);
      
      // Redirect to payment URL
      if (result.payment_url) {
        window.location.href = result.payment_url;
      } else {
        setPurchaseResult(result);
      }
    } catch (err) {
      // Clear timeout since request failed
      clearTimeout(timeoutId);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <main className="min-h-screen bg-black">
      {/* NAV */}
      <header className="max-w-7xl mx-auto px-6 pt-6 flex items-center gap-8">
        <a href="/" className="block">
          <Image
            src="/images/logo.png"
            alt="MR+NØM Logo"
            width={120}
            height={40}
            className="cursor-pointer"
          />
        </a>
        <nav className="ml-8 flex items-center gap-8">
          <a className="nav-link" href="/">HOME</a>
          <a className="nav-link" href="/contact">CONTACTO</a>
          <a className="nav-link text-white font-semibold" href="/shop">SHOP</a>
        </nav>
        <div className="ml-auto relative w-[380px]">
          <MagnifyingGlassIcon className="h-5 w-5 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input className="pill-input w-full" placeholder="Buscar" />
        </div>
      </header>

      {/* SHOP SECTION */}
      <section className="max-w-4xl mx-auto px-6 pt-20">
        <div className="text-center mb-12">
          <h1 className="grad-multiline font-black leading-[0.95] tracking-tight text-[50px] sm:text-[60px] md:text-[70px] lg:text-[80px]">
            <span className="grad-pink-blue">Compra tus</span><br/>
            <span className="grad-pink italic">boletos</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed text-white/80">
            Asegura tu lugar en el evento más esperado del año. Completa el formulario y prepárate para una experiencia inolvidable.
          </p>
        </div>

        {/* SUCCESS VIEW */}
        {purchaseResult && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 border border-white/15 rounded-2xl p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">¡Compra Exitosa!</h2>
                <p className="text-white/80">Tu pedido ha sido procesado correctamente</p>
              </div>
              
              <div className="bg-black/20 rounded-xl p-6 mb-6 text-left">
                <h3 className="text-lg font-semibold text-white mb-4">Detalles de tu pedido:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Payment ID:</span>
                    <span className="text-white font-mono">{purchaseResult.payment_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Nombre:</span>
                    <span className="text-white">{purchaseResult.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Email:</span>
                    <span className="text-white">{purchaseResult.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Tipo:</span>
                    <span className="text-white">{purchaseResult.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Cantidad:</span>
                    <span className="text-white">{purchaseResult.quantity}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setPurchaseResult(null)}
                className="btn-white px-8 py-3"
              >
                Realizar otra compra
              </button>
            </div>
          </div>
        )}

        {/* ERROR VIEW */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Error en la compra</h2>
                <p className="text-white/80">{error}</p>
              </div>
              
              <button 
                onClick={() => setError(null)}
                className="btn-white px-8 py-3"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        )}

        {/* TIMEOUT VIEW */}
        {isTimeout && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Tiempo de espera agotado</h2>
                <p className="text-white/80">
                  Estamos experimentando algunos problemas técnicos. Por favor, intenta de nuevo más tarde.
                </p>
              </div>
              
              <button 
                onClick={() => {
                  setIsTimeout(false);
                  setError(null);
                  setPurchaseResult(null);
                }}
                className="btn-white px-8 py-3"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        )}

        {/* TICKET PURCHASE FORM */}
        {!purchaseResult && !error && !isTimeout && (
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-3">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full bg-white/5 border border-white/15 rounded-full px-6 py-4 outline-none placeholder-white/40 text-white focus:border-white/30 transition"
                placeholder="tu@email.com"
              />
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-3">
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-white/5 border border-white/15 rounded-full px-6 py-4 outline-none placeholder-white/40 text-white focus:border-white/30 transition"
                placeholder="Tu nombre completo"
              />
            </div>

            {/* Ticket Type Field */}
            <div>
              <label htmlFor="ticketType" className="block text-sm font-medium text-white/90 mb-3">
                Tipo de Boleto
              </label>
              <select
                id="ticketType"
                name="ticketType"
                value={formData.ticketType}
                onChange={handleInputChange}
                required
                className="w-full bg-white/5 border border-white/15 rounded-full px-6 py-4 outline-none text-white focus:border-white/30 transition appearance-none cursor-pointer"
              >
                <option value="" className="bg-black text-white">Selecciona el tipo de boleto</option>
                <option value="general" className="bg-black text-white">General - $60,000</option>
                <option value="vip" className="bg-black text-white">VIP - $90,000</option>
              </select>
            </div>

            {/* Number of Tickets Field */}
            <div>
              <label htmlFor="ticketCount" className="block text-sm font-medium text-white/90 mb-3">
                Número de Boletos
              </label>
              <select
                id="ticketCount"
                name="ticketCount"
                value={formData.ticketCount}
                onChange={handleInputChange}
                required
                className="w-full bg-white/5 border border-white/15 rounded-full px-6 py-4 outline-none text-white focus:border-white/30 transition appearance-none cursor-pointer"
              >
                <option value="" className="bg-black text-white">Selecciona cantidad</option>
                <option value="1" className="bg-black text-white">1 boleto</option>
                <option value="2" className="bg-black text-white">2 boletos</option>
                <option value="3" className="bg-black text-white">3 boletos</option>
                <option value="4" className="bg-black text-white">4 boletos</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-white text-lg py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'PROCESANDO...' : 'COMPRAR BOLETOS'}
              </button>
            </div>

            {/* Additional Info */}
            <div className="text-center pt-6">
              <p className="text-sm text-white/60">
                Al completar la compra, recibirás un email de confirmación con los detalles de tu pedido.
              </p>
            </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
