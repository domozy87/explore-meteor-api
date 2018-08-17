import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import Issues from '../issues'
import Lang from '../../../translation/en'

if (Meteor.isServer) {
  Meteor.publish('issues.byOrder', function (order) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(order, Object)

    const query = {
      orderIds: {
        $in: [order._id],
      },
    }
    return Issues.find(query)
  })
}
