import { Accounts } from 'meteor/accounts-base'
import Env from '../../env'

Accounts.emailTemplates.siteName = 'Driver App'
Accounts.emailTemplates.from = 'Driver App  <no-reply@example.com>'

Accounts.emailTemplates.resetPassword = {
  subject() {
    return 'Reset your password'
  },
  html(user, url) {
    url = url.replace(/localhost:[0-9]{4}/i, Env.ROOT_URL)
    const resetPasswordLink = `<a href=${url} target="_blank">Reset Password</a>`
    return `<p>Hello!</p>

<p>Click the link below to reset your password:</p>
${resetPasswordLink}

<p>If you didn't request this email, please ignore it.</p>

<p>Thanks, <br>
The Driver App team</p>`
  },
}
