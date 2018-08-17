import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import DriverLocations from './driver_locations'
import Security from '../security/security'
import Lang from '../../translation/en'

if (Meteor.isServer) {
  const DRIVER_LOCATION_METHODS = ['driver_locations.updateDriverLocation']
  Security(DRIVER_LOCATION_METHODS)
}

Meteor.methods({
  'driver_locations.updateDriverLocation': function (args) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(args, Object)

    const {
      userId, truckId, tourId, lat, long,
    } = args

    const projection = { userId, truckId, tourId }
    // Check if same data exist
    const driverLocation = DriverLocations.findOne(projection)

    const data = {
      userId,
      truckId,
      tourId,
      lat,
      long,
      modifiedBy: this.userId,
      modifiedAt: new Date(),
    }

    if (_.isEmpty(driverLocation)) {
      DriverLocations.update(
        projection,
        {
          $set: _.extend(data, { createdBy: this.userId, createdAt: new Date() }),
        },
        {
          upsert: true,
        },
      )
    } else {
      DriverLocations.update(projection, { $set: data }, { upsert: true })
    }
  },
})
