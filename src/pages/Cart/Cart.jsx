import { MapPin, Minus, Plus } from "lucide-react";
import styles from "./Cart.module.scss";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import useFetchCart from "../../hooks/useFetchCart";
import { useEffect, useState } from "react";
import useRemoveFromCart from "../../hooks/useRemoveFromCart";
import SnackBar from "../../components/common/Snackbar/Snackbar";
import useUpdateCart from "../../hooks/useUpdateCart";

const Cart = () => {
  const navigate = useNavigate();
  const { items, setItems } = useCart();
  const { getCart } = useFetchCart();
  const [loading, setLoading] = useState(false);
  const { removeFromCart } = useRemoveFromCart();
  const { updateCart } = useUpdateCart();

  const [snackbarData, setSnackBarData] = useState({
    open: true,
    message: "",
    severity: "error",
  });

  const handleCloseSnackBar = () => {
    setSnackBarData((prev) => {
      return {
        ...prev,
        open: false,
      };
    });
  };

  const goToHome = () => {
    navigate("/home");
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        await getCart();
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const removeItem = async (id) => {
    await removeFromCart(id);
    setItems((prevItems) => prevItems.filter((item) => item.bookId !== id));
    setSnackBarData({
      open: true,
      message: "Item removed from Cart",
      severity: "success",
    });
  };

  const cartItems = Array.isArray(items) ? items : [];

  if (loading) {
    return <div className={styles.loadingMessage}>Loading cart...</div>;
  }

  const filteredCartItems = cartItems.filter((item) => !item.isUncarted);

  const handleIncreaseQuantity = async (bookId, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    try {
      await updateCart(bookId, newQuantity);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.bookId === bookId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      setSnackBarData({
        open: true,
        message: error || "Failed to update quantity",
        severity: "error",
      });
    }
  };

  const handleDecreaseQuantity = async (bookId, currentQuantity) => {
    if (currentQuantity <= 1) {
      setSnackBarData({
        open: true,
        message: "Quantity must be atleast 1",
        severity: "warning",
      });
      return;
    }
    const newQuantity = currentQuantity - 1;
    try {
      await updateCart(bookId, newQuantity);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.bookId === bookId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      setSnackBarData({
        open: true,
        message: error || "Failed to update quantity",
        severity: "error",
      });
    }
  };

  return (
    <>
      <div className={styles.breadcrumb}>
        <span>
          <span className={styles.breadCrumbLink} onClick={goToHome}>
            Home / <span className={styles.breadCrumbCurrent}>My Cart</span>
          </span>
        </span>
      </div>
      <div className={styles.cartContainer}>
        <div className={styles.cartHeader}>
          <h2>My Cart({filteredCartItems.length})</h2>
          <div className={styles.location}>
            <MapPin size={16} className={styles.locationIcon} />
            <span>Use current location</span>
          </div>
        </div>
        <div className={styles.cartContent}>
          {filteredCartItems.length === 0 ? (
            <div className={styles.emptyCart}>
              <div className={styles.emptyCartContent}>
                <h3>No Items in Cart</h3>
                <p>Looks like your cart is empty. Start shopping now!</p>
                <button
                  className={styles.startBrowsingButton}
                  onClick={goToHome}
                >
                  Start Browsing
                </button>
              </div>
            </div>
          ) : (
            <>
              {filteredCartItems.map((item) => (
                <div className={styles.cartItem} key={item.bookId}>
                  <div className={styles.cartItemImageContainer}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.cartItemBookImage}
                    />
                  </div>
                  <div className={styles.cartItemDetails}>
                    <p className={styles.cartItemTitle}>{item.bookName}</p>
                    <p className={styles.cartItemAuthor}>
                      by {item.authorName}
                    </p>
                    <div className={styles.priceContainer}>
                      <p className={styles.orginalPrice}>Rs. {item.price}</p>
                      <p className={styles.oldPrice}>Rs. {item.price + 500}</p>
                    </div>
                    <div className={styles.itemActions}>
                      <div className={styles.quantity}>
                        <button
                          onClick={() => {
                            handleDecreaseQuantity(item.bookId, item.quantity);
                          }}
                        >
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => {
                            handleIncreaseQuantity(item.bookId, item.quantity);
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        className={styles.removeButton}
                        onClick={() => {
                          removeItem(item.bookId);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className={styles.placeOrderButtonContainer}>
                <button>Place Order</button>
              </div>
            </>
          )}
        </div>
      </div>
      <SnackBar
        open={snackbarData.open}
        onClose={handleCloseSnackBar}
        severity={snackbarData.severity}
        message={snackbarData.message}
      />
    </>
  );
};

export default Cart;
