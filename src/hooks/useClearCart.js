import { useAuthentication } from "../context/AuthContext";
import useAPI from "./useApi";

const useClearCart = () => {
  const { request } = useAPI();
  const { user: token } = useAuthentication();

  const clearCart = async () => {
    try {
      await request({
        method: "DELETE",
        url: "/api/Cart/ClearCart",
        data: null,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Internal server error";
      throw errorMessage;
    }
  };

  return { clearCart };
};

export default useClearCart;
