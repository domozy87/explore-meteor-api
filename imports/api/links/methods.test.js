// Tests for links methods
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor'
import { assert } from 'meteor/practicalmeteor:chai'
import Links from './links'
import './methods'

if (Meteor.isServer) {
  describe('links methods', () => {
    beforeEach(() => {
      Links.remove()
    })

    it('can add a new link', () => {
      Meteor.call('links.insert', 'https://www.meteor.com', (err) => {
        if (!err) {
          assert.equal(Links.find().count(), 1)
        }
      })
    })
  })
}
