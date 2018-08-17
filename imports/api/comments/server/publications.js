import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
import Comments from '../comments'
import Lang from '../../../translation/en'

if (Meteor.isServer) {
  Meteor.publish('comments', function (orderId) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(orderId, String)

    const projection = { sort: { createdDate: 1 } }

    const self = this
    const transform = (comment) => {
      comment.user = Meteor.users.findOne(
        { _id: comment.createdBy },
        {
          fields: { profile: 1 },
        },
      )
      return comment
    }

    const observer = Comments.find({ orderId }, projection).observe({
      added: (comment) => {
        self.added('comments', comment._id, transform(comment))
      },
      changed: (comment) => {
        self.changed('comments', comment._id, transform(comment))
      },
    })

    self.onStop(() => {
      observer.stop()
    })

    self.ready()
  })

  Meteor.publish('comments.unRead', function (orderId) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(orderId, String)
    let result = []
    let query = {}

    if (orderId) {
      query = {
        orderId,
        createdBy: {
          $ne: this.userId,
        },
        readAt: {
          $exists: false,
        },
      }
      result = Comments.find(query)
    }
    return result
  })

  Meteor.publish('comments.allOrders', function (orders = []) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    Match.test(orders, [Object])

    const orderIds = orders.map(order => order._id)
    return Comments.find({ orderId: { $in: orderIds } })
  })
}

