import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import Containers from './containers'
import Security from '../security/security'
import Lang from '../../translation/en'

if (Meteor.isServer) {
  const CONTAINER_METHODS = [
    'containers.upsert',
    'container.update',
    'containers.getContainerByContainerId',
  ]
  Security(CONTAINER_METHODS)
}

Meteor.methods({
  'containers.upsert': function (containerData) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(containerData, Object)

    const {
      containerId,
      code,
      caption,
      size,
      company,
      location,
    } = containerData

    // Check if container exist
    const ctn = Containers.findOne({ containerId })
    const dataObj = {
      containerId,
      code,
      caption,
      size,
      company,
      location,
      modifiedAt: new Date(),
      modifiedBy: this.userId,
    }

    if (_.isEmpty(ctn)) {
      Containers.update({
        containerId,
      }, {
        $set: _.extend(dataObj, { createdBy: this.userId, createdAt: new Date() }),
      }, {
        upsert: true,
      })
    } else {
      Containers.update({
        containerId,
      }, {
        $set: dataObj,
      }, {
        upsert: true,
      })
    }
  },
  'container.update': function (containerId, properties, modifiedBy) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(containerId, String)
    check(modifiedBy, String)
    check(properties, Object)

    let needUpdate = false
    const whiteListProperties = [
      'containerNumber',
    ]

    const modifiedAt = new Date()
    const updateProperties = { modifiedBy, modifiedAt }

    Object.entries(properties).forEach(([key, value]) => {
      if (whiteListProperties.indexOf(key) !== -1) {
        updateProperties[key] = value
        needUpdate = true
      }
    })

    if (needUpdate) {
      Containers.update({ containerId }, { $set: updateProperties })
    }
  },
  'containers.getContainerByContainerId': function (containerId) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(containerId, String)

    const query = {
      containerId,
    }

    return Containers.findOne(query)
  },
})
