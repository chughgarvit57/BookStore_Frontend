import styles from "./Card.module.scss";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";

const Card = ({ title, author, price, bookImage, bookId, quantity }) => {
  const navigate = useNavigate();
  const staticRating = 4.5;
  const staticRatingCount = 20;
  const originalPrice = price + 500;

  const handleCardClick = () => {
    navigate(`/book/details/${bookId}`);
  };

  return (
    <>
      <div className={styles.card} onClick={handleCardClick}>
        <div className={styles.imageContainer}>
          <img src={bookImage} alt={title} className={styles.bookImage} />
          {quantity === 0 && (
            <div className={styles.outOfStockOverlay}>
              <span className={styles.outOfStockText}>Out of Stock</span>
            </div>
          )}
        </div>
        <div className={styles.cardContent}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.author}>by {author}</p>
          <div className={styles.ratingContainer}>
            <span className={styles.rating}>
              {staticRating}{" "}
              <Rating
                value={1}
                max={1}
                precision={0.5}
                readOnly
                size="small"
                icon={
                  <StarIcon fontSize="inherit" style={{ color: "#f0f0f0" }} />
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
          <div className={styles.priceContainer}>
            <span className={styles.price}>Rs. {price}</span>
            <span className={styles.originalPrice}>Rs. {originalPrice}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
