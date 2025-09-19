
import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Page() {
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
          <a className="nav-link" href="/shop">SHOP</a>
        </nav>
        <div className="ml-auto relative w-[380px]">
          <MagnifyingGlassIcon className="h-5 w-5 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input className="pill-input w-full" placeholder="Buscar" />
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-12 gap-8 pt-20">
        {/* Left text */}
        <div className="col-span-12 md:col-span-6 lg:col-span-7">
          <h1 className="grad-multiline font-black leading-[0.95] tracking-tight text-[60px] sm:text-[80px] md:text-[90px] lg:text-[110px]">
            <span className="grad-pink-blue">Si quieres</span><br/>
            <span className="grad-pink italic">darte</span><br/>
            <span className="grad-pink-blue">una pausa</span><br/>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/80">
            dejar todo en silencio y escuchar lo que realmente importa, esto es para ti.
          </p>
          <a href="/shop" className="mt-8 btn-white inline-block">COMPRA AHORA</a>
        </div>

        {/* Right images */}
        <div className="relative col-span-12 md:col-span-6 lg:col-span-5 mt-10 md:mt-0">
          <div className="w-[520px] h-[320px] relative overflow-hidden">
            <Image
              src="/images/dj1.png"
              alt="DJ Black and white 1"
              fill
              className="object-cover grayscale"
              priority
            />
          </div>
          <div className="w-[520px] h-[360px] relative overflow-hidden translate-x-20 translate-y-10">
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
    </main>
  );
}
