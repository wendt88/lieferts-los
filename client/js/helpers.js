export const DEFAULT_LANGUAGE = 'de'

export function getUserLanguage () {
    const path = window.location.pathname
    const lang = path.match(/^\/([\w]{2}(-[\w]{2})?)\//)
    return lang ? lang[1] : DEFAULT_LANGUAGE
}