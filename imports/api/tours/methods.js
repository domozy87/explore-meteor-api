import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import Tours from './tours'
import Trucks from '../trucks/trucks'
import Orders from '../orders/orders'
import Security from '../security/security'
import Lang from '../../translation/en'

if (Meteor.isServer) {
  const TOUR_METHODS = ['tours.getActive', 'tours.list']
  Security(TOUR_METHODS)
}

Meteor.methods({
  'tours.getActive': function (driverId, date = null) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(driverId, String)
    const currentStartDateTime = date instanceof Date ? date : new Date()
    const currentEndDateTime = date instanceof Date ? date : new Date()
    currentEndDateTime.setUTCHours(23)
    currentEndDateTime.setUTCMinutes(59)
    currentEndDateTime.setUTCSeconds(59)

    const result = Tours.findOne({
      driverId,
      date: {
        $gte: currentStartDateTime,
        $lte: currentEndDateTime,
      },
    })
    if (!result) {
      return {}
    }

    return result
  },

  'tours.list': function (driverId, limit = 10) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(driverId, String)
    let activeQuery = {}
    let passedQuery = {}
    const projection = { limit, sort: { date: 1 } }
    const result = {
      active: [],
      passed: [],
    }

    if (driverId) {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setUTCHours(23)
      endDate.setUTCMinutes(59)
      endDate.setUTCSeconds(59)

      activeQuery = {
        driverId,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      }
      result.active = Tours.find(activeQuery, { limit: 1, sort: { date: 1 } }).fetch()
      result.active = result.active.map(item => _.extend(item, {
        truck: Trucks.findOne({ _id: item.truckId }),
        issues: Orders.find({ tourId: item._id }, { issues: 1, _id: 0 }).fetch(),
      }))

      passedQuery = {
        driverId,
        date: {
          $lt: startDate,
        },
      }
      projection.sort = {
        date: -1,
      }
      result.passed = Tours.find(passedQuery, projection).fetch()
      result.passed = result.passed.map(item => _.extend(item, {
        truck: Trucks.findOne({ _id: item.truckId }),
        issues: Orders.find({ tourId: item._id }, { issues: 1, _id: 0 }).fetch(),
      }))
    }
    return result
  },

  'tours.generateSampleDriverData': function (email, oldDriverId) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }
    check(email, String)
    check(oldDriverId, String)
    const currentDate = new Date()
    let testDriverId = `Test${currentDate.getTime()}`
    const testUser = Meteor.users.findOne({ emails: { $elemMatch: { address: email } } })
    if (!testUser) {
      Meteor.users.insert({
        _id: testDriverId,
        createdAt: currentDate,
        services: {
          password: {
            bcrypt: '$2a$10$bXGlpRwBvHlpXzV135lDYePnr1bxt4q0wLX3COJTu8iRm.BOHWP.O',
          },
          resume: {
            loginTokens: [
              {
                when: currentDate,
                hashedToken: testDriverId,
              },
            ],
          },
        },
        emails: [
          {
            address: email,
            verified: true,
          },
        ],
        roles: [
          'driver',
        ],
        profile: {
          name: 'Test Driver',
          phone: '092866210',
        },
      })
    } else {
      testDriverId = testUser._id
    }

    Tours.update({ driverId: oldDriverId }, { $set: { driverId: testDriverId } }, { multi: true })
    const tours = Tours.find({ driverId: testDriverId }).fetch()
    // Set pass tour from last 5 day
    let i = -5
    tours.map((tour) => {
      const newDate = new Date()
      newDate.setUTCHours(23)
      newDate.setUTCMinutes(0)
      newDate.setUTCSeconds(0)
      newDate.setDate(newDate.getDate() + i)
      i += 1
      return Tours.update({ _id: tour._id }, { $set: { date: newDate } })
    })
  },
})
