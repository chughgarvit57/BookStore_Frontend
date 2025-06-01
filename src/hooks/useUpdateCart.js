import { useAuthentication } from "../context/AuthContext";
import useAPI from "./useApi";

const useUpdateCart = () => {
  const { request } = useAPI();
  const { user: token } = useAuthentication();

  const updateCart = async (bookId, quantity) => {
    try {
      const response = await request({
        method: "PATCH",
        url: "/api/Cart/UpdateCart",
        data: { bookId, quantity },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Update cart request: ", response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong!";
      throw errorMessage;
    }
  };

  return { updateCart };
};


export default useUpdateCart;