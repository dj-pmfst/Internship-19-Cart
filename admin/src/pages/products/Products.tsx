import { useState, useEffect } from "react";
import Navbar from "../../component/navbar";

const API = "http://localhost:3000";
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  "Content-Type": "application/json",
});

const emptyForm = {
  name: "",
  description: "",
  price: "",
  brand: "",
  categoryId: "",
  sizes: "",
  colors: "",
  inStock: true,
  imageUrl: "",
};

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = () => {
    fetch(`${API}/products?limit=100`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => setProducts(d.data?.products || []));
  };

  const fetchCategories = () => {
    fetch(`${API}/categories`)
      .then((r) => r.json())
      .then((d) => setCategories(d.data || []));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const body = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        brand: form.brand,
        categoryId: parseInt(form.categoryId),
        sizes: form.sizes
          ? form.sizes
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        colors: form.colors
          ? form.colors
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        inStock: form.inStock,
        ...(form.imageUrl ? { imageUrl: [form.imageUrl] } : {}),
      };
      const url = editingId
        ? `${API}/products/${editingId}`
        : `${API}/products`;
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");

      setSuccess(editingId ? "Product updated" : "Product created");
      setForm(emptyForm);
      setEditingId(null);
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      brand: p.brand,
      categoryId: p.categoryId || p.category?.id,
      sizes: p.sizes?.join(", ") || "",
      colors: p.colors?.join(", ") || "",
      inStock: p.inStock,
      imageUrl: p.imageUrl?.[0] || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    const res = await fetch(`${API}/products/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSuccess("Product deleted.");
    }
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
        {success && <div className="success">{success}</div>}

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
                {categories.map((c) => (
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
              <label className="label">Sizes (coma separated)</label>
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
              <label className="label">Image</label>
              <input
                className="input"
                name="imageUrl"
                placeholder="url"
                value={form.imageUrl}
                onChange={handleChange}
              />
              {form.imageUrl && (
                <img
                  src={`${API}/${form.imageUrl}`}
                  style={{ marginTop: 8, height: 80, objectFit: "contain" }}
                  alt="preview"
                />
              )}
            </div>
            <div className="field" style={{ justifyContent: "flex-end" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  marginTop: "auto",
                }}>
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
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}>
              {loading
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
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.imageUrl ? (
                    <img
                      className="thumb"
                      src={`${API}/${
                        Array.isArray(p.imageUrl) ? p.imageUrl[0] : p.imageUrl
                      }`}
                      alt={p.name}
                    />
                  ) : (
                    <span>—</span>
                  )}
                </td>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
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
                <td style={{ color: "#888" }}>{p.sizes?.join(", ") || "—"}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
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
    </div>
  );
}
