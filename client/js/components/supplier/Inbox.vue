<template>
    <section class="todoapp">
        <header class="header">
            <h1>Bestellungen</h1>
            <input
                v-model="newOrder"
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
            <button
                v-show="todos.length > remaining"
                class="clear-completed"
                @click="removeCompleted"
            >
                Clear completed
            </button>
        </footer>
    </section>
</template>


<script>
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
            return n === 1 ? 'item' : 'items'
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
            console.log(this.todos, this.visibility, filters[this.visibility](this.todos))
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
        }
    },

    // methods that implement data logic.
    // note there's no DOM manipulation here at all.
    methods: {
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
hr {
	margin: 20px 0;
	border: 0;
	border-top: 1px dashed #c5c5c5;
	border-bottom: 1px dashed #f7f7f7;
}

.learn a {
	font-weight: normal;
	text-decoration: none;
	color: #b83f45;
}

.learn a:hover {
	text-decoration: underline;
	color: #787e7e;
}

.learn h3,
.learn h4,
.learn h5 {
	margin: 10px 0;
	font-weight: 500;
	line-height: 1.2;
	color: #000;
}

.learn h3 {
	font-size: 24px;
}

.learn h4 {
	font-size: 18px;
}

.learn h5 {
	margin-bottom: 0;
	font-size: 14px;
}

.learn ul {
	padding: 0;
	margin: 0 0 30px 25px;
}

.learn li {
	line-height: 20px;
}

.learn p {
	font-size: 15px;
	font-weight: 300;
	line-height: 1.3;
	margin-top: 0;
	margin-bottom: 0;
}

#issue-count {
	display: none;
}

.quote {
	border: none;
	margin: 20px 0 60px 0;
}

.quote p {
	font-style: italic;
}

.quote p:before {
	content: '“';
	font-size: 50px;
	opacity: .15;
	position: absolute;
	top: -20px;
	left: 3px;
}

.quote p:after {
	content: '”';
	font-size: 50px;
	opacity: .15;
	position: absolute;
	bottom: -42px;
	right: 3px;
}

.quote footer {
	position: absolute;
	bottom: -40px;
	right: 0;
}

.quote footer img {
	border-radius: 3px;
}

.quote footer a {
	margin-left: 5px;
	vertical-align: middle;
}

.speech-bubble {
	position: relative;
	padding: 10px;
	background: rgba(0, 0, 0, .04);
	border-radius: 5px;
}

.speech-bubble:after {
	content: '';
	position: absolute;
	top: 100%;
	right: 30px;
	border: 13px solid transparent;
	border-top-color: rgba(0, 0, 0, .04);
}

.learn-bar > .learn {
	position: absolute;
	width: 272px;
	top: 8px;
	left: -300px;
	padding: 10px;
	border-radius: 5px;
	background-color: rgba(255, 255, 255, .6);
	transition-property: left;
	transition-duration: 500ms;
}

@media (min-width: 899px) {
	.learn-bar {
		width: auto;
		padding-left: 300px;
	}

	.learn-bar > .learn {
		left: 8px;
	}
}


</style>

