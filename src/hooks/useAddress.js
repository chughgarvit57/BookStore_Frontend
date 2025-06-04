import { useAuthentication } from "../context/AuthContext";
import useAPI from "./useApi";

const useAddress = () => {
  const { request } = useAPI();
  const { user: token } = useAuthentication();

  const addAddress = async ({ formData }) => {
    try {
      await request({
        method: "POST",
        url: "/api/Address/AddAddress",
        data: formData,
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

  const fetchAddresses = async () => {
    try {
      const response = await request({
        method: "GET",
        url: "/api/Address/GetAllAddresses",
        data: null,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Internal server error";
      throw errorMessage;
    }
  };

  const deleteAddress = async (id) => {
    try {
      await request({
        method: "DELETE",
        url: `/api/Address/AddressId?addressId=${id}`,
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

  return { addAddress, fetchAddresses, deleteAddress };
};

export default useAddress;
