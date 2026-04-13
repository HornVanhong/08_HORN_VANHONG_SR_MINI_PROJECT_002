"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "../../../context/CartContext";
import { createOrder } from "../../../service/order.service";

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
  } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = getCartTotal();
  const itemCount = getCartItemCount();

  const increase = (productId) => {
    const item = cart.find((item) => item.productId === productId);
    if (item) updateQuantity(productId, item.quantity + 1);
  };

  const decrease = (productId) => {
    const item = cart.find((item) => item.productId === productId);
    if (item && item.quantity > 1) updateQuantity(productId, item.quantity - 1);
  };

  const handleCheckout = async () => {
    if (!session?.accessToken) {
      toast.error("Please log in to checkout");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsCheckingOut(true);

    try {
      const orderDetailRequests = cart.map((item) => ({
        productId: item.productId,
        orderQty: item.quantity,
      }));

      const orderData = {
        orderDetailRequests: orderDetailRequests,
      };

      const response = await createOrder(orderData, session.accessToken);

      if (response) {
        toast.success("Order placed successfully!");
        clearCart();
        router.push("/orders");
      } else {
        toast.error("Failed to place order");
      }
    } catch (error) {
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Your cart</h1>
          <p className="mt-1 text-sm text-gray-400">
            Cart is stored in memory for this visit — refreshing the page clears
            it.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-28">
            <div className="text-4xl">🛒</div>
            <p className="mt-4 text-base font-medium text-gray-500">
              Your cart is empty
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Add some products to get started
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block rounded-full bg-gray-900 px-7 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4 ">
            {/* Item count */}
            <p className="text-sm text-gray-400">
              <span className="font-semibold text-gray-900">{itemCount}</span>{" "}
              product{itemCount > 1 ? "s" : ""} in cart
            </p>

            {/* Cart Items */}
            <div className="flex flex-col gap-3">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4"
                >
                  {/* Image */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={`Product image of ${item.productName}`}
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-lg object-contain"
                      />
                    ) : (
                      <span
                        className="text-xl text-gray-300"
                        role="img"
                        aria-label={`No image available for ${item.productName}`}
                      >
                        ◇
                      </span>
                    )}
                  </div>

                  {/* Name + Price */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.productId}`}>
                      <p className="truncate text-sm font-semibold text-gray-900 hover:text-gray-600 transition">
                        {item.productName}
                      </p>
                    </Link>
                    <p className="mt-0.5 text-xs text-gray-400">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>

                  {/* Quantity + Total + Remove */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {/* Quantity controls */}
                    <div className="flex items-center overflow-hidden rounded-full border border-gray-200">
                      <button
                        onClick={() => decrease(item.productId)}
                        className="flex h-8 w-8 items-center justify-center text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 text-base"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increase(item.productId)}
                        className="flex h-8 w-8 items-center justify-center text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 text-base"
                      >
                        +
                      </button>
                    </div>

                    {/* Item total */}
                    <p className="text-sm font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-xs text-red-400 transition hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="text-sm font-semibold text-gray-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-5">
                Tax and shipping calculated at checkout (demo).
              </p>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full rounded-xl bg-gray-900 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-700 mb-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? "Processing..." : "Checkout"}
              </button>

              <button
                onClick={clearCart}
                className="w-full rounded-xl bg-gray-100 py-3.5 text-sm font-medium text-gray-500 transition hover:bg-gray-200"
              >
                Clear cart
              </button>

              <Link
                href="/products"
                className="mt-3 block text-center text-xs text-gray-400 hover:text-gray-600 hover:underline underline-offset-2 transition"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
