import { Meteor } from 'meteor/meteor'
import { assert } from 'meteor/practicalmeteor:chai'
import Containers from './containers'

if (Meteor.isServer) {
  describe('Containers collection', () => {
    it('insert correctly', () => {
      const containerId = Containers.insert({
        containerId: '1234567890',
        code: 'AB',
        caption: 'Ein Containername',
        size: 12030,
        company: 'a very long companyname Gmbh',
      })
      const added = Containers.find({ _id: containerId })
      const count = added.count()

      assert.equal(count, 1)
    })
  })
}
