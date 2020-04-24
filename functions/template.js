module.exports = {
    replaceTags,
}

function replaceTags (string, tags) {
    return string.replace(/{{([^}]+)}}/g, function (match, tag) {
        tag = tag.trim()
        if (tag in tags) {
            return tags[tag]
        }
        return match
    })
}