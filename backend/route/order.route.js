const express = require('express');

const orderRouter = express.Router();
const OrderController = require('../controller/order.controller');

orderRouter.route('/')
  .post(OrderController.create)
  .get(OrderController.list);

orderRouter.route('/:id')
  .put(OrderController.update)
  .delete(OrderController.remove);

orderRouter.route('/client')
  .get(OrderController.clientList);

module.exports = orderRouter;
