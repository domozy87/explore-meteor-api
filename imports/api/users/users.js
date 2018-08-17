import SimpleSchema from 'simpl-schema'
import { Accounts } from 'meteor/accounts-base'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import Lang from '../../translation/en'

// Define a rule that matches add comment attempts by non-admin users
const addLoginRule = {
  userId: () => true,
  type: 'method',
  method: 'login',
}
// Add the rule, allowing up to 5 messages every 1000 milliseconds.
DDPRateLimiter.addRule(addLoginRule, 5, 2000)
DDPRateLimiter.setErrorMessage(Lang['error.message.slow_down'])

Accounts.validateNewUser((user) => {
  const email = user.emails[0].address

  new SimpleSchema({
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email,
    },
  }).validate({ email })

  return true
})
