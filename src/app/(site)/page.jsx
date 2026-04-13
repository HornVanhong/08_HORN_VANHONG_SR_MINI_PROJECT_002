import Link from "next/link";

import { categories, products } from "../../data/mockData";
import LandingHeroSectionComponent from "../../components/landing/LandingHeroSectionComponent";
import LandingBestSellerSectionComponent from "../../components/landing/LandingBestSellerSectionComponent";
import LandingEssentialComponent from "../../components/landing/LandingEssentialComponent";

const bestSellers = products.slice(0, 4);
const heroStrip = products.slice(0, 3);

export default function Landing() {
  return (
    <div className="bg-[#fafafa]">
      <LandingHeroSectionComponent miniProducts={heroStrip} />
      <LandingBestSellerSectionComponent items={bestSellers} />
      <LandingEssentialComponent />

      <section className="mx-auto w-full max-w-7xl py-16 lg:py-20">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <p className="text-4xl font-semibold tabular-nums text-gray-900 lg:text-5xl">1,200+</p>
            <p className="mt-2 font-medium text-gray-600">Skincare formulas in our catalog demo</p>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-lime-400 p-8 text-gray-900 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider opacity-80">Spotlight</p>
            <p className="mt-4 text-2xl font-semibold leading-snug">No. 1 featured routine starter</p>
            <p className="mt-2 text-sm opacity-90">Student-built UI — swap for your real campaign.</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-amber-100/90 p-8 shadow-sm">
            <p className="text-4xl font-semibold tabular-nums text-gray-900 lg:text-5xl">20+</p>
            <p className="mt-2 font-medium text-gray-800">Countries represented in mock orders</p>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="scroll-mt-28 border-y border-gray-100 bg-white py-16 lg:scroll-mt-32 lg:py-20"
      >
        <div className="mx-auto w-full max-w-7xl">
          <h2 className="text-center text-3xl font-semibold text-gray-900 sm:text-4xl">
            What makes us different
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "100% transparent", d: "Mock data only — no hidden APIs in this classroom build." },
              { t: "Cruelty-free UX", d: "Clear buttons, readable type, and calm spacing by default." },
              { t: "Clinically tidy code", d: "Components you can trace from landing tile to Zustand store." },
              { t: "Ship-ready patterns", d: "Filters, cart, and routes mirror real storefront structure." },
            ].map((item) => (
              <div key={item.t} className="rounded-2xl bg-gray-50/80 p-6">
                <p className="text-lg font-semibold text-gray-900">{item.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <LandingTestimonials /> */}

      <section className="bg-teal-950 py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-0 text-center">
          <h2 className="text-3xl font-semibold leading-tight text-lime-300 sm:text-4xl lg:text-5xl">
            Start getting glowing with our 100% natural skincare story
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-teal-100/90">
            This banner uses deep teal + lime type like the reference — connect it to your real promo
            or newsletter.
          </p>
          <Link
            href="/products"
            className="mt-10 inline-flex rounded-full bg-lime-400 px-10 py-4 text-sm font-semibold text-gray-900 transition hover:bg-lime-300"
          >
            Shop now
          </Link>
        </div>
      </section>

      {/* <LandingDiscountTicker /> */}

      <section className="mx-auto w-full max-w-7xl py-14 text-center text-sm text-gray-500">
        <p>
          Explore{" "}
          <Link href="/categories" className="font-medium text-gray-900 underline-offset-2 hover:underline">
            {categories.length} categories
          </Link>{" "}
          and{" "}
          <Link href="/orders" className="font-medium text-gray-900 underline-offset-2 hover:underline">
            sample orders
          </Link>{" "}
          from the same project.
        </p>
      </section>
    </div>
  );
}