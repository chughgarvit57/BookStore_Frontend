import { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Search,
  User,
  ShoppingCart,
  Package,
  Heart,
} from "lucide-react";
import styles from "./Header.module.scss";
import Input from "../../common/Input/Input";
import { useAuthentication } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";

const Header = () => {
  const navigate = useNavigate();
  const { items } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const { logout } = useAuthentication();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const navigateToCart = () => {
    navigate("/cart");
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.leftLogoSection}>
          <BookOpen size={40} />
          <p>BookStore</p>
        </div>
        <div className={styles.searchSection}>
          <Search className={styles.searchIcon} />
          <Input
            type="text"
            placeholder="Search.."
            name="search"
            className={styles.searchInput}
          />
        </div>
        <div className={styles.rightSection}>
          <div
            className={styles.iconContainer}
            onClick={toggleDropdown}
            ref={dropdownRef}
          >
            <User size={24} />
            <span>Profile</span>
            {isDropdownOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <p>Welcome</p>
                  <p className={styles.subText}>
                    To access account and manage orders
                  </p>
                </div>
                <button className={styles.loginButton} onClick={logout}>
                  LOGOUT
                </button>
                <div className={styles.dropdownItem}>
                  <Package size={16} />
                  <span>My Orders</span>
                </div>
                <div className={styles.dropdownItem}>
                  <Heart size={16} />
                  <span>Wishlist</span>
                </div>
              </div>
            )}
          </div>
          <div className={`${styles.iconContainer}`} onClick={navigateToCart}>
            <ShoppingCart size={24} className={styles.cartIcon} />
            <span>Cart</span>
            <p className={styles.cartQuantityIcon}>{items.length}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
