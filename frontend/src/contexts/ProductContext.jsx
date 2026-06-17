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

  const createProduct = useCallback(async (formData) => {
    try {
      const response = await apiClient.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || error.message ||
          "Failed to create product",
      };
    }
  }, []);

  const updateProduct = useCallback(async (productId, formData) => {
    try {
      const response = await apiClient.put(`/products/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || error.message ||
          "Failed to update product",
      };
    }
  }, []);

  const deleteProduct = useCallback(async (productId) => {
    try {
      await apiClient.delete(`/products/${productId}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || error.message ||
          "Failed to delete product",
      };
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
        createProduct,
        updateProduct,
        deleteProduct,
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
