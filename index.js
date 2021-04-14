const TODOS_LOCAL_STORAGE_KEY = 'TODOS';

const renderTodoList = () => {
  const todos = getTodos();
  const todosElement = document.getElementById('todos');
  todosElement.innerHTML = '';
  const deleteAllTodosButtonElement = document.getElementById('delete-all-todos-button');
  if (todos.length === 0) {
    todosElement.textContent = 'No tasks to do!';
    deleteAllTodosButtonElement.style.display = 'none';
  } else {
    for (const todo of todos) {
      const todoElement = createTodoElement(todo);
      todosElement.appendChild(todoElement);
    }
    deleteAllTodosButtonElement.style.display = 'inline';
  }
};

const addTodo = () => {
  const addTodoInputElement = document.getElementById('add-todo-input');
  if (addTodoInputElement.value.trim() === '') {
    return;
  }
  const todos = getTodos();
  const newTodo = createTodo(addTodoInputElement.value);
  todos.push(newTodo);
  addTodoInputElement.value = '';
  setTodos(todos);
};

const deleteTodo = (todoId) => {
  const todos = getTodos();
  const newTodos = todos.filter((todo) => todo.id !== todoId);
  setTodos(newTodos);
};

const createTodo = (text) => {
  return {
    id: Date.now(),
    editable: false,
    text,
  };
};

const getTodos = () => {
  const todos = JSON.parse(localStorage.getItem(TODOS_LOCAL_STORAGE_KEY));
  if (todos === null) {
    return [];
  } else {
    return todos;
  }
};

const setTodos = (todos) => {
  localStorage.setItem(TODOS_LOCAL_STORAGE_KEY, JSON.stringify(todos));
  renderTodoList();
};

const deleteTodos = () => {
  localStorage.removeItem(TODOS_LOCAL_STORAGE_KEY);
  renderTodoList();
};

const updateTodoText = ({ todoId, newText }) => {
  const todos = getTodos();
  const newTodos = todos.map((todo) => {
    if (todo.id === todoId) {
      todo.text = newText;
    }
    return todo;
  });
  setTodos(newTodos);
};

const toggleTodoEditable = (todoId) => {
  const todos = getTodos();
  const newTodos = todos.map((todo) => {
    if (todo.id === todoId) {
      todo.editable = !todo.editable;
    }
    return todo;
  });
  setTodos(newTodos);
};

const createTodoElement = (todo) => {
  const todoButtonsElement = createTodoButtonsElement(todo);
  const todoElement = document.createElement('div');
  todoElement.id = todo.id;
  todoElement.classList.add('todo');
  if (todo.editable) {
    const textareaElement = createTodoTextareaElement(todo);
    todoElement.appendChild(textareaElement);
  } else {
    const textElement = createTodoTextElement(todo.text);
    todoElement.appendChild(textElement);
  }
  todoElement.appendChild(todoButtonsElement);
  return todoElement;
};

const createTodoButtonsElement = (todo) => {
  const todoButtons = document.createElement('div');
  todoButtons.classList.add('todo-buttons');
  if (todo.editable) {
    const saveButton = createTodoSaveButtonElement(todo.id);
    todoButtons.appendChild(saveButton);
  } else {
    const editButton = createTodoEditButtonElement(todo.id);
    todoButtons.appendChild(editButton);
  }
  const deleteButton = createTodoDeleteButtonElement(todo.id);
  todoButtons.appendChild(deleteButton);
  return todoButtons;
};

const clickOnTodoSaveButtonElement = (todoId) => {
  const todo = document.getElementById(todoId);
  const saveButton = todo.querySelector('.save-button');
  saveButton.click();
};

const createTodoTextElement = (text) => {
  const element = document.createElement('div');
  element.textContent = text;
  return element;
};

const createTodoTextareaElement = (todo) => {
  const element = document.createElement('textarea');
  element.value = todo.text;
  element.onblur = () => clickOnTodoSaveButtonElement(todo.id);
  element.onchange = (e) => updateTodoText({ todoId: todo.id, newText: e.target.value });
  return element;
};

const createTodoDeleteButtonElement = (todoId) => {
  const button = document.createElement('button');
  button.onclick = () => deleteTodo(todoId);
  button.textContent = 'Delete';
  return button;
};

const createTodoEditButtonElement = (todoId) => {
  const button = document.createElement('button');
  button.classList.add('edit-button');
  button.onclick = () => toggleTodoEditable(todoId);
  button.textContent = 'Edit';
  return button;
};

const createTodoSaveButtonElement = (todoId) => {
  const button = document.createElement('button');
  button.classList.add('save-button');
  button.onclick = () => toggleTodoEditable(todoId);
  button.textContent = 'Save';
  return button;
};

window.onload = renderTodoList;
