import { Meteor } from 'meteor/meteor'
import { assert } from 'meteor/practicalmeteor:chai'
import Sites from './sites'

if (Meteor.isServer) {
  describe('sites collection', () => {
    it('insert correctly', () => {
      const siteId = Sites.insert({
        name: 'meteor homepage',
        address: 'https://meteor',
        lat: '48.124666',
        lng: '11.580564900000013',
        customerId: '11111111111',
        createdAt: new Date(),
        createdBy: 'tester',
        modifiedAt: new Date(),
        modifiedBy: 'tester',
      })
      const added = Sites.find({ _id: siteId })
      const count = added.count()

      assert.equal(count, 1)
    })
  })
}
