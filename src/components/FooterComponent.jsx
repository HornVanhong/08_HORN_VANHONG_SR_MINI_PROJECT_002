import Link from "next/link";
import ButtonComponent from "./ButtonComponent";
// import { auth } from "@/app/auth";

export default async function FooterComponent() {
  // const session = await auth();
  return (
    <footer id="contact" className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto w-full max-w-7xl py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-lg font-semibold text-gray-900">
              Stay in the loop
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Demo newsletter — no data is sent. Wire this input to your API
              when you are ready.
            </p>
            <div className="mt-4 flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Email address"
                className="min-w-0 flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
              />
              <ButtonComponent>Subscribe</ButtonComponent>
            </div>
          </div>
          <div className="flex flex-wrap gap-10 text-sm">
            <div>
              <p className="font-semibold text-gray-900">Shop</p>
              <ul className="mt-3 space-y-2 text-gray-500">
                <li>
                  <Link href="/products" className="hover:text-gray-900">
                    All products
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-gray-900">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-gray-900">
                    Cart
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="hover:text-gray-900">
                    Orders
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Account</p>
              <ul className="mt-3 space-y-2 text-gray-500">
                <li>
                  <div className="flex flex-col gap-2">
                    <Link href="/login" className="hover:text-gray-900">
                      Log in
                    </Link>
                    <Link href="/register" className="hover:text-gray-900">
                      Register
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-12 border-t border-gray-100 pt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} PurelyStore · Student demo storefront
        </p>
      </div>
    </footer>
  );
}
