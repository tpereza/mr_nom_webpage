'use client';

import Image from "next/image";

function ShopPageContent() {


  return (
    <main className="min-h-screen bg-black">
      {/* NAV */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-center gap-4 sm:gap-8">
          <a href="/" className="block">
            <Image
              src="/images/logo.png"
              alt="MR+NØM Logo"
              width={120}
              height={40}
              className="cursor-pointer"
            />
          </a>
          <nav className="flex flex-wrap items-center gap-4 sm:gap-8 sm:ml-8">
            <a className="nav-link" href="/evento">EXPERIENCIA</a>
            <a className="nav-link" href="/contact">CONTACTO</a>
            <a className="nav-link text-white font-semibold" href="/shop">SHOP</a>
          </nav>
        </div>
      </header>

      {/* DISABLED SHOP SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-20">
        <div className="text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="grad-multiline font-black leading-[0.95] tracking-tight text-[40px] sm:text-[50px] md:text-[60px] lg:text-[70px] xl:text-[80px] mb-6">
            <span className="grad-pink-blue">Shop</span><br/>
            <span className="grad-pink italic">temporalmente</span><br/>
            <span className="grad-pink-blue">deshabilitado</span>
          </h1>

          {/* Description */}
          <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Estamos trabajando en mejorar la experiencia de compra. 
            Pronto estará disponible nuevamente.
          </p>

          {/* Back to Home Button */}
          <a 
            href="/"
            className="inline-block btn-white px-8 py-4 text-lg font-semibold"
          >
            Volver al inicio
          </a>

          {/* Additional Info */}
          <div className="mt-12 p-6 bg-white/5 border border-white/15 rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-white font-semibold text-lg mb-4">¿Necesitas información?</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Si tienes preguntas sobre el evento o necesitas asistencia, 
              puedes contactarnos a través de nuestra página de contacto.
            </p>
            <a 
              href="/contact"
              className="inline-block mt-4 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
            >
              Ir a contacto →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ShopPage() {
  return <ShopPageContent />;
}
