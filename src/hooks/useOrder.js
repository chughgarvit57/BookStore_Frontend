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
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const fetchOrders = async () => {
    return await request({
      method: "GET",
      url: "/api/Order/GetAllOrders",
      data: null,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return { createOrder, fetchOrders };
};

export default useOrder;
