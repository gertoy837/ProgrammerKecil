import { useEffect } from "react";
import { useCart } from "../contexts/CartContext";

export default function CartPage() {
  const { cart, loading, fetchCart } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <div className="p-8">Loading cart...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Cart</h1>

      {!cart?.items || cart.items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty</p>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Quantity</th>
                  <th className="p-4 text-left">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-4">{item.product.name}</td>
                    <td className="p-4">Rp {item.product.price}</td>
                    <td className="p-4">{item.quantity}</td>
                    <td className="p-4">Rp {item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-right">
            <p className="text-2xl font-bold">Total: Rp {cart.totalPrice}</p>
          </div>
        </div>
      )}
    </div>
  );
}
