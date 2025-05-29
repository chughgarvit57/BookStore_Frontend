import styles from './Home.module.scss';

const Home = () => {
  return (
    <div className={styles.titleContainer}>
      <div className={styles.bookItemsCount}>
        <span className={styles.bookGeneric}>Books</span>
        <span className={styles.bookCount}>(128 items)</span>
      </div>
      <div className={styles.filterState}>
        Sort / Filter
      </div>
    </div>
  )
}

export default Home
