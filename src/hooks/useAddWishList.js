import { useAuthentication } from "../context/AuthContext";
import useAPI from "./useApi";

const useAddWishList = () => {
  const { request } = useAPI();
  const { user: token } = useAuthentication();

  const addBookToWishList = async (bookId) => {
    try {
      await request({
        method: "POST",
        url: `/api/WishList/AddBookToWishList?bookId=${bookId}`,
        data: null,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      throw err.response?.data?.message;
    }
  };

  const getBooksInWIshlist = async () => {
    try {
      const response = await request({
        method: "GET",
        url: "/api/WishList/GetAllBooksInWishList",
        data: null,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      throw err.response?.data?.message;
    }
  };

  const removeFromWishList = async (bookId) => {
    try {
      await request({
        method: "DELETE",
        url: `/api/WishList/RemoveBookFromWishList?bookId=${bookId}`,
        data: null,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      return error.response?.data?.message;
    }
  };

  const clearWishList = async () => {
    try {
      await request({
        method: "DELETE",
        url: "/api/WishList/ClearWishList",
        data: null,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      return error.response?.data?.message;
    }
  };

  return {
    addBookToWishList,
    getBooksInWIshlist,
    removeFromWishList,
    clearWishList,
  };
};

export default useAddWishList;
