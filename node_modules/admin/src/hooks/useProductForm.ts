import { useState } from "react";
import { api } from "../utils/api";
import { useFormState } from "./useFormState";

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

export function useProductForm(onSuccess: () => void) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { error, success, setSuccess, loading, run } = useFormState();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
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
      if (editingId) {
        await api.patch(`/products/${editingId}`, body);
        setSuccess("Product updated");
      } else {
        await api.post("/products", body);
        setSuccess("Product created");
      }
      setForm(emptyForm);
      setEditingId(null);
      onSuccess();
    });
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
  };

  return {
    form,
    editingId,
    handleChange,
    handleSubmit,
    handleEdit,
    handleCancel,
    error,
    success,
    loading,
  };
}
