import useAPI from "./useApi";
import { useCart } from "../context/CartContext";
import { useAuthentication } from "../context/AuthContext";

const useAddCart = () => {
  const { request } = useAPI();
  const { setItems } = useCart();
  const { user: token } = useAuthentication();

  const addBookInCart = async (bookId, quantity = 1) => {
    try {
      const response = await request({
        method: "POST",
        url: "/api/Cart/AddToCart",
        data: { bookId, quantity },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(response.data || []);
    } catch (error) {
      throw new Error(error);
    }
  };

  return { addBookInCart };
};

export default useAddCart;