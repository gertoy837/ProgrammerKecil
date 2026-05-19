import { useEffect, useState } from "react";
import { useProduct } from "../contexts/ProductContext";

export default function ProductListPage() {
  const { products, loading, fetchAllProducts } = useProduct();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  if (loading) return <div className="p-8">Loading products...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden shadow-md">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
              <p className="text-xl font-bold text-blue-600">Rp {product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
