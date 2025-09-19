import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function ContactPage() {
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
          <a className="nav-link text-white font-semibold" href="/contact">CONTACTO</a>
          <a className="nav-link" href="/shop">SHOP</a>
        </nav>
        <div className="ml-auto relative w-[380px]">
          <MagnifyingGlassIcon className="h-5 w-5 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input className="pill-input w-full" placeholder="Buscar" />
        </div>
      </header>

      {/* CONTACT SECTION */}
      <section className="max-w-4xl mx-auto px-6 pt-20">
        <div className="text-center mb-12">
          <h1 className="grad-multiline font-black leading-[0.95] tracking-tight text-[50px] sm:text-[60px] md:text-[70px] lg:text-[80px]">
            <span className="grad-pink-blue">Contáctanos</span><br/>
            <span className="grad-pink italic">aquí</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed text-white/80">
            ¿Tienes alguna pregunta, sugerencia o problema? Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
          </p>
        </div>

        {/* CONTACT FORM */}
        <div className="max-w-2xl mx-auto">
          <form className="space-y-8">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-3">
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full bg-white/5 border border-white/15 rounded-full px-6 py-4 outline-none placeholder-white/40 text-white focus:border-white/30 transition"
                placeholder="Tu nombre completo"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-3">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full bg-white/5 border border-white/15 rounded-full px-6 py-4 outline-none placeholder-white/40 text-white focus:border-white/30 transition"
                placeholder="tu@email.com"
              />
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white/90 mb-3">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={8}
                className="w-full bg-white/5 border border-white/15 rounded-2xl px-6 py-4 outline-none placeholder-white/40 text-white focus:border-white/30 transition resize-none"
                placeholder="Cuéntanos qué problema tienes, qué sugerencia quieres hacernos, o cualquier otra consulta..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full btn-white text-lg py-4 font-semibold"
              >
                ENVIAR MENSAJE
              </button>
            </div>

            {/* Additional Info */}
            <div className="text-center pt-6">
              <p className="text-sm text-white/60">
                Nos comprometemos a responder todos los mensajes en un plazo de 24 horas.
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
