<template>
    <div class="container scroll">
        <header class="header scroll-content">
            <i
                style="font-size: 5em; border-radius: 1em; background-color: #898989;"
                class="fas fa-user-astronaut"
            ></i>
            <div
                style="flex-direction: column; display: flex;"
            >
                <span>{{ currentUser.name }}</span>
                <span>{{ currentUser.company }}</span>
            </div>
            <button
                class="clear-completed"
                @click="debug"
            >
                <i class="fas fa-sign-out-alt"></i>
            </button>
        </header>
        <nav class="navbar navbar-light bg-light">
            <a
                class="navbar-brand"
                href="#"
            >

            </a>
        </nav>
        <inbox
            class="scroll-content"
            style="height: 100vh;"
        />
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
            currentUser: {name: 'Hannes makes', company: 'Cool sh*t'}
        }
    },
    methods: {
        debug: () => {
            console.log('Debug!')
        }
    }
}
</script>