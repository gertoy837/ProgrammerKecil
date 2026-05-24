import { createContext, useState, useContext, useCallback } from "react";
import apiClient from "../utils/api";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [productDetail, setProductDetail] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/products");
      setProducts(response.data.products);
      return response.data.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/products/${id}`);
      setProductDetail(response.data.product);
      return response.data.product;
    } catch (error) {
      console.error("Error fetching product detail:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiClient.get("/categories");
      setCategories(response.data.categories);
      return response.data.categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }, []);

  const addReview = async (productId, review, rating) => {
    try {
      const response = await apiClient.post(`/products/${productId}/reviews`, {
        review,
        rating,
      });
      await fetchProductById(productId);
      return { success: true, review: response.data.review };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to add review",
      };
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        productDetail,
        categories,
        loading,
        fetchAllProducts,
        fetchProductById,
        fetchCategories,
        addReview,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within ProductProvider");
  }
  return context;
}
