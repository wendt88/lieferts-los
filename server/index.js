const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')

app.use(express.static('output'))

app.get('/:language([a-z]{2})?/:path?', (req, res) => {
    let p = getFilePath(req.params.language)
    fs.exists(path, exists => {
        if (!exists)
            p = getFilePath()
        res.sendFile(path.resolve(p))
    })
})

function getFilePath (language) {
    return `./output${language ? `/${language}` : ''}/index.html`
}

const port = process.env.PORT || 3000
app.listen(port)
console.log('port', port)