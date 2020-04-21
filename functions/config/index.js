const defaults = {
    pepper: undefined, // long random string
    mailAccountName: undefined, // account name using to log
    mailPassword: undefined, // password to log,
    frontendURLAuthority: undefined, // the url authority of the client
    reCaptchaSecret: undefined, // the google reCaptcha v2 secret key
}

const config = require('./config.js')

for (const prop of Object.keys(defaults)) {
    if (!config[prop]) {
        throw new Error(`no config.${prop} set`)
    }
}

module.exports = Object.assign(defaults, config)
