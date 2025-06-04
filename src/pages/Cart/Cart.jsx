import { MapPin, Minus, Plus } from "lucide-react";
import styles from "./Cart.module.scss";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import useFetchCart from "../../hooks/useFetchCart";
import { useEffect, useState } from "react";
import useRemoveFromCart from "../../hooks/useRemoveFromCart";
import SnackBar from "../../components/common/Snackbar/Snackbar";
import useUpdateCart from "../../hooks/useUpdateCart";
import AddressForm from "../Address/AddressForm";
import useOrder from "../../hooks/useOrder";

const Cart = () => {
  const navigate = useNavigate();
  const { items, setItems } = useCart();
  const { getCart } = useFetchCart();
  const { removeFromCart } = useRemoveFromCart();
  const { updateCart } = useUpdateCart();
  const [snackbarData, setSnackBarData] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [addressOpen, setAddressOpen] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { createOrder } = useOrder();

  const handleContinue = (address) => {
    console.log("Selected address:", address);
    setSelectedAddress(address);
    setAddressOpen(false);
    setShowOrderSummary(true);
  };

  const handleAddress = () => {
    setAddressOpen(true);
    setShowOrderSummary(false);
  };

  const handleCloseSnackBar = () => {
    setSnackBarData((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const goToHome = () => {
    navigate("/home");
  };

  useEffect(() => {
    const fetchCart = async () => {
      await getCart();
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
        message: "Quantity must be at least 1",
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

  const handleCheckout = async () => {
    try {
      const item = filteredCartItems[0];
      const orderRequest = {
        addressId: parseInt(selectedAddress.addressId, 10),
        bookId: parseInt(item.bookId, 10),
        quantity: parseInt(item.quantity, 10),
      };
      await createOrder(orderRequest);
      navigate("/orderSuccess");6
      removeFromCart(orderRequest.bookId);
    } catch (error) {
      setSnackBarData({
        open: true,
        message: error.message || "Failed to create order",
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
          <h2>My Cart ({filteredCartItems.length})</h2>
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
                  <div className={styles.leftBox}>
                    <div className={styles.cartItemImageContainer}>
                      <img
                        src={item.image}
                        alt={item.bookName}
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
                        <p className={styles.oldPrice}>
                          Rs. {item.price + 500}
                        </p>
                      </div>
                      <div className={styles.itemActions}>
                        <div className={styles.quantity}>
                          <button
                            onClick={() =>
                              handleDecreaseQuantity(item.bookId, item.quantity)
                            }
                          >
                            <Minus size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleIncreaseQuantity(item.bookId, item.quantity)
                            }
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          className={styles.removeButton}
                          onClick={() => removeItem(item.bookId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className={styles.placeOrderButtonContainer}>
                    {!addressOpen && !showOrderSummary && (
                      <button onClick={handleAddress}>Place Order</button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <div className={styles.addressBox}>
        <div className={styles.headerBar}>
          <p className={styles.addressBoxTitle}>Customer Details</p>
        </div>
        {addressOpen && (
          <AddressForm
            onContinue={handleContinue}
            setAddressOpen={setAddressOpen}
          />
        )}
      </div>
      <div className={styles.orderSummaryBox}>
        <div className={styles.headerBar}>
          <p className={styles.addressBoxTitle}>Order Summary</p>
        </div>
        {showOrderSummary ? (
          filteredCartItems.length > 0 ? (
            <div className={styles.orderSummaryContent}>
              {selectedAddress && (
                <div className={styles.selectedAddress}>
                  <p>Delivering to: {selectedAddress.firstName}</p>
                  <p>
                    {selectedAddress.address}, {selectedAddress.city},{" "}
                    {selectedAddress.state}
                  </p>
                </div>
              )}
              {filteredCartItems.map((item) => (
                <div className={styles.cartItem} key={item.bookId}>
                  <div className={styles.leftBox}>
                    <div className={styles.cartItemImageContainer}>
                      <img
                        src={item.image}
                        alt={item.bookName}
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
                        <p className={styles.oldPrice}>
                          Rs. {item.price + 500}
                        </p>
                      </div>
                      <div className={styles.itemActions}>
                        <div className={styles.quantity}>
                          <span>Quantity: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.placeOrderButtonContainer}>
                    <button
                      className={styles.checkoutButton}
                      onClick={handleCheckout}
                    >
                      CHECKOUT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Your cart is empty. Please add items to proceed.</p>
          )
        ) : null}
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
