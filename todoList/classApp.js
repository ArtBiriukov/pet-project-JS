class Todo {
  constructor(form, input, todoList, todoCompleted) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoData = new Map(JSON.parse(localStorage.getItem('todoData')));
  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.handler();

    this.todoData.forEach(item => {
      this.createItem(item);
    });
  }

  addToStorage() {
    localStorage.setItem('todoData', JSON.stringify([...this.todoData]));
  }

  createItem(item) {
    const li = document.createElement('li');
    li.classList.add('todo-item', 'animate__animated', 'animate__fadeIn');
    li.key = item.key;

    li.innerHTML = `<span class="text-todo">${item.value}</span>
    <div class="todo-buttons">
      <button class="todo-edit"></button>
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
      this.todoCompleted.append(li);
      chekItem(this.todoList);

    } else {
      this.todoList.append(li);
      chekItem(this.todoCompleted);
    }
  }

  editItem(keyItem, itemText) {

    this.todoData.forEach(item => {

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
  }

  deleteItem(keyItem, li) {
    this.todoData.forEach(item => {
      if (item.key === keyItem) {

        /*Анимация исчезновения элемента*/
        li.classList.remove('animate__fadeIn');
        li.classList.add('animate__fadeOut');

        setTimeout(() => {
          li.remove();
        }, 400);

        this.todoData.delete(keyItem);
        this.render(keyItem);
      }
    });
  }

  completedItem(keyItem) {
    this.todoData.forEach(item => {

      if (item.key === keyItem) {
        item.completed = !item.completed;
        this.render(keyItem);
      }
    });
  }

  render(key) {
    this.todoData.forEach(item => {
      if (item.key == key) {
        this.createItem(item);
      }
    })

    this.addToStorage();

  }

  handler() {
    const todoWrap = document.querySelector('.todo-container');

    todoWrap.addEventListener('click', (event) => {
      const item = event.path[2],
        keyItem = item.key,
        textItem = item.firstChild,
        target = event.target;

      if (target.matches('button.todo-complete')) {
        this.completedItem(keyItem);
      } else if (target.matches('button.todo-remove')) {
        this.deleteItem(keyItem, item);
      } else if (target.matches('button.todo-edit')) {
        this.editItem(keyItem, textItem);
      }
    })
  }

  addTodo(event) {
    event.preventDefault();

    if (this.input.value.trim() !== '') {

      const newTodo = {
        value: this.input.value,
        completed: false,
        key: Date.now()
      };

      this.input.style.cssText = ``;
      this.input.value = '';

      this.todoData.set(newTodo.key, newTodo);

      this.render(newTodo.key);
    } else {
      this.input.style.cssText = `border: 2px Solid red;`;
    }
  }
}

const todoList = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todoList.init();