import moment from 'moment'
import Tours from './tours/tours'

const resolvers = {
  rootQuery: {
    async tours(_, args) {
      const { limit } = args
      return await Tours.find({}, { limit }).fetch()
    },
  },

  Date: {
    __parseValue(value) {
      return new Date(value)
    },
    __serialize(value) {
      return moment(value).format()
    },
  },
}

export default resolvers
