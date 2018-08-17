import { Mongo } from 'meteor/mongo'

const OrderConfirmations = new Mongo.Collection('order_confirmations')

export default OrderConfirmations
