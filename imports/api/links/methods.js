import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import shortid from 'shortid'
import Links from './links'
import Security from '../security/security'
import Lang from '../../translation/en'

if (Meteor.isServer) {
  const LINK_METHODS = ['links.insert', 'links.setVisibility', 'links.trackVisit']
  Security(LINK_METHODS)
}

if (Meteor.isClient) {
  Meteor.subscribe('links.all')
}

Meteor.methods({
  'links.insert': function (url) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(url, String)

    Links.InsertSchema.validate({ url })

    Links.insert({
      _id: shortid.generate(),
      url,
      userId: this.userId,
      visible: true,
      visitedCount: 0,
      lastVisitedAt: null,
    })
  },

  'links.setVisibility': function (_id, visible) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(_id, String)
    check(visible, Boolean)

    Links.setVisibilitySchema.validate({ _id, visible })

    Links.update({
      _id,
      userId: this.userId,
    }, {
      $set: { visible },
    })
  },

  'links.trackVisit': function (_id) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(_id, String)
    Links.trackVisitSchema.validate({ _id })

    Links.update({ _id }, {
      $set: {
        lastVisitedAt: new Date().getTime(),
      },
      $inc: {
        visitedCount: 1,
      },
    })
  },
})
