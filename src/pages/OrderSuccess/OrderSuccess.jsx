import styles from "./OrderSuccess.module.scss";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import successLogo from "../../assets/order_success.jpg";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const { state } = useLocation();
  const orderId = state?.orderId || null;
  const address = state?.address || null;
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#ff0000", "#00ff00", "#0000ff"],
      ticks: 400,
    });
  }, []);

  return (
    <div className={styles.orderSuccessContainer}>
      <div className={styles.successIamgeContainer}>
        <img src={successLogo} alt="Success" />
      </div>
      <h3 className={styles.orderSuccessText}>Order Placed Successfully</h3>
      <div className={styles.samllSuccessImage}>
        <img src={successLogo} alt="Small party image" />
      </div>
      <div className={styles.orderStatus}>
        <p>
          Hurray! Your order with order id #{orderId} is confirmed. Save this
          order id to track your delivery status
        </p>
        {orderId === null && (
          <p className={styles.disclaimer}>
            Note: A real order ID will be emailed to you for tracking purposes.
          </p>
        )}
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email Us</TableCell>
              <TableCell>Contact Us</TableCell>
              <TableCell>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>support@bookstore.com</TableCell>
              <TableCell>+91 62836 36757</TableCell>
              <TableCell>
                {address && (
                  <div>
                    {address.address}, {address.city}, {address.state}{" "}
                  </div>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default OrderSuccess;
