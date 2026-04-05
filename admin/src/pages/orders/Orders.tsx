import { useState } from "react";
import Navbar from "../../component/navbar";
import { api } from "../../utils/api";
import { useFetch } from "../../hooks/useFetch";
import { useFormState } from "../../hooks/useFormState";
import styles from "./Orders.module.css";

const STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

const statusBadge: Record<string, string> = {
  PENDING: "badge-pending",
  CONFIRMED: "badge-confirmed",
  SHIPPED: "badge-shipped",
  DELIVERED: "badge-delivered",
};

export default function Orders() {
  const { data, loading, reload } = useFetch<any[]>("/orders");
  const { error, success, setSuccess, run } = useFormState();
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const orders = data || [];
  const filtered = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  const handleStatusChange = (orderId: number, status: string) => {
    run(async () => {
      await api.patch(`/orders/${orderId}/status`, { status });
      setSuccess(`Order #${orderId} updated to ${status}`);
      reload();
    });
  };

  const toggleExpand = (id: number) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="page">
      <Navbar />
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <span className={styles.orderCount}>{filtered.length} orders</span>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className={styles.filterRow}>
        <div className="chip-group">
          <button
            className={`chip ${!statusFilter ? "chip-active" : ""}`}
            onClick={() => setStatusFilter("")}>
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`chip ${statusFilter === s ? "chip-active" : ""}`}
              onClick={() => setStatusFilter(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <tbody>
              {filtered.map((order) => (
                <>
                  <tr
                    key={order.id}
                    className={styles.clickableRow}
                    onClick={() => toggleExpand(order.id)}>
                    <td>
                      <strong>#{order.id}</strong>
                    </td>
                    <td>{order.user?.email}</td>
                    <td>{order.items?.length} item(s)</td>
                    <td>
                      <strong>${order.total?.toFixed(2)}</strong>
                    </td>
                    <td>
                      <span className={`badge ${statusBadge[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        className={`select ${styles.statusSelect}`}
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }>
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>

                  {expandedId === order.id && (
                    <tr
                      key={`${order.id}-detail`}
                      className={styles.expandedRow}>
                      <td colSpan={7}>
                        <div className={styles.expandedGrid}>
                          <div>
                            <p className={styles.expandedTitle}>Items</p>
                            {order.items?.map((item: any) => (
                              <div key={item.id} className={styles.orderItem}>
                                <span>
                                  {item.product?.name}
                                  {item.size ? ` (${item.size})` : ""} ×{" "}
                                  {item.quantity}
                                </span>
                                <span className={styles.orderItemPrice}>
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                            <div className={styles.orderTotal}>
                              <span>Total</span>
                              <span>${order.total?.toFixed(2)}</span>
                            </div>
                          </div>
                          <div>
                            <p className={styles.expandedTitle}>Shipping</p>
                            <p className={styles.address}>
                              {order.shippingAddress}
                            </p>
                            {order.billingAddress !== order.shippingAddress && (
                              <>
                                <p className={styles.billingTitle}>Billing</p>
                                <p className={styles.address}>
                                  {order.billingAddress}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty">No orders found</div>
          )}
        </div>
      )}
    </div>
  );
}
