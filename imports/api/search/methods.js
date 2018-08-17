import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import Sites from '../sites/sites'
import Customers from '../customers/customers'
import Repositories from '../repositories/repositories'
import Security from '../security/security'
import Lang from '../../translation/en'

if (Meteor.isServer) {
  const SEARCH_METHODS = ['search.query']
  Security(SEARCH_METHODS)
}

Meteor.methods({
  'search.query': function (searchString) {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    check(searchString, String)
    let siteQuery = {}
    let repositoryQuery = {}
    const result = {}
    const limit = 15
    const projection = { limit, sort: { name: 1 } }

    if (searchString) {
      const regex = new RegExp(`${searchString}`, 'i')

      const customerQuery = {
        name: regex,
      }

      const customerDatas = Customers.find(customerQuery).fetch()
      const customerIds = customerDatas.map(item => item._id)

      siteQuery = {
        $or: [
          { name: regex },
          { address: regex },
          {
            customerId: {
              $in: customerIds,
            },
          },
        ],
      }

      repositoryQuery = {
        $or: [
          { name: regex },
          { address: regex },
        ],
      }
    }
    result.sites = Sites.find(siteQuery, projection).fetch()
    result.sites = result.sites.map(item => _.extend(
      item,
      { type: 'site', customer: Customers.findOne({ _id: item.customerId }) },
    ))

    // Search repositories
    result.repositories = Repositories.find(repositoryQuery, projection).fetch()
    result.repositories = result.repositories.map(item => _.extend(
      item,
      { type: 'repository' },
    ))

    return result
  },
})
