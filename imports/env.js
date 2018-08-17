import { ROOT_URL } from './serverName'
import { MAIL_SETTINGS } from './settings'

const Env = {
  MAIL_URL: `${MAIL_SETTINGS.protocol}://${MAIL_SETTINGS.auth.user}:${MAIL_SETTINGS.auth.password}@${MAIL_SETTINGS.host}:${MAIL_SETTINGS.port}`,
  ROOT_URL,
  PROTOCOL: 'http://',
}

export default Env
