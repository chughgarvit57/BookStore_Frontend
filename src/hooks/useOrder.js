import { useAuthentication } from "../context/AuthContext";
import useAPI from "./useApi";

const useOrder = () => {
  const { request } = useAPI();
  const { user: token } = useAuthentication();

  const createOrder = async (orderData) => {
    return await request({
      method: "POST",
      url: "/api/Order/CreateOrder",
      data: orderData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };

  return { createOrder };
};

export default useOrder;