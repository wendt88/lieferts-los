<template>
    <section class="todoapp">
        <header class="header">
            <h1>Send this to outer space 🚀</h1>
            <input
                v-model="newTodo"
                autofocus
                autocomplete="off"
                placeholder="What needs to be shipped?"
                @keyup.enter="addTodo"
            />
        </header>
        <section
            v-show="todos.length"
            v-cloak
            class="main"
        >
            <input
                id="toggle-all"
                v-model="allDone"
                class="toggle-all"
                type="checkbox"
            />
            <label for="toggle-all"></label>
            <ul class="todo-list">
                <li
                    v-for="todo in filteredTodos"
                    :key="todo.id"
                    class="todo"
                    :class="{ completed: todo.completed, editing: todo == editedTodo }"
                >
                    <div class="view">
                        <input
                            v-model="todo.completed"
                            class="toggle"
                            type="checkbox"
                        />
                        <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
                        <button
                            class="destroy"
                            @click="removeTodo(todo)"
                        ></button>
                    </div>
                    <input
                        v-model="todo.title"
                        v-todo-focus="todo == editedTodo"
                        class="edit"
                        type="text"
                        @blur="doneEdit(todo)"
                        @keyup.enter="doneEdit(todo)"
                        @keyup.esc="cancelEdit(todo)"
                    />
                </li>
            </ul>
        </section>
        <footer
            v-show="todos.length"
            v-cloak
            class="footer"
        >
            <span class="todo-count">
                <strong>{{ remaining }}</strong> {{ remaining | pluralize }} left
            </span>
            <ul class="filters">
                <li>
                    <a
                        href="#all"
                        :class="{ selected: visibility == 'all' }"
                        @click="visibility = 'all'"
                    >All</a>
                </li>
                <li>
                    <a
                        href="#active"
                        :class="{ selected: visibility == 'active' }"
                        @click="visibility = 'active'"
                    >Active</a>
                </li>
                <li>
                    <a
                        href="#completed"
                        :class="{ selected: visibility == 'completed' }"
                        @click="visibility = 'completed'"
                    >Completed</a>
                </li>
            </ul>
            <!-- <button
                v-show="todos.length > remaining"
                class="clear-completed"
                @click="removeCompleted"
            >
                Clear completed
            </button> -->
        </footer>
    </section>
</template>
<!--
<template>
    <div class="container">
        <header class="header">
            <h1>Send this to outer space 🚀</h1>
            <input
                v-model="newOrder"
                autofocus
                autocomplete="off"
                placeholder="What needs to be shipped?"
                @keyup.enter="addTodo"
            />
        </header>
        <section class="list">
            <h1>Orders</h1>
            <div class="filters">
            </div>
            <ul class="order-list">
                <li class="order"></li>
            </ul>
        </section>
    </div>
</template> -->

<script>
import db from '../../db'
// localStorage persistence
var STORAGE_KEY = 'lieferts-los_orders'
var todoStorage = {
    fetch: () => {
        let orders = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').map((o, idx) => {
            o.id = idx
            return o
        })
        todoStorage.uid = orders.length
        return orders
    },
    save: (todos) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
}

// visibility filters
var filters = {
    all: (todos) => {
        return todos
    },
    active: (todos) => {
        return todos.filter((todo) => {
            return !todo.completed
        })
    },
    completed: (todos) => {
        return todos.filter((todo) => {
            return todo.completed
        })
    }
}

export default {

    filters: {
        pluralize: (n) => {
            return n === 1 ? 'item' : 'items'
        }
    },

    // a custom directive to wait for the DOM to be updated
    // before focusing on the input field.
    // http://vuejs.org/guide/custom-directive.html
    directives: {
        'todo-focus': (el, binding) => {
            if (binding.value) {
                el.focus()
            }
        }
    },
    // app initial state
    data: () => {
        return {
            todos: todoStorage.fetch(),
            newTodo: '',
            editedTodo: null,
            visibility: 'all'
        }
    },

    // computed properties
    // http://vuejs.org/guide/computed.html
    computed: {
        filteredTodos: () => {
            console.log(this.todos, this.visibility, filters[this.visibility](this.todos))
            return filters[this.visibility](this.todos)
        },
        remaining: () => {
            return filters.active(this.todos).length
        },
        allDone: {
            get: () => {
                return this.remaining === 0
            },
            set: (value) => {
                this.todos.forEach((todo) => {
                    todo.completed = value
                })
            }
        }
    },

    // watch todos change for localStorage persistence
    watch: {
        todos: {
            handler: (todos) => {
                todoStorage.save(todos)
            },
            deep: true
        }
    },

    mounted: () => {
        console.log('Mounted!')
        db.orderList().then(res => console.log(res))
    },

    // methods that implement data logic.
    // note there's no DOM manipulation here at all.
    methods: {
        addTodo: () => {
            var value = this.newTodo && this.newTodo.trim()
            if (!value) {
                return
            }
            this.todos.push({
                id: todoStorage.uid++,
                title: value,
                completed: false
            })
            this.newTodo = ''
        },

        removeTodo: (todo) => {
            this.todos.splice(this.todos.indexOf(todo), 1)
        },

        editTodo: (todo) => {
            this.beforeEditCache = todo.title
            this.editedTodo = todo
        },

        doneEdit: (todo) => {
            if (!this.editedTodo) {
                return
            }
            this.editedTodo = null
            todo.title = todo.title.trim()
            if (!todo.title) {
                this.removeTodo(todo)
            }
        },

        cancelEdit: (todo) => {
            this.editedTodo = null
            todo.title = this.beforeEditCache
        },

        removeCompleted: () => {
            this.todos = filters.active(this.todos)
        }
    }
}


</script>

