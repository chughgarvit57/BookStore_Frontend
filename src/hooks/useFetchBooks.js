import { useAuthentication } from "../context/AuthContext";
import { useBooks } from "../context/BookContext";
import useAPI from "./useApi";

export const useFetchBooks = () => {
  const { request } = useAPI();
  const { setBooks } = useBooks();
  const { user: token } = useAuthentication();

  const getAllBooks = async () => {
    try {
      const response = await request({
        method: "GET",
        url: "/api/Book/GetAllBooks",
        data: null,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const books = response.data || [];
      setBooks(books);
      return books;
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
      throw error;
    }
  };

  const getBookById = async (id) => {
    try {
      const response = await request({
        method: "GET",
        url: `/api/Book/BookId?bookId=${id}`,
        data: null,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const book = response.data || null;
      return book;
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
      throw error;
    }
  };

  return { getAllBooks, getBookById };
};
