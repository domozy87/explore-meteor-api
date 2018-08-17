import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import Links from '../imports/api/links/links'
import Env from '../imports/env'
import '../imports/startup/server'
import '../imports/startup/simple-schema-configuration'
import '../imports/api/users/users'

Meteor.startup(() => {
  WebApp.connectHandlers.use((req, res, next) => {
    const _id = req.url.slice(1)
    const link = Links.findOne({ _id })

    if (link) {
      res.statusCode = 302
      res.setHeader('Location', link.url)
      res.end()
      Meteor.call('links.trackVisit', _id)
    } else {
      next()
    }
  })
  process.env.MAIL_URL = Env.MAIL_URL
})
