import * as TodoModels from './todo-models';
import { DOMManipulation } from './util';
import { format } from 'date-fns'

class TodoItemView {
  todoItem: TodoModels.TodoItem;

  constructor(todoItem: TodoModels.TodoItem) {
    this.todoItem = todoItem;
  }

  createViewElement(): HTMLElement {
    const card = DOMManipulation.createElementWithClass('div', 'todo-item-card');
    const highlight = DOMManipulation.createElementWithClass('div', 'todo-item-highlight');
    const content = DOMManipulation.createElementWithClass('div', 'todo-item-content');
    card.appendChild(highlight);
    card.appendChild(content);

    const labelCheckbox = DOMManipulation.createElementWithClass('label', 'todo-item-checkbox');
    labelCheckbox.setAttribute('for', '__PLACEHOLDER__');
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    labelCheckbox.appendChild(checkbox);

    const title = DOMManipulation.createElementWithClass('div', 'todo-item-title');
    title.textContent = this.todoItem.title;

    const description = DOMManipulation.createElementWithClass('div', 'todo-item-description');
    description.textContent = this.todoItem.description;

    const date = DOMManipulation.createElementWithClass('div', 'todo-item-date');
    date.textContent = format(this.todoItem.dueDate, "MM/dd/yyyy");

    const projectTitle = DOMManipulation.createElementWithClass('div', 'todo-item-project-title');
    projectTitle.textContent = "__PLACEHOLDER__";

    const actions = DOMManipulation.createElementWithClass('div', 'todo-item-actions');
    const editSvgPath = require('./images/pencil.svg');
    const editButton = DOMManipulation.createElementWithClass('img', 'todo-item-edit');
    editButton.setAttribute('src', editSvgPath);
    const deleteSvgPath = require('./images/delete.svg');
    const deleteButton = DOMManipulation.createElementWithClass('img', 'todo-item-delete');
    deleteButton.setAttribute('src', deleteSvgPath);
    
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    content.appendChild(labelCheckbox);
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(date);
    content.appendChild(actions);
    content.appendChild(projectTitle);

    return card;
  }
  
}

class TodoListView {
  list: TodoModels.TodoList;

  constructor(todoList: TodoModels.TodoList) {
    this.list = todoList;
  }

  createViewElement(): HTMLElement {
    const items = DOMManipulation.createElementWithClass('div', 'main-todo-items');
    this.list.todoList.forEach(item => {
      const itemView = new TodoItemView(item);
      items.appendChild(itemView.createViewElement());
    });
    return items;
  }
}

export { TodoItemView, TodoListView }