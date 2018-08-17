import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { DRIVER_SETTINGS } from '../../settings'
import Security from '../security/security'
import Lang from '../../translation/en'

if (Meteor.isServer) {
  const USER_METHODS = ['users.checkUserRole', 'users.getDriverSettings']
  Security(USER_METHODS)
}

Meteor.methods({
  'users.checkUserRole': function (email = null, role = 'driver') {
    check(email, String)
    check(role, String)

    const user = Accounts.findUserByEmail(email)

    if (_.isEmpty(user)) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    const userRoles = user.roles

    if (_.isEmpty(userRoles)) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    if (_.indexOf(userRoles, role) < 0) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    return true
  },

  'users.getDriverSettings': function () {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    return DRIVER_SETTINGS
  },
})
