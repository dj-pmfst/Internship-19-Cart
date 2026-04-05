import { useState } from "react";
import Navbar from "../../component/navbar";
import { api } from "../../utils/api";
import { useFetch } from "../../hooks/useFetch";
import { useFormState } from "../../hooks/useFormState";
import styles from "./Categories.module.css";

export default function Categories() {
  const { data, loading, reload } = useFetch<any[]>("/categories");
  const { error, success, setSuccess, loading: saving, run } = useFormState();
  const [newName, setNewName] = useState("");

  const categories = data || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    run(async () => {
      await api.post("/categories", { name: newName.trim() });
      setSuccess("Category created!");
      setNewName("");
      reload();
    });
  };

  const handleDelete = (cat: any) => {
    const count = cat.products?.length ?? 0;
    if (count > 0) {
      alert(
        `Cannot delete "${cat.name}" — it has ${count} product(s). Reassign or delete those first.`
      );
      return;
    }
    if (!window.confirm(`Delete "${cat.name}"?`)) return;
    run(async () => {
      await api.delete(`/categories/${cat.id}`);
      setSuccess("Category deleted.");
      reload();
    });
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

        <form onSubmit={handleCreate} className={styles.createForm}>
          <div className={`field ${styles.nameField}`}>
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
            disabled={saving || !newName.trim()}>
            {saving ? "Creating..." : "+ Create"}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
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
              {categories.map((cat: any) => (
                <tr key={cat.id}>
                  <td>
                    <strong>{cat.name}</strong>
                  </td>
                  <td>{cat.products?.length ?? 0}</td>
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
      )}
    </div>
  );
}
