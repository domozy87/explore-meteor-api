import { Meteor } from 'meteor/meteor'
import Links from '../links'


if (Meteor.isServer) {
  // links does not refer to the links collection.
  // We could have called that anything we wanted.
  Meteor.publish('links.all', function () {
    return Links.find({ userId: this.userId })
  })
}
