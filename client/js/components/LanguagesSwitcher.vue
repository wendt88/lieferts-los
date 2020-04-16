<template>
    <ul class="nav nav-pills">
        <li class="nav-item">
            <span
                class="nav-link active"
                href="#"
                v-text="currentLanguage"
            ></span>
        </li>
        <li
            v-for="(href, language) in alternativeLanguages"
            :key="language"
            class="nav-item"
        >
            <a
                class="nav-link"
                :href="href"
                v-text="language"
            ></a>
        </li>
    </ul>
</template>

<script>
export default {
    data () {
        let alternativeLanguages = {}
        $('link[rel="alternate"]')
            .each((i, e) => {
                alternativeLanguages[e.attributes.hreflang.value] = e.attributes.href.value
            })
        return {
            currentLanguage: $('html').attr('lang'),
            alternativeLanguages
        }
    }
}
</script>