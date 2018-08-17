import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import Orders from '../orders'
import Tours from '../../tours/tours'
import Lang from '../../../translation/en'

if (Meteor.isServer) {
  Meteor.publish('orders.byActiveTour', function (driverId) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(driverId, String)

    const currentStartDateTime = new Date()
    const currentEndDateTime = new Date()
    currentEndDateTime.setUTCHours(23)
    currentEndDateTime.setUTCMinutes(59)
    currentEndDateTime.setUTCSeconds(59)

    const activeTour = Tours.findOne({
      driverId,
      date: {
        $gte: currentStartDateTime,
        $lte: currentEndDateTime,
      },
    })

    let orders = {}
    if (activeTour) {
      orders = Orders.find({ tourId: activeTour._id })
    }
    return orders
  })
}

