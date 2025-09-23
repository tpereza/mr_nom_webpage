
import Image from "next/image";

export default function Page() {
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
            <a className="nav-link" href="/">HOME</a>
            <a className="nav-link" href="/contact">CONTACTO</a>
            <a className="nav-link" href="/shop">SHOP</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-12 gap-4 sm:gap-8 pt-10 sm:pt-20">
        {/* Left text */}
        <div className="col-span-12 lg:col-span-7">
          <h1 className="grad-multiline font-black leading-[0.95] tracking-tight text-[40px] sm:text-[60px] md:text-[80px] lg:text-[90px] xl:text-[110px]">
            <span className="grad-pink-blue">Si quieres</span><br/>
            <span className="grad-pink italic">darte</span><br/>
            <span className="grad-pink-blue">una pausa</span><br/>
          </h1>
          <p className="mt-4 sm:mt-8 max-w-xl text-base sm:text-lg leading-relaxed text-white/80">
            dejar todo en silencio y escuchar lo que realmente importa, esto es para ti.
          </p>
          <a href="/shop" className="mt-4 sm:mt-8 btn-white inline-block">COMPRA AHORA</a>
        </div>

        {/* Right images */}
        <div className="relative col-span-12 lg:col-span-5 mt-8 lg:mt-0">
          <div className="w-full max-w-[320px] sm:max-w-[420px] md:max-w-[520px] h-[200px] sm:h-[280px] md:h-[320px] relative overflow-hidden mx-auto lg:mx-0">
            <Image
              src="/images/dj1.png"
              alt="DJ Black and white 1"
              fill
              className="object-cover grayscale"
              priority
            />
          </div>
          <div className="w-full max-w-[320px] sm:max-w-[420px] md:max-w-[520px] h-[220px] sm:h-[300px] md:h-[360px] relative overflow-hidden translate-x-4 sm:translate-x-8 md:translate-x-20 translate-y-4 sm:translate-y-6 md:translate-y-10 mx-auto lg:mx-0">
            <Image
              src="/images/dj2.png"
              alt="DJ Black and white 2"
              fill
              className="object-cover grayscale"
              priority
            />
          </div>
        </div>
      </section>

      {/* INSTAGRAM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-24">
        <div className="text-center">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Mantente al día con el evento
            </h2>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
              Síguenos en Instagram para recibir las últimas actualizaciones, contenido exclusivo y noticias sobre el evento
            </p>
          </div>
          
          <a
            href="https://www.instagram.com/mr.nom.oficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {/* Instagram Logo */}
            <Image
              src="/images/instagram_logo.png"
              alt="Instagram Logo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            
            {/* Text */}
            <span>Síguenos en Instagram</span>
            
            {/* Arrow Icon */}
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          
          {/* Instagram Handle */}
          <p className="mt-4 text-white/60 text-sm">
            @mr.nom.oficial
          </p>
        </div>
      </section>
    </main>
  );
}
