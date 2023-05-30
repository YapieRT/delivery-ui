import styles from '../css/Header.module.scss';
import { Link } from 'react-router-dom';
function Header() {
  return (
    <div className={styles.header}>
      <nav>
        <ul>
          <Link to='/'>Shop</Link>
          <li> | </li>
          <Link to='/cart'>Shopping Cart</Link>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
