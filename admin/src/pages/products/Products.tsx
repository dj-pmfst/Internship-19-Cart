import { useState } from "react";
import Navbar from "../../component/navbar";
import { api, API } from "../../utils/api";
import { useFetch } from "../../hooks/useFetch";
import { useFormState } from "../../hooks/useFormState";
import { useProductForm } from "../../hooks/useProductForm";
import styles from "./Products.module.css";

export default function Products() {
  const { data, loading, reload } = useFetch<{ products: any[] }>(
    "/products?limit=100"
  );
  const { data: categoriesData } = useFetch<any[]>("/categories");
  const {
    success: deleteSuccess,
    setSuccess: setDeleteSuccess,
    run: runDelete,
  } = useFormState();

  const products = data?.products || [];
  const categories = categoriesData || [];

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");

  const {
    form,
    editingId,
    handleChange,
    handleSubmit,
    handleEdit,
    handleCancel,
    error,
    success,
    loading: saving,
  } = useProductForm(reload);

  const handleDelete = (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    runDelete(async () => {
      await api.delete(`/products/${id}`);
      setDeleteSuccess("Product deleted");
      reload();
    });
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      (!q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)) &&
      (!catFilter || p.category?.name === catFilter)
    );
  });

  return (
    <div className="page">
      <Navbar />
      <div className="page-header">
        <h1 className="page-title">Products</h1>
      </div>

      <div className="form-card">
        <h3 style={{ marginBottom: 16, fontSize: 16 }}>
          {editingId ? "Edit Product" : "Add New Product"}
        </h3>
        {error && <div className="error">{error}</div>}
        {(success || deleteSuccess) && (
          <div className="success">{success || deleteSuccess}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label className="label">Name *</label>
              <input
                className="input"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label className="label">Brand *</label>
              <input
                className="input"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label className="label">Price (€) *</label>
              <input
                className="input"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label className="label">Category *</label>
              <select
                className="select"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required>
                <option value="">Select category</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field full-width">
              <label className="label">Description *</label>
              <textarea
                className="textarea"
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label className="label">Sizes (comma separated)</label>
              <input
                className="input"
                name="sizes"
                placeholder="S, M, L, XL"
                value={form.sizes}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label className="label">Colors (comma separated)</label>
              <input
                className="input"
                name="colors"
                placeholder="black, white, red"
                value={form.colors}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label className="label">Image URL</label>
              <input
                className="input"
                name="imageUrl"
                placeholder="images/filename.png"
                value={form.imageUrl}
                onChange={handleChange}
              />
              {form.imageUrl && (
                <img
                  src={`${API}/${form.imageUrl}`}
                  className={styles.imagePreview}
                  alt="preview"
                />
              )}
            </div>
            <div className={`field ${styles.inStockField}`}>
              <label className={styles.inStockLabel}>
                <input
                  type="checkbox"
                  name="inStock"
                  checked={form.inStock}
                  onChange={handleChange}
                />
                In stock
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                ? "Update Product"
                : "Add Product"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="filters">
        <input
          className="input"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c: any) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Sizes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.imageUrl?.length > 0 ? (
                      <img
                        className="thumb"
                        src={`${API}/${p.imageUrl[0]}`}
                        alt={p.name}
                      />
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                  </td>
                  <td>{p.brand}</td>
                  <td>{p.category?.name}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        p.inStock ? "badge-delivered" : "badge-pending"
                      }`}>
                      {p.inStock ? "In stock" : "Out"}
                    </span>
                  </td>
                  <td className={styles.count}>{p.sizes?.join(", ") || "—"}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleEdit(p)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(p.id, p.name)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty">No products found</div>
          )}
        </div>
      )}
    </div>
  );
}
