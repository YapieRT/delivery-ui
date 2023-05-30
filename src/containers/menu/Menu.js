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

  const handlerRestaurantClick = async (restaurant) => {
    try {
      setActiveRestaurant(restaurant);
      setRestaurantMeals([]);

      getMeals(restaurant);
    } catch (err) {}
  };

  const handlerAddToCart = (meal) => {
    let order = localStorage.getItem('order');

    if (!order) {
      order = [{ restaurant: activeRestaurant, meal: meal, quantity: 1 }];
    } else {
      try {
        order = JSON.parse(order);
      } catch (error) {
        console.error('Error parsing order from localStorage:', error);
        order = [];
      }

      const existingMeal = order.find((orderedMeal) => orderedMeal.meal === meal);

      if (existingMeal) {
        existingMeal.quantity += 1;
      } else {
        order.push({ restaurant: activeRestaurant, meal: meal, quantity: 1 });
      }
    }

    localStorage.setItem('order', JSON.stringify(order));
    console.log(localStorage.getItem('order'));
  };

  //   if (localStorage.getItem('order')) {
  //     let order = localStorage.getItem('order');
  //     try {
  //       order = JSON.parse(order);
  //     } catch (error) {
  //       console.error('Error parsing order from localStorage:', error);
  //       order = [];
  //     }
  //     setActiveRestaurant(order[0].restaurant);
  //     getMeals(activeRestaurant);
  //     return (
  //       <div>
  //         <Header />
  //         <div className={styles.elements}>
  //           <div className={styles.restaurants}>
  //             <div className={styles.list}>
  //               <button
  //                 className={`${styles.restaurantName} ${styles.active}`}
  //                 onClick={() => handlerRestaurantClick(activeRestaurant)}
  //               >
  //                 {activeRestaurant.name}
  //               </button>
  //             </div>
  //           </div>
  //           <div className={styles.meals}>
  //             <div className={styles.list}>
  //               {chunkArray(restaurantMeals, 2).map((mealPair, index) => (
  //                 <div className={styles.mealPair} key={index}>
  //                   {mealPair.map((meal) => (
  //                     <div className={styles.meal} key={meal._id}>
  //                       {meal.name}
  //                       <button className={styles.addButton} onClick={() => handlerAddToCart(meal.name)}>
  //                         add to Cart
  //                       </button>
  //                     </div>
  //                   ))}
  //                 </div>
  //               ))}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   } else
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
                onClick={() => handlerRestaurantClick(restaurant)}
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
                    {meal.name}
                    <button className={styles.addButton} onClick={() => handlerAddToCart(meal.name)}>
                      add to Cart
                    </button>
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
