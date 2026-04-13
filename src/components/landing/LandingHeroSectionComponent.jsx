"use client";

import Image from "next/image";
import Link from "next/link";

export default function LandingHeroSectionComponent({ miniProducts }) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 py-14 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-widest text-lime-600">Natural skincare</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Glow from within with our skincare essentials
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Gentle formulas, visible results — curated for calm, balanced skin and a routine you will
            actually enjoy.
          </p>
          <Link
            href="/shop"
            className="mt-10 inline-flex rounded-full bg-lime-400 px-10 py-4 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-lime-300"
          >
            Shop now
          </Link>
        </div>

        <div className="relative lg:min-h-112">
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-gray-100 shadow-lg lg:aspect-auto lg:h-[min(36rem,70vh)]">
            <Image
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=900&h=1100&fit=crop"
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="absolute -bottom-4 left-4 right-4 rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:left-auto sm:right-6 sm:w-72 lg:-left-6 lg:bottom-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Our best sellers
            </p>
            <div className="mt-3 flex gap-2">
              {miniProducts.map((p) => (
                <Link
                  key={p.productId}
                  href={`/products/${p.productId}`}
                  className="relative size-14 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-100"
                >
                  {p.imageUrl ? (
                    <Image src={p.imageUrl} alt="" fill sizes="56px" className="object-cover" />
                  ) : (
                    <span className="flex size-full items-center justify-center text-xs text-gray-400">
                      ◇
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}