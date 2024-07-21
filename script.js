class Task {
    constructor(text) {
        this.text = text;
        this.completed = false;
    }
}

class Node {
    constructor(task) {
        this.task = task;
        this.next = null;
        this.prev = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    add(task) {
        const newNode = new Node(task);
        if (!this.head) {
            this.head = this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        this.saveToLocalStorage();
    }

    remove(node) {
        if (node.prev) {
            node.prev.next = node.next;
        } else {
            this.head = node.next;
        }
        if (node.next) {
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev;
        }
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        let currentNode = this.head;
        const tasks = [];
        while (currentNode) {
            tasks.push(currentNode.task);
            currentNode = currentNode.next;
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    loadFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(taskData => {
            const task = new Task(taskData.text);
            task.completed = taskData.completed;
            this.add(task);
        });
    }
}

const taskList = new DoublyLinkedList();
taskList.loadFromLocalStorage();

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskListElement = document.getElementById('taskList');

function createTaskElement(node) {
    const taskElement = document.createElement('li');
    taskElement.classList.toggle('completed', node.task.completed);
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = node.task.completed;
    checkbox.addEventListener('change', () => {
        node.task.completed = !node.task.completed;
        taskElement.classList.toggle('completed', node.task.completed);
        taskList.saveToLocalStorage();
    });

    const text = document.createElement('span');
    text.textContent = node.task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.classList.add('delete');
    deleteBtn.addEventListener('click', () => {
        taskList.remove(node);
        taskListElement.removeChild(taskElement);
    });

    taskElement.appendChild(checkbox);
    taskElement.appendChild(text);
    taskElement.appendChild(deleteBtn);

    taskListElement.appendChild(taskElement);
}

addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const task = new Task(taskText);
        taskList.add(task);
        createTaskElement(taskList.tail);
        taskInput.value = '';
    }
});

(function loadTasks() {
    let currentNode = taskList.head;
    while (currentNode) {
        createTaskElement(currentNode);
        currentNode = currentNode.next;
    }
})();
