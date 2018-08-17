import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import Comments from './comments'
import Security from '../security/security'
import Lang from '../../translation/en'

if (Meteor.isServer) {
  const COMMENT_METHODS = ['comments.list', 'comments.insert', 'comments.markAsRead']
  Security(COMMENT_METHODS)
}

Meteor.methods({

  'comments.list': function (orderId) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(orderId, String)

    let query = {}
    let result = []
    const projection = { sort: { createdDate: 1 } }

    if (orderId) {
      query = {
        orderId,
      }

      result = Comments.find(query, projection).fetch()
    }

    return result
  },

  'comments.insert': function (orderId, comment) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }
    check(orderId, String)
    check(comment, String)

    if (comment) {
      Comments.insert({
        orderId,
        comment,
        createdAt: new Date(),
        createdBy: this.userId,
        modifiedAt: new Date(),
        modifiedBy: this.userId,
      })
    }
  },

  'comments.insertByOrders': function (orders, comment) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }
    check(orders, [Object])
    check(comment, String)
    const createdAt = new Date()
    const modifiedAt = new Date()
    if (comment) {
      orders.map(order => Comments.insert({
        orderId: order._id,
        comment,
        createdAt,
        createdBy: this.userId,
        modifiedAt,
        modifiedBy: this.userId,
      }))
    }
  },

  'comments.markAsRead': function (orderId) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(orderId, String)

    const options = {
      multi: true,
      upsert: false,
    }
    if (orderId) {
      Comments.update({
        orderId,
        createdBy: {
          $ne: this.userId,
        },
      }, {
        $set: {
          readAt: new Date(),
          driverId: this.userId,
        },
      }, options)
    }
  },
})
