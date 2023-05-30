import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import styles from '../../css/menu/Menu.module.scss';
import axios from 'axios';

function Menu() {
  document.title = 'Delivery - Menu';

  const ip = 'http://localhost';

  const [activeRestaurant, setActiveRestaurant] = useState({});
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantMeals, setRestaurantMeals] = useState([]);

  useEffect(() => {
    const getAllRestaurants = async () => {
      try {
        const response = await axios.get(`${ip}:8000/api/getAllRestaurants`);
        setRestaurants(response.data.restaurants);
      } catch (err) {
        console.log(err);
      }
    };
    getAllRestaurants();
  }, []);

  const chunkArray = (arr, size) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  };

  const getMeals = async (restaurant) => {
    const response = await axios.get(`${ip}:8000/api/getRestaurantMeals?id=${restaurant._id}`);
    setRestaurantMeals(response.data.meals);
  };

  const restaurantClickHandler = async (restaurant) => {
    try {
      setActiveRestaurant(restaurant);
      setRestaurantMeals([]);

      getMeals(restaurant);
    } catch (err) {}
  };

  const addToCartHandler = (meal) => {
    let order = localStorage.getItem('order');

    if (!order) {
      order = [{ restaurant: activeRestaurant, meal: meal.name, price: meal.price, quantity: 1 }];
    } else {
      try {
        order = JSON.parse(order);
      } catch (error) {
        console.error('Error parsing order from localStorage:', error);
        order = [];
      }

      const existingMeal = order.find((orderedMeal) => orderedMeal.meal === meal.name);

      if (existingMeal) {
        existingMeal.quantity += 1;
      } else {
        order.push({ restaurant: activeRestaurant, meal: meal.name, price: meal.price, quantity: 1 });
      }
    }

    localStorage.setItem('order', JSON.stringify(order));
    console.log(localStorage.getItem('order'));
  };
  return (
    <div>
      <Header />
      <div className={styles.elements}>
        <div className={styles.restaurants}>
          <div className={styles.list}>
            {' '}
            {restaurants.map((restaurant) => (
              <button
                id={restaurant._id}
                className={`${styles.restaurantName} ${activeRestaurant._id === restaurant._id ? styles.active : ''}`}
                onClick={() => restaurantClickHandler(restaurant)}
              >
                {restaurant.name}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.meals}>
          <div className={styles.list}>
            {chunkArray(restaurantMeals, 2).map((mealPair, index) => (
              <div className={styles.mealPair} key={index}>
                {mealPair.map((meal) => (
                  <div className={styles.meal} key={meal._id}>
                    <img alt={meal.name} className={styles.menuImg}></img>
                    <p className={styles.mealName}>{meal.name}</p>
                    <div className={styles.mealBottom}>
                      <p className={styles.price}>Price: {meal.price}$</p>
                      <button className={styles.addButton} onClick={() => addToCartHandler(meal)}>
                        add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
