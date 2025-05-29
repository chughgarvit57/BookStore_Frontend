import { Outlet } from "react-router-dom";
import styles from "./AppLayout.module.scss";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

const AppLayout = () => {
  return (
    <div className={styles.appContainer}>
      <Header />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;