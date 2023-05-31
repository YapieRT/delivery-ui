import axios from 'axios';
import Header from '../../components/Header';
import styles from '../../css/cart/Cart.module.scss';
import React, { useState, useEffect } from 'react';
import lodash from 'lodash';

function Cart() {
  document.title = 'Delivery - Cart';

  const ip = process.env.REACT_APP_BACKEND_IP;
  console.log(ip);

  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [clientOrder, setClientOrder] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderError, setOrderError] = useState('');
  const [orderSuccesfull, setOrderSuccesfull] = useState('');

  const updateTotalPrice = () => {
    if (!clientOrder) return;
    let currentTotalPrice = 0;
    clientOrder.map((record) => {
      currentTotalPrice += record.quantity * record.price;
    });
    setTotalPrice(currentTotalPrice);
  };

  useEffect(() => {
    const getOrder = async () => {
      let orderString = localStorage.getItem('order');
      try {
        setClientOrder(JSON.parse(orderString));
      } catch (error) {
        console.error('Error parsing order from localStorage:', error);
      }
    };
    getOrder();
  }, []);

  useEffect(() => {
    updateTotalPrice();
  }, [clientOrder]);

  const clientInfoHandler = (event) => {
    setClientInfo((prevClientInfo) => ({
      ...prevClientInfo,
      [event.target.name]: event.target.value,
    }));
  };

  const handleQuantityChange = (event, index) => {
    const newClientOrder = [...clientOrder];
    if (parseInt(event.target.value) <= 0) {
      newClientOrder.splice(index, 1);
    } else {
      newClientOrder[index].quantity = parseInt(event.target.value);
    }
    setClientOrder(newClientOrder);
    console.log(newClientOrder);
    if (lodash.isEmpty(newClientOrder)) return localStorage.removeItem('order');
    localStorage.setItem('order', JSON.stringify(newClientOrder));
    updateTotalPrice();
  };

  const handleSubmit = async () => {
    await axios
      .post(`${ip}/api/newOrder`, { ...clientInfo, order: clientOrder, totalPrice })
      .then((response) => {
        setClientInfo({
          name: '',
          email: '',
          phone: '',
          address: '',
        });
        setOrderError('');
        setOrderSuccesfull('Order submitted successfully!');
        localStorage.removeItem('order');
        setClientOrder([]);
        setTotalPrice(0);
      })
      .catch((error) => {
        setOrderSuccesfull('');
        if (error.response.data.errors.length > 0) {
          setOrderError(error.response.data.errors[0].msg);
        } else {
          setOrderError('An error occurred while submitting the order.');
        }
      });
  };

  return (
    <div>
      <Header />
      <div className={styles.forms}>
        <div className={styles.userInfoForm}>
          <form>
            <label>Name:</label>
            <input
              type='text'
              placeholder='Write text here...'
              name='name'
              value={clientInfo.name}
              onChange={clientInfoHandler}
            />
            <label>Email:</label>
            <input
              type='text'
              placeholder='Write text here...'
              name='email'
              value={clientInfo.email}
              onChange={clientInfoHandler}
            />
            <label>Phone:</label>
            <input
              type='text'
              placeholder='Write text here...'
              name='phone'
              value={clientInfo.phone}
              onChange={clientInfoHandler}
            />
            <label>Address:</label>
            <input
              type='text'
              placeholder='Write text here...'
              name='address'
              value={clientInfo.address}
              onChange={clientInfoHandler}
            />
          </form>
        </div>
        <div className={styles.order}>
          <div className={styles.list}>
            {clientOrder
              ? clientOrder.map((record, index) => (
                  <div className={styles.orderedMeal} key={index}>
                    <img alt={record.name} className={styles.mealImg}></img>
                    <div className={styles.mealInfo}>
                      <p>{record.meal}</p>
                      <p>Price: {record.price * record.quantity}$</p>
                      <input
                        type='number'
                        value={record.quantity}
                        onChange={(event) => handleQuantityChange(event, index)}
                      ></input>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
      <div className={styles.submit}>
        {orderSuccesfull && <h2 className={styles.success}>{orderSuccesfull}</h2>}
        {orderError && <h2 className={styles.error}>{orderError}</h2>}
        <h2>Total Price: {totalPrice}$</h2>
        <button className={styles.submitButton} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default Cart;
