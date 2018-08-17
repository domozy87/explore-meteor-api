import { Meteor } from 'meteor/meteor'
import Services from '../services/services'
import WasteTypes from '../waste_types/waste_types'
import Repositories from '../repositories/repositories'
import ContainerTypes from '../container_types/container_types'
import Security from '../security/security'
import Lang from '../../translation/en'

if (Meteor.isServer) {
  const TOUR_METHODS = ['Common.list']
  Security(TOUR_METHODS)
}

Meteor.methods({
  'Common.list': function () {
    if (!this.userId) {
      throw new Meteor.Error(Lang['error.message.no_authorized'])
    }

    const result = {
      deponies: Repositories.find().fetch(),
      services: Services.find().fetch(),
      wasteTypes: WasteTypes.find().fetch(),
      containerTypes: ContainerTypes.find().fetch(),
    }

    return result
  },
})
