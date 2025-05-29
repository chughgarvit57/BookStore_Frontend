import { useState } from "react";
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

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const { logout } = useAuthentication();

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
          <div className={styles.iconContainer} onClick={toggleDropdown}>
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
          <div className={styles.iconContainer}>
            <ShoppingCart size={24} />
            <span>Cart</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
