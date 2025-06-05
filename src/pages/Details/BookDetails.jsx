import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchBooks } from "../../hooks/useFetchBooks";
import styles from "./BookDetails.module.scss";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useBooks } from "../../context/BookContext";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import useAddCart from "../../hooks/useAddCart";
import SnackBar from "../../components/common/Snackbar/Snackbar";
import useAddWishList from "../../hooks/useAddWishList";

const BookDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getBookById } = useFetchBooks();
  const { books } = useBooks();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addBookInCart } = useAddCart();
  const { addBookToWishList } = useAddWishList();

  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleCloseSnackbar = () => {
    setSnackbarData((prev) => ({
      ...prev,
      open: false,
    }));
  };

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

  const addBook = async (id, quantity) => {
    try {
      await addBookInCart(id, quantity);
      setSnackbarData({
        open: true,
        message: "Item added to cart",
        severity: "success",
      });
    } catch (error) {
      const errorMessage =
        error.message || "Failed to add item to cart. Please try again.";
      setSnackbarData({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleAddInWishlist = async (bookId) => {
    try {
      await addBookToWishList(bookId);
      setSnackbarData({
        open: true,
        message: "Item wishlisted",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/myWishList");
      }, 1000);
    } catch (error) {
      setSnackbarData({
        open: true,
        message: error,
        severity: "error",
      });
    }
  };

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
    <>
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
            <button
              className={styles.addToBagButton}
              onClick={() => addBook(book.bookId, 1)}
              disabled={book.quantity === 0}
            >
              {book.quantity === 0 ? "NOTIFY ME" : "ADD TO BAG"}
            </button>
            <button
              className={styles.wishlistButton}
              onClick={() => {
                handleAddInWishlist(book.bookId);
              }}
              disabled={book.quantity === 0}
            >
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
          <div className={styles.stockContainer}>
            <span className={styles.stockText}>{` ${
              book.quantity > 0
                ? `In stock: ${book.quantity}`
                : "Book Out Of Stock!"
            } `}</span>
          </div>
          <hr />
          <p className={styles.description}>{book.description}</p>
          <div className={styles.priceContainer}>
            <span className={styles.price}>Rs {book.price}</span>
            <span className={styles.originalPrice}>Rs {book.price + 500}</span>
          </div>
          <hr />
          <div className={styles.feedbackContainer}>
            <p className={styles.feedbackTitle}>Customer Feedback</p>
            <div className={styles.ratingSection}>
              <p className={styles.ratingLabel}>Overall rating</p>
              <div className={styles.ratingContainer}>
                <Rating
                  value={staticRating}
                  precision={0.5}
                  readOnly
                  size="medium"
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
              </div>
              <div className={styles.feedbackInput}>
                <textarea
                  name="feedback"
                  rows={3}
                  id={styles.feedback}
                  placeholder="Please provide your feedback here"
                ></textarea>
                <div className={styles.reviewButtonContainer}>
                  <button className={styles.writeReviewButton} type="button">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.feedbackCustomersContainer}>
            <div className={styles.accountLogo}>
              <h1 className={styles.account}>GC</h1>
            </div>
            <div className={styles.customerFeedbackBox}>
              <p className={styles.feedbacker}>Garvit Chugh</p>
              <Rating
                value={3}
                precision={0.5}
                readOnly
                size="medium"
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
              <p className={styles.customerFeedback}>
                Good product. Even though the translation could have been
                better, Chanakya's neeti are thought provoking. Chanakya has
                written on many different topics and his writings are succinct.
              </p>
            </div>
          </div>
          <div className={styles.feedbackCustomersContainer}>
            <div className={styles.accountLogo}>
              <h1 className={styles.account}>SS</h1>
            </div>
            <div className={styles.customerFeedbackBox}>
              <p className={styles.feedbacker}>Sahil Singh</p>
              <Rating
                value={4.5}
                readOnly
                precision={0.5}
                size="medium"
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
              <p className={styles.customerFeedback}>
                Good product. Even though the translation could have been
                better, Chanakya's neeti are thought provoking. Chanakya has
                written on many different topics and his writings are succinct.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SnackBar
        open={snackbarData.open}
        onClose={handleCloseSnackbar}
        message={snackbarData.message}
        severity={snackbarData.severity}
      />
    </>
  );
};

export default BookDetails;
