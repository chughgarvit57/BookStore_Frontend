import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Orders.module.scss";
import useFetchOrders from "../../hooks/useOrder";
import formatDate from "../../utils/DateFormatter";

const Orders = () => {
  const navigate = useNavigate();
  const { fetchOrders } = useFetchOrders();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const response = await fetchOrders();
        console.log(response);
        setOrders(response.data || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  return (
    <div className={styles.ordersContainer}>
      {loading && <p>Loading orders...</p>}
      {!loading && orders.length === 0 && (
        <div className={styles.noOrdersContainer}>
          <p className={styles.noOrdersText}>
            No orders found. Start shopping now!
          </p>
          <button
            className={styles.startShoppingButton}
            onClick={() => {
              navigate("/home");
            }}
          >
            Start Shopping
          </button>
        </div>
      )}
      {!loading && orders.length > 0 && (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order.orderId} className={styles.orderCard}>
              <div className={styles.orderImageContainer}>
                <img
                  src={order.bookImage}
                  alt={order.bookName}
                  className={styles.orderImage}
                />
              </div>
              <div className={styles.orderDetails}>
                <h3 className={styles.bookTitle}>{order.bookName}</h3>
                <p className={styles.authorName}>by {order.author}</p>
                <div className={styles.priceContainer}>
                  <span className={styles.currentPrice}>Rs. {order.price}</span>
                </div>
              </div>
              <div className={styles.orderDate}>
                <p>Ordered on: {formatDate(order.orderedDate)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
