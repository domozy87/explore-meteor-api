import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import Orders from './orders'
import Tours from '../tours/tours'
import OrderConfirmations from '../order_confirmations/order_confirmations'
import Security from '../security/security'
import Lang from '../../translation/en'
import { ROOT_URL } from '../../serverName'
import Env from '../../env'

if (Meteor.isServer) {
  const ORDER_METHODS = [
    'order.listByTour',
    'order.detail',
    'orders.byActiveTour',
    'order.findBySlip',
    'orders.saveCustomerSignature',
    'orders.updateStatuses',
    'order.update',
    'orders.updateWeightVolume',
    'orders.insertImages',
    'orders.uploadImage',
    'orders.saveWeightDocument',
    'orders.removeWeightDocument',
    'orders.updateStatusProcessingOrders',
  ]
  Security(ORDER_METHODS)
}

const fs = require('fs')

function createFileSuccess(fullPath, image64) {
  return new Promise((resolve) => {
    fs.writeFile(`${fullPath}`, image64, 'base64', (err) => {
      if (!err) {
        resolve(true)
      }
    })
  })
}

Meteor.methods({
  'order.listByTour': function (tourId) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(tourId, String)

    return Orders.find({ tourId }).fetch()
  },

  'order.detail': function (orderId) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(orderId, String)
    let query = {}

    if (orderId) {
      query = {
        _id: orderId,
      }
    }
    return Orders.findOne(query)
  },
  'order.updateStatus': function (orderId, orderStatus, modifiedBy) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(orderId, String)
    check(orderStatus, String)
    check(modifiedBy, String)
    const modifiedAt = new Date()
    if (orderStatus) {
      Orders.update({ _id: orderId }, { $set: { orderStatus, modifiedBy, modifiedAt } })
    }
  },
  'order.update': function (orderId, properties, modifiedBy) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(orderId, String)
    check(modifiedBy, String)
    check(properties, Object)

    let needUpdate = false
    const whiteListProperties = [
      'deponie',
      'deponieId',
      'service',
      'serviceId',
      'wasteType',
      'wasteTypeId',
      'containerType',
      'containerTypeId',
      'volume',
      'weight',
      'date',
      'time',
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
      Orders.update({ _id: orderId }, { $set: updateProperties })
    }
  },
  'orders.byActiveTour': function (driverId) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(driverId, String)

    const currentStartDateTime = new Date()
    const currentEndDateTime = new Date()
    currentEndDateTime.setUTCHours(23)
    currentEndDateTime.setUTCMinutes(59)
    currentEndDateTime.setUTCSeconds(59)

    const activeTour = Tours.findOne({
      driverId,
      date: {
        $gte: currentStartDateTime,
        $lte: currentEndDateTime,
      },
    })

    let orders = []
    if (activeTour) {
      orders = Orders.find({ tourId: activeTour._id }).fetch()
    }
    return orders
  },

  'order.findBySlip': function (slip) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(slip, String)
    const statuses = ['failed']
    const query = {
      slip,
      orderStatus: {
        $nin: statuses,
      },
    }

    return Orders.find(query).fetch()
  },

  'orders.saveCustomerSignature': function (data) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(data, Object)

    const {
      customerId, signature, orders, slip,
    } = data

    const sigBase64 = `data:image/png;base64,${signature}`
    data.signature = sigBase64
    data.signedAt = new Date()
    data.orders = orders.map(item => item._id)

    if (_.isEmpty(slip)) {
      OrderConfirmations.update(
        { customerId, orders },
        { $set: data },
        { upsert: true },
      )
    } else {
      OrderConfirmations.update(
        { customerId, slip },
        { $set: data },
        { multi: true, upsert: true },
      )
    }
  },

  'orders.updateStatuses': function (orders, orderStatus, modifiedBy) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }
    check(orders, [Object])
    check(orderStatus, String)
    check(modifiedBy, String)
    const orderIds = orders.map(order => order._id)
    Orders.update(
      { _id: { $in: orderIds } },
      { $set: { orderStatus, modifiedBy, modifiedAt: new Date() } },
      { multi: true },
    )
  },

  'orders.updateStatusProcessingOrders': function (driverId, order, orderStatus) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(driverId, String)
    check(order, Object)
    check(orderStatus, String)

    const query = {
      tourId: order.tourId,
      orderStatus: 'processing',
    }
    const orders = Orders.find(query).fetch()
    const orderIds = orders.map(processingOrder => processingOrder._id)
    Orders.update(
      { _id: { $in: orderIds } },
      { $set: { orderStatus, modifiedBy: driverId, modifiedAt: new Date() } },
      { multi: true },
    )
  },

  'orders.updateWeightVolume': function (order, type, data) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(order, Object)
    check(type, String)
    check(data, String)

    const query = {
      _id: order._id,
    }

    switch (type) {
      case 'weight':
        Orders.update(query, { $set: { weight: data } })
        break
      case 'volume':
        Orders.update(query, { $set: { volume: data } })
        break
      default:
    }
  },

  'orders.insertImages': function (order, images) {
    check(order, Object)
    check(images, Array)

    const query = {
      _id: order._id,
    }

    Orders.update(query, { $set: { images } })
  },

  'orders.uploadImage': async function (data) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(data, Object)
    const { image64 } = data
    const serverPath = `${process.env.PWD}/public/images/`
    const serverUrlPath = `${Env.PROTOCOL + ROOT_URL}/images/`
    const time = Date.now()
    const fileName = `${time}.JPG`

    const fileCreated = await createFileSuccess(`${serverPath + fileName}`, image64)
    if (fileCreated) {
      return `${serverUrlPath + fileName}`
    }
    throw new Meteor.Error(Lang['error.message.no_authorized'])
  },

  'orders.saveWeightDocument': function (data) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(data, Object)

    const { order, imageUrl } = data

    const where = {
      _id: order._id,
    }
    const updateField = {
      $addToSet: {
        weightDocuments: { uri: imageUrl },
      },
    }

    Orders.update(where, updateField, { upsert: true })
  },

  'orders.removeWeightDocument': function (order, img) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(order, Object)
    check(img, Object)

    Orders.update(
      {
        _id: order._id,
      },
      {
        $pull: {
          weightDocuments: {
            $in: [{
              uri: img.uri,
            }],
          },
        },
      },
    )
  },
})
