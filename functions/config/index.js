const defaults = {
    pepper: undefined, // long random string
    mailAccountName: undefined, // account name using to log
    mailPassword: undefined, // password to log,
    frontenURLAuthority: undefined // the url authority of the client
}

const config = require('./config.js')

if (!config.pepper) {
    throw new Error('no config.pepper set')
}

if (!config.mailAccountName) {
    throw new Error('no config.mailAccountName set')
}

if (!config.mailPassword) {
    throw new Error('no config.mailPassword set')
}

if (!config.frontenURLAuthority) {
    throw new Error('no config.frontenURLAuthority set')
}

module.exports = Object.assign(defaults, config)
