"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserOrders } from "../../../service/order.service";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "loading") return;

    const fetchOrders = async () => {
      try {
        const token = session?.accessToken ?? null;
        const response = await getUserOrders(token);

        
        const payload = response?.payload || [];
        setOrders(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session, status]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Ordered products</h1>
            <p className="text-gray-500 mt-1">
              {orders.length} {orders.length === 1 ? "order" : "orders"} from your account.
            </p>
          </div>

          
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">You haven&apos;t placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const details = order.orderDetailsResponse || [];
              const total = order.totalAmount || 0;

              return (
                <div
                  key={order.orderId}   
                  className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="px-8 pt-7 pb-5 flex flex-col md:flex-row md:items-start md:justify-between border-b border-gray-100 gap-6">
                    <div>
                      <div className="uppercase text-xs tracking-widest text-gray-400 mb-1">ORDER</div>
                      <div className="font-mono text-lg font-medium text-gray-900">
                        #{order.orderId}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-400">Total</div>
                      <div className="text-3xl font-semibold text-gray-900">
                        ${Number(total).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    <div>
                      <div className="text-gray-400 text-xs mb-1">User ID</div>
                      <div className="font-mono text-gray-700 break-all">
                        {order.appUserId || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs mb-1">Order date</div>
                      <div className="text-gray-700">
                        {formatDate(order.orderDate)}
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
                    <div className="uppercase text-xs font-medium text-gray-400 mb-4 tracking-widest">
                      ORDER DETAILS
                    </div>

                    <div className="space-y-3">
                      {details.map((item, idx) => (
                        <div
                          key={idx}   // Safe fallback key
                          className="flex items-center justify-between bg-white rounded-2xl px-6 py-5"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {item.productName}
                            </p>
                          </div>
                          <div className="flex items-center gap-12 text-sm">
                            <div>
                              <span className="text-black">Qty</span>{" "}
                              <span className="font-semibold">{item.orderQty}</span>
                            </div>
                            <div className="font-semibold text-right text-black">
                              ${Number(item.orderTotal).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}