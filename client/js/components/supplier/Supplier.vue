<template>
    <div class="container">
        <header class="header">
            <i
                style="font-size: 3em; "
                class="fas fa-user-astronaut"
            ></i>
            <div>
                <span>{{ currentUser.name }}</span>
                <span>{{ currentUser.company }}</span>
            </div>
        </header>
        <nav class="navbar navbar-light bg-light">
            <a
                class="navbar-brand"
                href="#"
            >

            </a>
        </nav>
        <inbox />
    </div>
</template>

<script>
import Inbox from './Inbox'

export default {
    components: {
        'inbox': Inbox
    },
    data: () => {
        return {
            currentUser: {name: 'Hannes makes', company: 'Veggie sh*t'}
        }
    }
}
</script>