import { Link } from "react-router-dom";
import styles from './NavBar.module.css' 

function NavBar() {
    return (
        <header className={styles.header}>
        <h1>Suite Store</h1>
            <nav className={styles.menu_nav}>
                <ul className={styles.itens_nav}>
                    <li className={styles.itens_nav}>
                        <Link to="/" >Home</Link>
                    </li>
                    <li className={styles.itens_nav}>
                        <Link to="/products">Products</Link>
                    </li>
                    <li className={styles.itens_nav}>
                        <Link to="/categories">Categories</Link>
                    </li>
                    <li className={styles.itens_nav}>
                        <Link to="/history">History</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
export default NavBar