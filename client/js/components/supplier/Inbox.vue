<template>
    <section class="todoapp">
        <header class="header">
            <h1>Bestellungen</h1>
            <input
                v-show="false"
                v-model="newTodo"
                autofocus
                autocomplete="off"
                placeholder="Eintrag hier hinzufügen"
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
            <label for="toggle-all">Alles markieren</label>
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
                <strong>{{ remaining }}</strong> {{ remaining | pluralize }} übrig
            </span>
            <ul class="filters">
                <li>
                    <a
                        href="#all"
                        :class="{ selected: visibility == 'all' }"
                        @click="visibility = 'all'"
                    >Alle</a>
                </li>
                <li>
                    <a
                        href="#active"
                        :class="{ selected: visibility == 'active' }"
                        @click="visibility = 'active'"
                    >Nur aktive</a>
                </li>
                <li>
                    <a
                        href="#completed"
                        :class="{ selected: visibility == 'completed' }"
                        @click="visibility = 'completed'"
                    >Erledigte</a>
                </li>
            </ul>
            <button
                v-show="todos.length > remaining"
                class="clear-completed"
                @click="removeCompleted"
            >
                Erledigte löschen
            </button>
        </footer>
    </section>
</template>


<script>
import db from '../../db'
// Full spec-compliant TodoMVC with localStorage persistence
// and hash-based routing in ~120 effective lines of JavaScript.

// localStorage persistence
var STORAGE_KEY = 'todos-vuejs-2.0'
var todoStorage = {
    fetch: function () {
        var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        todos.forEach(function (todo, index) {
            todo.id = index
        })
        todoStorage.uid = todos.length
        return todos
    },
    save: function (todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
}

// visibility filters
var filters = {
    all: function (todos) {
        return todos
    },
    active: function (todos) {
        return todos.filter(function (todo) {
            return !todo.completed
        })
    },
    completed: function (todos) {
        return todos.filter(function (todo) {
            return todo.completed
        })
    }
}


// mount
export default {
    filters: {
        pluralize: (n) => {
            return n === 1 ? 'Eintrag' : 'Einträge'
        }
    },

    // a custom directive to wait for the DOM to be updated
    // before focusing on the input field.
    // http://vuejs.org/guide/custom-directive.html
    directives: {
        'todo-focus': function (el, binding) {
            if (binding.value) {
                el.focus()
            }
        }
    },
    props: {
        userId: String
    },
    // app initial state
    data: function () {
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
        filteredTodos: function () {
            return filters[this.visibility](this.todos)
        },
        remaining: function () {
            return filters.active(this.todos).length
        },
        allDone: {
            get: function () {
                return this.remaining === 0
            },
            set: function (value) {
                this.todos.forEach(function (todo) {
                    todo.completed = value
                })
            }
        }
    },

    // watch todos change for localStorage persistence
    watch: {
        todos: {
            handler: function (todos) {
                todoStorage.save(todos)
            },
            deep: true
        },
        userId: {
            handler: function (id) {
                if (id !== '') this.fetchOrders(id)
            }
        }
    },

    // methods that implement data logic.
    // note there's no DOM manipulation here at all.
    methods: {
        fetchOrders: function (id) {
            db.odersBySupplier(id).then(res => {
                console.log(res, this.todos.length)
                if (res.size !== this.todos.length) {
                    res.forEach(x => {
                        console.log(x.data())
                        this.addOrder({
                            id: x.data().id,
                            name: x.data().products.map(v => v.description).join(', ')
                        })

                    })
                }
            })
        },
        addOrder: function (o) {
            this.todos.push({
                id: o.id,
                title: o.name,
                completed: false
            })
            this.newTodo = ''
        },
        addTodo: function () {
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

        removeTodo: function (todo) {
            this.todos.splice(this.todos.indexOf(todo), 1)
        },

        editTodo: function (todo) {
            this.beforeEditCache = todo.title
            this.editedTodo = todo
        },

        doneEdit: function (todo) {
            if (!this.editedTodo) {
                return
            }
            this.editedTodo = null
            todo.title = todo.title.trim()
            if (!todo.title) {
                this.removeTodo(todo)
            }
        },

        cancelEdit: function (todo) {
            this.editedTodo = null
            todo.title = this.beforeEditCache
        },

        removeCompleted: function () {
            this.todos = filters.active(this.todos)
        }
    }
}


</script>

<style>



</style>

