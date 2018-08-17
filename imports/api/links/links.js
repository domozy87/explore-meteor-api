import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Links = new Mongo.Collection('links')

Links.InsertSchema = new SimpleSchema({
  url: {
    type: String,
    label: 'Your link',
    regEx: SimpleSchema.RegEx.Url,
  },
})

Links.setVisibilitySchema = new SimpleSchema({
  _id: {
    type: String,
    min: 1,
  },
  visible: {
    type: Boolean,
  },
})

Links.trackVisitSchema = new SimpleSchema({
  _id: {
    type: String,
    min: 1,
  },
})

export default Links
