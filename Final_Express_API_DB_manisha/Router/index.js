const express = require('express');

const route = express.Router();

const locationController = require('../Controllers/Locations');
const mealtypeController = require('../Controllers/MealTypes');
const restaurantController = require('../Controllers/Restaurants');
const userController = require('../Controllers/Users');
const menuItemsController = require('../Controllers/MenuItems');
const ordersController = require('../Controllers/Orders');
const paymentGatewayController = require('../Controllers/Payments');


route.get('/locations', locationController.getLocations);
route.get('/mealtypes', mealtypeController.getMealTypes);
route.get('/restaurants/:locId', restaurantController.getRestaurantsByLocId);
route.post('/userlogin', userController.userLogin);
route.post('/usersignup', userController.userSignUp);
route.get('/restaurant/:resId', restaurantController.getRestaurantsDetailsById);
route.get('/menuitems/:resId', menuItemsController.getMenuItemsByRes);
route.post('/order', ordersController.saveOrderDetails);
route.get('/orders/:userId', ordersController.getOrdersByUserId);
route.post('/filter', restaurantController.restaurantsFilter);
route.post('/payment', paymentGatewayController.payment);
route.post('/callback', paymentGatewayController.callback);


module.exports = route;