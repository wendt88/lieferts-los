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
                style="font-size: 4em; border-radius: 1em;"
                class="fas fa-user-astronaut"
            ></i>
            <div
                style="flex-direction: column; display: flex;"
            >
                <span>{{ currentUser.name }}</span>
                <span>{{ currentUser.company }}</span>
            </div>
            <i class="fas fa-sign-out-alt fa-3x"></i>
        </header>
        <nav
            style="border-radius: 1em;"
            class="navbar navbar-light bg-light mt-1 mb-2"
        >
            <a
                href="#"
                style="color: black;"
                class="mr-3 fg-dark"
            ><i class="fas fa-inbox fa-3x"></i>
            </a>
            <a
                href="#"
                style="color: black;"
            >
                <i class="fas fa-cogs fa-3x"></i>
            </a>
        </nav>
        <inbox
            style="min-height: 100vh;"
            class="scroll-content"
            :user-id="currentUser.id"
        />
    </div>
</template>

<script>
import Inbox from './Inbox'
import db from '../../db'

export default {
    components: {
        'inbox': Inbox
    },
    data: () => {
        return {
            currentUser: {id: '', name: '', company: ''}
        }
    },
    mounted () {
        this.$refs.scrollable.scrollTop = this.$refs.setting.scrollHeight
        db.user().then(res => {
            console.log(res)
            this.currentUser = { ...res }
        })
    },
    methods: {
        debug: () => {
            console.log('Debug!')
        }
    }
}
</script>
