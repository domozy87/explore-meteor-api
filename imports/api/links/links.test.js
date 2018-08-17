// Tests for the behavior of the links collection
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor'
import { assert } from 'meteor/practicalmeteor:chai'
import Links from './links'

if (Meteor.isServer) {
  describe('links collection', () => {
    it('insert correctly', () => {
      const linkId = Links.insert({
        title: 'meteor homepage',
        url: 'https://meteor',
      })
      const added = Links.find({ _id: linkId })
      const count = added.count()

      assert.equal(count, 1)
    })
  })
}
