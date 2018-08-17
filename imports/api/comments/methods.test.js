import { Meteor } from 'meteor/meteor'
import { assert } from 'meteor/practicalmeteor:chai'
import Comments from './comments'
import './methods'

if (Meteor.isServer) {
  describe('comment methods', () => {
    beforeEach(() => {
      Comments.remove()
    })

    it('can add a new comment', () => {
      Meteor.call('comments.insert', 'orderId1234567890', 'Test Comment', (err) => {
        if (!err) {
          assert.equal(Comments.find().count(), 1)
        }
      })
    })
  })
}
