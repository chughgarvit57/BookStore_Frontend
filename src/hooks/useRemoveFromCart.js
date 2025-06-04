import { useAuthentication } from "../context/AuthContext";
import useAPI from "./useApi";

export const useRemoveFromCart = () => {
  const { request } = useAPI();
  const { user: token } = useAuthentication();

  const removeFromCart = async (id) => {
    try {
      await request({
        method: "DELETE",
        url: `/api/Cart/RemoveFromCart?bookId=${id}`,
        data: null,
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      throw errorMessage;
    }
  };

  return { removeFromCart };
};

export default useRemoveFromCart;
