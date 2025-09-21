const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = '';
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });
    filteredTodos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-index="${index}">
            <span class="todo-text">${todo.text}</span>
            <button class="todo-edit" data-index="${index}">Éditer</button>
            <button class="todo-delete" data-index="${index}">Supprimer</button>
        `;
        todoList.appendChild(li);
    });
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        todos.push({ text, completed: false });
        saveTodos();
        renderTodos();
        todoInput.value = '';
    }
});

todoList.addEventListener('click', (e) => {
    const index = e.target.dataset.index;
    if (e.target.classList.contains('todo-checkbox')) {
        todos[index].completed = e.target.checked;
        saveTodos();
        renderTodos();
    } else if (e.target.classList.contains('todo-delete')) {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    } else if (e.target.classList.contains('todo-edit')) {
        const span = e.target.previousElementSibling;
        const originalText = span.textContent;
        span.contentEditable = true;
        span.focus();
        span.addEventListener('blur', () => {
            span.contentEditable = false;
            todos[index].text = span.textContent.trim();
            saveTodos();
            renderTodos();
        });
        span.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                span.blur();
            }
        });
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

renderTodos();