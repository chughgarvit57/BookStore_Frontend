import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer>
      <div className={styles.footerContainer}>
        <p>
          Copyright &copy; {new Date().getFullYear()} Bookstore Private Limited.
          All RIghts Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
