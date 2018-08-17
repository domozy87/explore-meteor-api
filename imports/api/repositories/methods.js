import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import Repositories from './repositories'
import Security from '../security/security'
import Lang from '../../translation/en'

if (Meteor.isServer) {
  const REPOSITORY_METHODS = ['repositories.list']
  Security(REPOSITORY_METHODS)
}

Meteor.methods({
  'repositories.list': function (driverId, limit = 10) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(driverId, String)
    const projection = { limit }
    let result = []

    if (driverId) {
      const activeQuery = {}
      result = Repositories.find(activeQuery, projection).fetch()
    }
    return result
  },
})
