import styles from "./Home.module.scss";
import {
  FormControl,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Card from "../../components/common/Card/Card";
import { useFetchBooks } from "../../hooks/useFetchBooks";
import { useBooks } from "../../context/BookContext";
import dropdownStyles from "../../utils/DropdownStyles";

const Home = () => {
  const [sortOption, setSortOption] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { getAllBooks } = useFetchBooks();
  const { books } = useBooks();

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await getAllBooks();
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching books"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortOption]);

  const getSortLabel = (selected) => {
    if (!selected) {
      return <span>Sort by relevance</span>;
    }
    switch (selected) {
      case "price-low-high":
        return "Price: Low to High";
      case "price-high-low":
        return "Price: High to Low";
      case "title-asc":
        return "Title: A to Z";
      case "title-desc":
        return "Title: Z to A";
      default:
        return "Sort by relevance";
    }
  };

  const sortedBooks = useMemo(() => {
    const booksCopy = [...books];

    switch (sortOption) {
      case "price-low-high":
        return booksCopy.sort((a, b) => a.price - b.price);
      case "price-high-low":
        return booksCopy.sort((a, b) => b.price - a.price);
      case "title-asc":
        return booksCopy.sort((a, b) => a.bookName.localeCompare(b.bookName));
      case "title-desc":
        return booksCopy.sort((a, b) => b.bookName.localeCompare(a.bookName));
      default:
        return booksCopy;
    }
  }, [books, sortOption]);

  const booksPerPage = 8;
  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);

  const handlePageChange = (e, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <div className={styles.titleContainer}>
        <div className={styles.bookItemsCount}>
          <span className={styles.bookGeneric}>Books</span>
          <span className={styles.bookCount}>({books.length} items)</span>
        </div>
        <div className={styles.filterState}>
          <FormControl
            variant="outlined"
            sx={{ minWidth: 200, ...dropdownStyles }}
            className={styles.formControl}
          >
            <Select
              value={sortOption}
              onChange={handleSortChange}
              displayEmpty
              renderValue={(selected) => getSortLabel(selected)}
            >
              <MenuItem value="">
                <em>Sort by relevance</em>
              </MenuItem>
              <MenuItem value="price-low-high">Price: Low to High</MenuItem>
              <MenuItem value="price-high-low">Price: High to Low</MenuItem>
              <MenuItem value="title-asc">Title: A to Z</MenuItem>
              <MenuItem value="title-desc">Title: Z to A</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div className={styles.cardsContainer}>
        {isLoading ? (
          <div className={styles.loadingMessage}>Loading books...</div>
        ) : error ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : sortedBooks.length === 0 ? (
          <div className={styles.noBooksMessage}>No books available</div>
        ) : (
          currentBooks.map((book) => (
            <Card
              key={book.bookId}
              title={book.bookName}
              description={book.description}
              author={book.authorName}
              price={book.price}
              bookImage={book.bookImage}
              bookId={book.bookId}
            />
          ))
        )}
      </div>
      {sortedBooks.length > 0 && (
        <>
          <div className={styles.paginationInfo}>
            Showing {indexOfFirstBook + 1} -{" "}
            {Math.min(indexOfLastBook, sortedBooks.length)} of{" "}
            {sortedBooks.length} items
          </div>
          {totalPages > 1 && (
            <div className={styles.paginationContainer}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Home;
