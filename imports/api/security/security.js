import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'

const Security = (methodList = []) => {
  const METHOD_LIST = _.pluck(methodList, 'name')
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(METHOD_LIST, name)
    },
    // Rate limit per connection ID
    connectionId() {
      return true
    },
  }, 5, 1000)
}

export default Security
