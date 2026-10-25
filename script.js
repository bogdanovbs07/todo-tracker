let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = ''; 

const taskList = document.getElementById('task-list');
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const addBtn = document.getElementById('add-btn');
const searchInput = document.getElementById('search-input');
const counterEl = document.getElementById('task-counter');
const themeBtn = document.getElementById('theme-toggle');

function updateCounter() {
    const activeCount = tasks.filter(t => !t.completed).length;
    counterEl.textContent = `(${activeCount})`;
}

function render() {
    const filtered = tasks.filter(t =>
        t.title.toLowerCase().includes(currentFilter.toLowerCase())
    );

    taskList.innerHTML = '';

    filtered.forEach((task, index) => {
        const li = document.createElement('li');

        const span = document.createElement('span');
        span.className = 'task-title' + (task.completed ? ' done' : '');
        span.textContent = task.title;
        span.onclick = () => toggleComplete(task.id);

        const badge = document.createElement('span');
        badge.className = `priority-badge priority-${task.priority}`;
        const labels = { high: 'Высокий', medium: 'Средний', low: 'Низкий' };
        badge.textContent = labels[task.priority];

        const del = document.createElement('button');
        del.className = 'delete-btn';
        del.textContent = '✕';
        del.onclick = () => deleteTask(task.id);

        li.appendChild(span);
        li.appendChild(badge);
        li.appendChild(del);
        taskList.appendChild(li);
    });

    updateCounter();
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const title = taskInput.value.trim();
    if (!title) return;

    tasks.push({
        id: Date.now(),
        title: title,
        priority: prioritySelect.value, // high / medium / low
        completed: false
    });

    taskInput.value = '';
    render();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    render();
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) task.completed = !task.completed;
    render();
}

searchInput.addEventListener('input', (e) => {
    currentFilter = e.target.value;
    render();
});

function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeBtn.textContent = 'Светлая тема';
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeBtn.textContent = 'Тёмная тема';
    }
}

themeBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeBtn.textContent = 'Тёмная тема';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeBtn.textContent = 'Светлая тема';
    }
});

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

initTheme();
render(); 
