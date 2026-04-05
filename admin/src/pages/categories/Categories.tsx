import { useState, useEffect } from "react";
import Navbar from "../../component/navbar";

const API = "http://localhost:3000";
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  "Content-Type": "application/json",
});

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch(`${API}/categories`)
      .then((r) => r.json())
      .then((d) => setCategories(d.data || []));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/categories`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ name: newName.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      setSuccess("Category created!");
      setNewName("");
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cat: any) => {
    const productCount = cat.products?.length ?? 0;
    if (productCount > 0) {
      alert(
        `Cannot delete "${cat.name}" — it has ${productCount} product(s) assigned to it.Reassign or delete those products first.`
      );
      return;
    }
    if (!window.confirm(`Delete "${cat.name}"?`)) return;
    const res = await fetch(`${API}/categories/${cat.id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      setSuccess("Category deleted");
    }
  };

  return (
    <div className="page">
      <Navbar />

      <div className="page-header">
        <h1 className="page-title">Categories</h1>
      </div>

      <div className="form-card">
        <h3 style={{ marginBottom: 14, fontSize: 16 }}>New Category</h3>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form
          onSubmit={handleCreate}
          style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <div className="field" style={{ flex: 1, maxWidth: 300 }}>
            <label className="label">Category Name *</label>
            <input
              className="input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Streetwear"
              required
            />
          </div>
          <button
            className="btn btn-primary"
            disabled={loading || !newName.trim()}>
            {loading ? "Creating..." : "+ Create"}
          </button>
        </form>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td style={{ fontWeight: 500 }}>{cat.name}</td>
                <td style={{ color: "#888" }}>{cat.products?.length ?? 0}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(cat)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="empty">No categories yet</div>
        )}
      </div>
    </div>
  );
}
