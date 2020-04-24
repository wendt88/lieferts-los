<template>
    <input
        type="text"
    />
</template>

<script>
export default {
    props: {
        value: {
            default: null,
            required: true,
            validator (value) {
                return value === null || value instanceof Date || typeof value === 'string' || value instanceof String || value instanceof this.$moment
            }
        }
    },
    data () {
        return {
            dp: null
        }
    },
    watch: {
        value (value) {
            this.dp && this.dp.date(value || null)
        }
    },
    mounted () {
        this.dp = $(this.$el)
            .datetimepicker({
                locale: this.$moment.locale(),
                sideBySide: true,
                date: this.value,
                icons: {
                    time: 'fa fa-clock',
                    date: 'fa fa-calendar',
                    up: 'fa fa-chevron-up',
                    down: 'fa fa-chevron-down',
                    previous: 'fa fa-chevron-left',
                    next: 'fa fa-chevron-right',
                    today: 'fa fa-calendar-day',
                    clear: 'fa fa-trash-alt',
                    close: 'fa fa-times'
                },
                minDate: new Date()
            })
            .on('dp.change', e => {
                this.$emit('input', e.date ? e.date.toDate().toISOString() : null)
                this.dp.hide()
            })
            .data('DateTimePicker')
    },
    beforeDestroy () {
        this.dp && this.dp.destroy()
    }
}
</script>