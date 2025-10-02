document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDateInput = document.getElementById('task-date');
    const taskTimeInput = document.getElementById('task-time');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        taskList.innerHTML = '';

        let filteredTasks = tasks;
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.dataset.id = task.id;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleComplete(task.id));

            const taskContent = document.createElement('div');
            taskContent.className = 'task-content';

            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.text;

            const taskDueDate = document.createElement('div');
            taskDueDate.className = 'task-due-date';
            if (task.date) {
                const date = new Date(`${task.date}T${task.time || '00:00'}`);
                taskDueDate.textContent = `Due: ${date.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}`;
            }

            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';

            const editButton = document.createElement('button');
            editButton.textContent = '✏️';
            editButton.addEventListener('click', () => editTask(task.id));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '🗑️';
            deleteButton.addEventListener('click', () => deleteTask(task.id));

            taskContent.appendChild(taskText);
            taskContent.appendChild(taskDueDate);
            taskActions.appendChild(editButton);
            taskActions.appendChild(deleteButton);
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskContent);
            taskItem.appendChild(taskActions);

            taskList.appendChild(taskItem);
        });
    };

    const addTask = (text, date, time) => {
        const newTask = {
            id: Date.now(),
            text,
            date,
            time,
            completed: false,
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
    };

    const toggleComplete = (id) => {
        tasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks();
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };

    const editTask = (id) => {
        const taskToEdit = tasks.find(task => task.id === id);
        const newText = prompt('Edit your task', taskToEdit.text);
        if (newText !== null && newText.trim() !== '') {
            tasks = tasks.map(task => 
                task.id === id ? { ...task, text: newText.trim() } : task
            );
            saveTasks();
            renderTasks();
        }
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        const taskDate = taskDateInput.value;
        const taskTime = taskTimeInput.value;

        if (taskText) {
            addTask(taskText, taskDate, taskTime);
            taskInput.value = '';
            taskDateInput.value = '';
            taskTimeInput.value = '';
            taskInput.focus();
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            renderTasks();
        });
    });

    renderTasks();
});