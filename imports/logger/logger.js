import { Logger } from 'meteor/ostrio:logger'
import { LoggerFile } from 'meteor/ostrio:loggerfile'

// Initialize Logger:
const log = new Logger()
const path = '/data/logs'

// Initialize LoggerFile:
const LogFile = new LoggerFile(log, {
  fileNameFormat(time) {
    // Create log-files hourly
    return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}_${time.getHours()}.log`
  },
  format(time, level, message, data, userId) {
    // Omit Date and hours from messages
    return `[${level}] | ${time.getMinutes()}:${time.getSeconds()} | "${message}" | User: ${userId}\r\n`
  },
  path,
})

// Enable LoggerFile with default settings
LogFile.enable()
