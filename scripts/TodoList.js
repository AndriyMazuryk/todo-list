import TodoItem from "./TodoItem.js";

class TodoList {
  constructor() {
    this.list = [];
  }

  get all() {
    return this.list;
  }

  get active() {
    return this.list.filter((item) => item.isCompleted === false);
  }

  get completed() {
    return this.list.filter((item) => item.isCompleted === true);
  }

  get length() {
    return this.list.length;
  }

  get incompletedItemsCount() {
    return this.list.filter((item) => item.isCompleted === false).length;
  }

  set todos(value) {
    this.list = value;
    this.list.forEach((todo) => {
      todo.__proto__ = TodoItem.prototype;
    });
  }

  add(text) {
    const todo = this.createTodo(text);
    this.list.push(todo);
  }

  removeByIndex(index) {
    this.list.splice(index, 1);
  }

  clearCompleted() {
    this.list = this.list.filter((item) => item.isCompleted === false);
  }

  createTodo(text) {
    return new TodoItem(
      Date.now().toString() + Math.floor(Math.random() * 100),
      text,
      false
    );
  }
}

export default TodoList;
