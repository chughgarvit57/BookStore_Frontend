import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchBooks } from "../../hooks/useFetchBooks";
import styles from "./BookDetails.module.scss";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useBooks } from "../../context/BookContext";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const BookDetails = () => {
  const { id } = useParams();
  const { getBookById } = useFetchBooks();
  const { books } = useBooks();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const staticRating = 4.5;
  const staticRatingCount = 20;

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const cachedBook = books.find((b) => b.bookId === id);
        if (cachedBook) {
          setBook(cachedBook);
        } else {
          const response = await getBookById(id);
          setBook(response);
        }
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch book details"
        );
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [id]);

  if (loading) {
    return <div className={styles.loadingMessage}>Loading book details...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  if (!book) {
    return <div className={styles.errorMessage}>Book not found</div>;
  }

  return (
    <div className={styles.bookDetailsContainer}>
      <div className={styles.imageSection}>
        <div className={styles.imageContainer}>
          {book.bookImage ? (
            <img
              src={book.bookImage}
              alt={book.bookName}
              className={styles.bookImage}
            />
          ) : (
            <div className={styles.placeholderImage}>No Image Available</div>
          )}
        </div>
        <div className={styles.actionButtons}>
          <button className={styles.addToBagButton}>ADD TO BAG</button>
          <button className={styles.wishlistButton}>
            <FavoriteBorderIcon className={styles.wishlistIcon} />
            WISHLIST
          </button>
        </div>
      </div>
      <div className={styles.detailsContainer}>
        <h1 className={styles.title}>{book.bookName}</h1>
        <p className={styles.author}>by {book.authorName}</p>
        <div className={styles.ratingContainer}>
          <span className={styles.rating}>
            {staticRating}{" "}
            <Rating
              value={staticRating}
              precision={0.5}
              readOnly
              size="small"
              icon={
                <StarIcon fontSize="inherit" style={{ color: "#FFD700" }} />
              }
              emptyIcon={
                <StarIcon
                  fontSize="inherit"
                  style={{ color: "#FFD700", opacity: 0.3 }}
                />
              }
            />
          </span>
          <span className={styles.ratingCount}>({staticRatingCount})</span>
        </div>
        <p className={styles.description}>{book.description}</p>
        <div className={styles.priceContainer}>
          <span className={styles.price}>₹{book.price}</span>
          <span className={styles.originalPrice}>₹{book.price + 500}</span>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;