import { useNavigate } from "react-router-dom";
import styles from "./WishList.module.scss";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import useAddWishList from "../../hooks/useAddWishList";
import { useEffect, useState } from "react";
import SnackBar from "../../components/common/Snackbar/Snackbar";
import useAddCart from "../../hooks/useAddCart";

const WishList = () => {
  const navigate = useNavigate();
  const { getBooksInWIshlist, removeFromWishList } = useAddWishList();
  const { addBookInCart } = useAddCart();
  const [books, setBooks] = useState([]);
  const [snackbarData, setSnackBarData] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleCloseSnackbar = () => {
    setSnackBarData((prev) => ({ ...prev, open: false }));
  };

  const goToHome = () => {
    navigate("/home");
  };

  const loadWishList = async () => {
    try {
      const response = await getBooksInWIshlist();
      setBooks(response);
    } catch (error) {
      setSnackBarData({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadWishList();
  }, []);

  const handleDelete = async (bookId, fromCartAction = false) => {
    await removeFromWishList(bookId);
    if (!fromCartAction) {
      setSnackBarData({
        open: true,
        message: "Removed from wishlist",
        severity: "success",
      });
    }
    await loadWishList();
  };

  const handleAddToCart = async (bookId) => {
    await addBookInCart(bookId, 1);
    await handleDelete(bookId, true);
    setSnackBarData({
      open: true,
      message: "Added in cart!",
      severity: "success",
    });
  };

  return (
    <>
      <div className={styles.breadcrumb}>
        <span>
          <span className={styles.breadCrumbLink} onClick={goToHome}>
            Home / <span className={styles.breadCrumbCurrent}>My WishList</span>
          </span>
        </span>
      </div>
      <div className={styles.wishListBox}>
        <div className={styles.bar}>
          <h2>My WishList ({books.length} items)</h2>
        </div>
        {books.map((book) => (
          <div className={styles.wishListItemCard}>
            <div className={styles.leftSection}>
              <div className={styles.imageContainer}>
                <img src={book.bookImage} alt={book.bookName} />
              </div>
              <div className={styles.rightSection}>
                <p>{book.bookName}</p>
                <p>by - {book.authorName}</p>
                <div className={styles.priceContainer}>
                  <p className={styles.newPrice}>Rs. {book.price}</p>
                  <p className={styles.oldPrice}>Rs. {book.price + 500}</p>
                </div>
              </div>
            </div>
            <div className={styles.actionButtons}>
              <IconButton
                aria-label="delete"
                className={styles.deleteButton}
                onClick={() => handleDelete(book.bookId)}
                color="error"
                title="Delete"
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                aria-label="add to cart"
                className={styles.addToCartButton}
                onClick={() => handleAddToCart(book.bookId)}
                color="info"
                title="Add To Cart"
              >
                <AddShoppingCartIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
      <SnackBar
        open={snackbarData.open}
        onClose={handleCloseSnackbar}
        severity={snackbarData.severity}
        message={snackbarData.message}
      />
    </>
  );
};

export default WishList;
