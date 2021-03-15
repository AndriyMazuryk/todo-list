class TodoItem {
  constructor(id, text, isCompleted) {
    this.id = id;
    this.text = text;
    this.isCompleted = isCompleted;
  }

  toggleState() {
    this.isCompleted = !this.isCompleted;
  }

  render() {
    return `
      <span>
        <input
          class="todo-item__checkbox"
          type="checkbox"
          id="${this.id}"
          ${this.isCompleted ? "checked" : ""}
        />
        <label class="todo-item__label" for="${this.id}">
          <span class="custom-checkbox__outer">
            <span class="custom-checkbox__inner"></span>
          </span>
          ${this.text}
        </label>
      </span>
      <button class="todo-item__button"></button>
    `;
  }

  get element() {
    const div = document.createElement("div");
    div.classList.add("todo-item");
    div.innerHTML = this.render();
    return div;
  }
}

export default TodoItem;
