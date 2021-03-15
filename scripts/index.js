import TodoList from "./TodoList.js";

const addTodoItemFormElement = document.querySelector(".add-todo-item__form");
const addTodoItemInputElement = document.querySelector(".add-todo-item__input");
const todoListElement = document.querySelector(".todo-list");
const footerTextElement = document.querySelector(".footer__text");
const footerButtonElement = document.querySelector(".footer__button");

const buttonAllElement = document.querySelector("#button-all");
const buttonActiveElement = document.querySelector("#button-active");
const buttonCompletedElement = document.querySelector("#button-completed");

const buttonBoxButtonElements = document.getElementsByClassName(
  "button-box__button"
);

const containerElement = document.querySelector(".container");
const headerButtonElement = document.querySelector(".header__button");
const headerIconElement = document.querySelector(".header__icon");

const ALL = "all";
const ACTIVE = "active";
const COMPLETED = "completed";

const LOCAL_STORAGE_TODO_LIST = "todo-list-data";
const LOCAL_STORAGE_CATEGORY = "todo-category-data";
const LOCAL_STORAGE_THEME = "todo-theme-data";

const DARK = "dark";
const LIGHT = "light";

const VALID_THEMES = Object.freeze([DARK, LIGHT]);

const todoList = new TodoList();
let currentCategory = ALL;
let currentTheme = DARK;

function clearActiveButtonBoxButton() {
  const activeClass = "button-box__button--active";
  for (let i = 0; i < buttonBoxButtonElements.length; i++) {
    if (buttonBoxButtonElements[i].classList.contains(activeClass)) {
      buttonBoxButtonElements[i].classList.remove(activeClass);
    }
  }
}

function setActiveButtonBoxButton(element) {
  element.classList.add("button-box__button--active");
}

function isActiveButtonBoxButton(button) {
  return button.classList.contains("button-box__button--active") ? true : false;
}

function switchActiveButtonBoxButton(button) {
  if (isActiveButtonBoxButton(button)) return;

  clearActiveButtonBoxButton();
  setActiveButtonBoxButton(button);
}

buttonAllElement.addEventListener("click", (e) => {
  if (currentCategory === ALL) return;

  currentCategory = ALL;
  switchActiveButtonBoxButton(buttonAllElement);
  renderTodoListElement();
});

buttonActiveElement.addEventListener("click", (e) => {
  if (currentCategory === ACTIVE) return;

  currentCategory = ACTIVE;
  switchActiveButtonBoxButton(buttonActiveElement);
  renderTodoListElement();
});

buttonCompletedElement.addEventListener("click", (e) => {
  if (currentCategory === COMPLETED) return;

  currentCategory = COMPLETED;
  switchActiveButtonBoxButton(buttonCompletedElement);
  renderTodoListElement();
});

addTodoItemFormElement.addEventListener("submit", (e) => {
  e.preventDefault();

  if (
    addTodoItemInputElement.value == null ||
    addTodoItemInputElement.value === ""
  )
    return;

  todoList.add(addTodoItemInputElement.value);
  addTodoItemInputElement.value = "";

  renderTodoListElement();
});

todoListElement.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    todoList.all.forEach((todo) => {
      if (todo.id == e.target.id) todo.toggleState();
    });

    renderTodoListElement();
  }
});

footerButtonElement.addEventListener("click", (e) => {
  todoList.clearCompleted();

  renderTodoListElement();
});

function addDummyData() {
  todoList.add("Complete online JavaScript course");
  todoList.add("Jog around the park 3x");
  todoList.add("10 minutes meditation");
  todoList.add("Read for 1 hour");
  todoList.add("Pick up groceries");
  todoList.add("Complete Todo App on Frontend Mentor");

  todoList.all[0].isCompleted = true;

  console.log(
    "Todo Item:",
    todoList.all[0].id,
    todoList.all[0].text,
    todoList.all[0].isCompleted
  );
}

function init() {
  if (todoList.length == 0) {
    const localStorageTodoList = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_TODO_LIST)
    );
    if (
      localStorageTodoList &&
      Array.isArray(localStorageTodoList) &&
      localStorageTodoList.length > 0
    ) {
      todoList.todos = localStorageTodoList;
    } else {
      addDummyData();
    }
  }
  const localStorageCategory = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_CATEGORY)
  );
  if (localStorageCategory) {
    currentCategory = localStorageCategory;
  }
  const localStorageTheme = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_THEME)
  );
  if (
    VALID_THEMES.includes(localStorageTheme) &&
    currentTheme !== localStorageTheme
  ) {
    switchTheme();
  }
  renderTodoListElement();
}

init();

function clearTodoListElement() {
  while (todoListElement.firstChild) {
    todoListElement.removeChild(todoListElement.firstChild);
  }
}

function fillTodoListElementWith(list) {
  if (list.length > 0) {
    list.forEach((todo) => {
      todoListElement.appendChild(todo.element);
    });
  } else {
    todoListElement.innerHTML = `
      <div class="todo-item">
        <p class="todo-item__text">There are no items here.</p>
      </div>  
    `;
  }
}

function renderTodoListElement() {
  clearTodoListElement();

  if (currentCategory === ALL) {
    fillTodoListElementWith(todoList.all);
    switchActiveButtonBoxButton(buttonAllElement);
  } else if (currentCategory === ACTIVE) {
    fillTodoListElementWith(todoList.active);
    switchActiveButtonBoxButton(buttonActiveElement);
  } else if (currentCategory === COMPLETED) {
    fillTodoListElementWith(todoList.completed);
    switchActiveButtonBoxButton(buttonCompletedElement);
  }

  const todoItemButtonElements = document.getElementsByClassName(
    "todo-item__button"
  );

  for (let i = 0; i < todoItemButtonElements.length; i++) {
    todoItemButtonElements[i].addEventListener("click", onDeleteButtonClick);
  }

  const footerText = `item${
    todoList.incompletedItemsCount === 1 ? "" : "s"
  } left`;
  footerTextElement.innerHTML = `${todoList.incompletedItemsCount} ${footerText}`;

  localStorage.setItem(LOCAL_STORAGE_TODO_LIST, JSON.stringify(todoList.all));
  localStorage.setItem(LOCAL_STORAGE_CATEGORY, JSON.stringify(currentCategory));
}

function onDeleteButtonClick(e) {
  const todoItemButtonElements = document.getElementsByClassName(
    "todo-item__button"
  );

  let index = null;

  try {
    for (let i = 0; i < todoItemButtonElements.length; i++) {
      if (todoItemButtonElements[i] === e.target) index = i;
    }

    if (index === null) throw new Error("Invalid button ID!");

    todoList.removeByIndex(index);

    renderTodoListElement();
  } catch (err) {
    console.error("Error!", err);
  }
}

/* ---------------------- THEME ---------------------*/

headerButtonElement.addEventListener("click", switchTheme);

function switchTheme() {
  const lightThemeClassName = "light-theme";

  if (currentTheme === LIGHT) {
    containerElement.classList.remove(lightThemeClassName);
    headerIconElement.setAttribute("src", "images/icon-sun.svg");
    currentTheme = DARK;
  } else {
    containerElement.classList.add(lightThemeClassName);
    headerIconElement.setAttribute("src", "images/icon-moon.svg");
    currentTheme = LIGHT;
  }

  localStorage.setItem(LOCAL_STORAGE_THEME, JSON.stringify(currentTheme));
}
