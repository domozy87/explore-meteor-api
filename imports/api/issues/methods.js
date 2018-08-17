import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import Issues from './issues'
import Orders from '../orders/orders'
import Security from '../security/security'
import Lang from '../../translation/en'

if (Meteor.isServer) {
  const ORDER_METHODS = [
    'issues.insert',
    'issues.update',
    'issues.removeImage',
    'issues.updateStatus',
  ]
  Security(ORDER_METHODS)
}


Meteor.methods({
  'issues.insert': function (driverId, order, issue) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(driverId, String)
    check(order, Object)
    check(issue, Object)

    const query = {
      tourId: order.tourId,
      orderStatus: 'processing',
    }
    const orderIds = []
    const orders = Orders.find(query).fetch()
    orders.forEach(({ _id }) => {
      orderIds.push(_id)
    })
    if (issue) {
      const { summary, description } = issue
      return (
        Issues.insert({
          summary,
          description,
          orderIds,
          driverId,
          issueStatus: 'open',
          tourId: order.tourId,
          createdAt: new Date(),
          createdBy: this.userId,
          modifiedAt: new Date(),
          modifiedBy: this.userId,
        })
      )
    }
    return ''
  },

  'issues.saveImages': function (data) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(data, Object)
    const { issueId, imageUrl } = data
    const query = { _id: issueId }
    Issues.update(
      query,
      {
        $addToSet: {
          images: { uri: imageUrl },
        },
      },
      {
        upsert: true,
      },
    )
  },

  'issues.removeImage': function (issue, img) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(issue, Object)
    check(img, Object)

    Issues.update(
      {
        _id: issue._id,
      },
      {
        $pull: {
          images: {
            $in: [img],
          },
        },
      },
    )
  },

  'issues.update': function (issueObj) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(issueObj, Object)

    const { issue, summary, description } = issueObj
    if (issue) {
      const query = {
        _id: issue._id,
      }
      Issues.update(
        query,
        {
          $set: {
            summary,
            description,
          },
        },
        {
          multi: true,
        },
      )
    }
  },

  'issues.updateStatus': function (issue, issueStatus, modifiedBy) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }
    check(issue, Object)
    check(issueStatus, String)
    check(modifiedBy, String)

    Issues.update(
      { _id: issue._id },
      { $set: { issueStatus, modifiedBy, modifiedAt: new Date() } },
    )
  },
})
