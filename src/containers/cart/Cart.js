import Header from '../../components/Header';
import styles from '../../css/cart/Cart.module.scss';

function Cart() {
  document.title = 'Delivery - Cart';
  return (
    <div>
      <Header />
      <div className={styles.forms}>
        <div className={styles.userInfoForm}></div>
        <div className={styles.order}>
          <div className={styles.list}></div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
