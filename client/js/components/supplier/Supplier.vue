<template>
    <div
        ref="scrollable"
        class="container scroll"
    >
        <header
            ref="setting"
            class="setting-header scroll-content"
        >
            <i
                style="font-size: 5em; border-radius: 1em;"
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
                <i class="fas fa-sign-out-alt fa-3x"></i>
            </button>
        </header>
        <nav
            class="navbar navbar-light bg-light mt-5 mb-4"
        >
            <div>
                <a
                    href="#"
                    class="mr-3 fg-dark"
                ><i class="fas fa-inbox fa-3x"></i>
                </a>
                <a
                    href="#"
                >
                    <i class="fas fa-cogs fa-3x"></i>
                </a>
            </div>
        </nav>
        <inbox
            class="scroll-content"
            shopmail="$auth.currentUserMail()"
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
    mounted () {
        this.$refs.scrollable.scrollTop = this.$refs.setting.scrollHeight
    },
    methods: {
        debug () {
            console.log(this.$auth.currentUserMail())
        }
    }
}
</script>
