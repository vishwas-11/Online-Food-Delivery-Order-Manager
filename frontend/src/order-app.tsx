import React, { useEffect, useState } from 'react';

export interface Order {
  _id?: string;
  orderId: string;
  restaurantName: string;
  itemCount: number;
  isPaid: boolean;
  deliveryDistance: number;
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    orderId: '',
    restaurantName: '',
    itemCount: 1,
    isPaid: false,
    deliveryDistance: 1,
  });

  // Filter state
  const [filterPaid, setFilterPaid] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [filterMaxDistance, setFilterMaxDistance] = useState<string>('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filterPaid === 'paid') params.append('isPaid', 'true');
      if (filterPaid === 'unpaid') params.append('isPaid', 'false');
      if (filterMaxDistance) params.append('maxDistance', filterMaxDistance);

      const res = await fetch(`${API_BASE}/api/orders?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.orderId || !form.restaurantName) {
      setError('Order ID and Restaurant Name are required');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          itemCount: Number(form.itemCount),
          deliveryDistance: Number(form.deliveryDistance),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add order');
      }
      setSuccess('Order added successfully');
      setForm({
        orderId: '',
        restaurantName: '',
        itemCount: 1,
        isPaid: false,
        deliveryDistance: 1,
      });
      fetchOrders();
    } catch (err: any) {
      setError(err.message || 'Failed to add order');
    }
  };

  const handleAssignDelivery = async () => {
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/api/orders/assign-delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maxDistance: filterMaxDistance ? Number(filterMaxDistance) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to assign delivery');
      }
      setSuccess(`Assigned order ${data.order.orderId} from ${data.order.restaurantName}`);
      fetchOrders();
    } catch (err: any) {
      setError(err.message || 'Failed to assign delivery');
    }
  };

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-5xl space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Online Food Delivery Order Manager
            </h1>
            <p className="text-sm text-slate-600">
              Manage orders, filter by status/distance, and auto-assign the nearest unpaid order.
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Refresh Orders
          </button>
        </header>

        {(error || success) && (
          <div className="space-y-2">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                {success}
              </div>
            )}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-[2fr,3fr]">
          {/* Add Order Form */}
          <section className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-3 text-slate-900">Add Order</h2>
            <form className="space-y-3" onSubmit={handleAddOrder}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Order ID
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                  value={form.orderId}
                  onChange={(e) => setForm((f) => ({ ...f, orderId: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                  value={form.restaurantName}
                  onChange={(e) => setForm((f) => ({ ...f, restaurantName: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Item Count
                  </label>
                  <input
                    type="number"
                    min={1}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                    value={form.itemCount}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, itemCount: Number(e.target.value) || 1 }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Delivery Distance (km)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                    value={form.deliveryDistance}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        deliveryDistance: Number(e.target.value) || 0,
                      }))
                    }
                    required
                  />
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  checked={form.isPaid}
                  onChange={(e) => setForm((f) => ({ ...f, isPaid: e.target.checked }))}
                />
                Mark as Paid
              </label>
              <button
                type="submit"
                className="mt-2 w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Add Order
              </button>
            </form>
          </section>

          {/* Orders + Filters */}
          <section className="space-y-3">
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 justify-between">
                <form className="flex flex-wrap gap-3 items-end" onSubmit={applyFilters}>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-slate-600 mb-1">
                      Payment Status
                    </label>
                    <select
                      className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                      value={filterPaid}
                      onChange={(e) =>
                        setFilterPaid(e.target.value as 'all' | 'paid' | 'unpaid')
                      }
                    >
                      <option value="all">All</option>
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-slate-600 mb-1">
                      Max Distance (km)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      className="w-32 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                      value={filterMaxDistance}
                      onChange={(e) => setFilterMaxDistance(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                  >
                    Apply Filters
                  </button>
                </form>

                <button
                  type="button"
                  onClick={handleAssignDelivery}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                >
                  Assign Delivery (nearest unpaid)
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-slate-900">Orders</h2>
                <span className="text-xs text-slate-500">
                  Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
                </span>
              </div>

              {loading ? (
                <div className="py-6 text-sm text-slate-500">Loading orders…</div>
              ) : orders.length === 0 ? (
                <div className="py-6 text-sm text-slate-500">
                  No orders found. Add a new order to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-3 py-2 text-left font-medium text-slate-700">
                          Order ID
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-slate-700">
                          Restaurant
                        </th>
                        <th className="px-3 py-2 text-right font-medium text-slate-700">
                          Items
                        </th>
                        <th className="px-3 py-2 text-right font-medium text-slate-700">
                          Distance (km)
                        </th>
                        <th className="px-3 py-2 text-center font-medium text-slate-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order._id || order.orderId}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                        >
                          <td className="px-3 py-2 font-mono text-xs text-slate-900">
                            {order.orderId}
                          </td>
                          <td className="px-3 py-2 text-slate-800">
                            {order.restaurantName}
                          </td>
                          <td className="px-3 py-2 text-right text-slate-800">
                            {order.itemCount}
                          </td>
                          <td className="px-3 py-2 text-right text-slate-800">
                            {order.deliveryDistance.toFixed(1)}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                order.isPaid
                                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                  : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                              }`}
                            >
                              {order.isPaid ? 'Paid / Assigned' : 'Unpaid'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

