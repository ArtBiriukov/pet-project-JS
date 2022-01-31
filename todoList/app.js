'use strict';

const todoControl = document.querySelector('.todo-control'),
  headerInput = document.querySelector('.header-input'),
  todoList = document.querySelector('.todo-list'),
  todoCompleted = document.querySelector('.todo-completed');

let todoData = JSON.parse(localStorage.getItem('todoData'));

const createItem = (item) => {

  const li = document.createElement('li');
  li.classList.add('todo-item', 'animate__animated', 'animate__fadeIn');
  li.key = item.key;

  li.innerHTML = `<span class="text-todo">${item.value}</span>
                        <div class="todo-buttons">
                          <button class = "todo-edit"> </button>
                          <button class="todo-remove"></button>
                          <button class="todo-complete"></button>
                        </div>`;

  const chekItem = (list) => {
    if (item.key === li.key) {
      const allItem = list.querySelectorAll('li');

      allItem.forEach(item => {
        if (item.textContent === li.textContent) {
          item.remove();
        }
      })
    }
  };

  if (item.completed) {
    todoCompleted.append(li);
    chekItem(todoList);
  } else {
    todoList.append(li);
    chekItem(todoCompleted);
  }
}

const editItem = (keyItem, itemText) => {

  todoData.forEach(item => {

    if (item.key === keyItem) {
      if (!itemText.hasAttribute('contentEditable')) {
        itemText.setAttribute('contentEditable', true);
        itemText.focus();
      } else {

        /*Проверка на совподение текста из базы и из элемента */
        if (item.value !== itemText.textContent) {
          item.value = itemText.textContent;
        }
        itemText.removeAttribute('contentEditable');
      }
    }
  });
};

const deleteItem = (keyItem, li) => {

  todoData.forEach((item, index) => {

    if (item.key === keyItem) {
      /*Анимация исчезновения элемента*/
      li.classList.remove('animate__fadeIn');
      li.classList.add('animate__fadeOut');

      setTimeout(() => {
        li.remove();
      }, 400);

      todoData.splice(index, 1);

      render(keyItem);
    }
  });
};

const completedItem = (keyItem) => {
  todoData.forEach(item => {
    if (item.key === keyItem) {
      item.completed = !item.completed;
      render(keyItem);
    }
  })
};

const addToStorage = () => {
  localStorage.setItem('todoData', JSON.stringify(todoData));
};

const render = (key) => {

  todoData.forEach(item => {

    if (item.key == key) {
      createItem(item);
    }
  });

  addToStorage();
};

const addTodo = (e) => {
  e.preventDefault();

  if (headerInput.value != '') {

    const newTodo = {
      value: headerInput.value,
      completed: false,
      key: Date.now()
    }

    headerInput.style.cssText = ``;

    headerInput.value = '';
    todoData.push(newTodo);

    render(newTodo.key);

  } else {
    headerInput.style.cssText = `border: 2px Solid red;`;
  }

};

const handler = () => {
  const todoWrap = document.querySelector('.todo-container');

  todoWrap.addEventListener('click', (event) => {

    const item = event.path[2],
      keyItem = item.key,
      textItem = item.firstChild,
      target = event.target;

    if (target.matches('button.todo-complete')) {
      completedItem(keyItem);
    } else if (target.matches('button.todo-remove')) {
      deleteItem(keyItem, item);
    } else if (target.matches('button.todo-edit')) {
      editItem(keyItem, textItem);
    }

  })
}

const init = () => {
  todoControl.addEventListener('submit', addTodo);

  handler();

  if (todoData !== null) {
    todoData.forEach(item => {
      createItem(item);
    });
  } else(todoData = []);
};

init();