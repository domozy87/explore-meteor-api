import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import OrderConfirmations from './order_confirmations'
import Security from '../security/security'
import Lang from '../../translation/en'

if (Meteor.isServer) {
  const ORDER_CONFIRMATION_METHODS = [
    'orderConfirmations.saveContainerImage',
    'orderConfirmations.getOrderConfirmation',
  ]
  Security(ORDER_CONFIRMATION_METHODS)
}

Meteor.methods({
  'orderConfirmations.saveContainerImage': function (data) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(data, Object)
    const { order, imageUrls } = data
    const projection = { slip: order.slip, 'orders.orderId': order._id }

    const insertData = {
      orderId: order._id,
      images: imageUrls,
    }
    OrderConfirmations.update(
      projection,
      {
        $set: {
          orders: insertData,
        },
      },
      {
        upsert: true,
      },
    )
  },

  'orderConfirmations.getOrderConfirmation': function (order) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(order, Object)
    return OrderConfirmations.findOne({ slip: order.slip })
  },
})
