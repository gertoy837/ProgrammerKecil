import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProduct } from "../contexts/ProductContext";
import AdminLayout from "../components/AdminLayout";

const host = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

// ── Modal ────────────────────────────────────────────────
function CategoryModal({ mode, category, onClose, onSaved }) {
  const { createCategory, updateCategory } = useProduct();
  const [name, setName] = useState(category?.name || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    category?.image ? `${host}${category.image}` : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("File harus berupa gambar"); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Gambar maksimal 5MB"); return; }
    setImageFile(file);
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError("Nama kategori wajib diisi"); return; }
    if (mode === "create" && !imageFile) { setError("Gambar kategori wajib diunggah"); return; }

    setLoading(true);
    setError("");

    const fd = new FormData();
    fd.append("name", name.trim());
    if (imageFile) fd.append("image", imageFile);

    const result =
      mode === "create"
        ? await createCategory(fd)
        : await updateCategory(category.id, fd);

    setLoading(false);
    if (!result.success) { setError(result.error); return; }
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md border border-outline-variant/20 overflow-hidden transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant/10">
          <h3 className="font-bold text-on-surface text-base">
            {mode === "create" ? "Add Category" : "Edit Category"}
          </h3>
          <button className="text-on-surface-variant hover:text-primary p-1" onClick={onClose}>
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Plakat, Halfmoon..."
              className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 mb-2">
              Category Banner Image
            </label>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-outline-variant/30 aspect-video">
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 shadow hover:bg-red-700 transition-colors"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                >
                  <span className="material-symbols-outlined text-sm block">delete</span>
                </button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-outline-variant/30 bg-surface-container-low hover:border-primary/50 rounded-2xl p-6 text-center cursor-pointer transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <span className="material-symbols-outlined text-3xl text-on-surface-variant/50 mb-2">upload_file</span>
                <p className="text-sm font-bold text-on-surface">Click to upload banner</p>
                <p className="text-xs text-on-surface-variant/70 mt-1">PNG, JPG, WebP (Max 5MB)</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-md shadow-primary/10 hover:opacity-95 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Category"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-surface-container-high text-on-surface-variant rounded-xl font-bold text-sm hover:opacity-90"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ─────────────────────────────────
function DeleteConfirmModal({ category, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm border border-outline-variant/20 p-6 text-center transform transition-all" onClick={(e) => e.stopPropagation()}>
        <span className="material-symbols-outlined text-4xl text-red-500 mb-2">warning</span>
        <h3 className="font-bold text-on-surface text-lg mb-2">Delete Category?</h3>
        <p className="text-sm text-on-surface-variant/80 mb-6">
          Are you sure you want to delete &ldquo;{category.name}&rdquo;? All products under this category will lose their connection but won't be deleted.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-surface-container-high text-on-surface-variant rounded-xl font-bold text-sm hover:opacity-90"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────
export default function AdminCategoryPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { categories, fetchCategories, deleteCategory } = useProduct();

  const [mounted, setMounted] = useState(false);
  const [notification, setNotification] = useState(null);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    if (user.role !== "admin") { navigate("/"); return; }
    fetchCategories();
    setMounted(true);
  }, [authLoading, user, navigate, fetchCategories]);

  if (authLoading) return null;

  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSaved = async () => {
    setModal(null);
    await fetchCategories();
    notify("success", modal?.mode === "create" ? "Category added successfully!" : "Category updated successfully!");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteCategory(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    if (result.success) {
      await fetchCategories();
      notify("success", `Category "${deleteTarget.name}" deleted.`);
    } else {
      notify("error", result.error || "Failed to delete category.");
    }
  };

  const filtered = categories.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className={`transition-all duration-300 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-on-surface-variant font-semibold text-sm mb-1">Categories</p>
            <h3 className="text-2xl font-extrabold text-on-surface">Manage Categories</h3>
          </div>
          <button
            onClick={() => setModal({ mode: "create" })}
            className="py-2.5 px-4 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity text-sm"
          >
            <span className="material-symbols-outlined text-sm font-bold text-white">add</span>
            <span className="text-white">Add Category</span>
          </button>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${
            notification.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            <span className="material-symbols-outlined text-lg">
              {notification.type === "success" ? "check_circle" : "error"}
            </span>
            {notification.message}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex gap-4 mb-6 items-center">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
            <input
              type="text"
              placeholder="Search category name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-full focus:ring-2 focus:ring-primary/20 text-sm outline-none"
            />
          </div>
          <button
            onClick={fetchCategories}
            className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full"
            title="Refresh"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>

        {/* Stats Summary Widget */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-outline-variant/10 flex items-center gap-4">
            <div className="p-3 bg-primary-container/10 text-primary rounded-xl">
              <span className="material-symbols-outlined">category</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-semibold">Total Categories</p>
              <h4 className="text-lg font-bold text-on-surface">{categories.length}</h4>
            </div>
          </div>
        </div>

        {/* Categories Grid Container */}
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">folder_open</span>
              <p className="text-sm font-semibold text-on-surface-variant">No categories found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((cat) => {
                const imgUrl = cat.image ? `${host}${cat.image}` : null;
                return (
                  <div key={cat.id} className="flex items-center gap-4 p-4 border border-outline-variant/20 rounded-2xl bg-white hover:border-primary/30 transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/20 flex-shrink-0">
                      {imgUrl ? (
                        <img src={imgUrl} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">🐟</div>
                      )}
                    </div>
                    <div className="flex-1 min-width-0">
                      <p className="font-bold text-on-surface text-sm truncate">{cat.name}</p>
                      <p className="text-[10px] text-on-surface-variant/70 font-semibold tracking-wide uppercase mt-0.5">ID: {cat.id}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setModal({ mode: "edit", category: cat })}
                        className="p-1.5 hover:bg-surface-container-low rounded-lg text-on-surface-variant hover:text-primary transition-colors flex items-center"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-on-surface-variant hover:text-red-600 transition-colors flex items-center"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="mt-6 pt-4 border-t border-outline-variant/20 text-xs text-on-surface-variant font-semibold">
              Showing {filtered.length} of {categories.length} categories
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <CategoryModal
          mode={modal.mode}
          category={modal.category}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          category={deleteTarget}
          loading={deleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </AdminLayout>
  );
}
