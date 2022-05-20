import { de } from 'date-fns/locale';
import * as TodoModels from './todo-models';
import { DOMManipulation } from './util';

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
    date.textContent = String(this.todoItem.dueDate);

    const projectTitle = DOMManipulation.createElementWithClass('div', 'todo-item-project-title');
    projectTitle.textContent = "__PLACEHOLDER__";

    const actions = DOMManipulation.createElementWithClass('div', 'todo-item-actions');
    const editButton = DOMManipulation.createElementWithClass('div', 'todo-item-edit');
    const deleteButton = DOMManipulation.createElementWithClass('div', 'todo-item-delete');
    editButton.textContent = "Edit";
    deleteButton.textContent = "Delete";
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    content.appendChild(labelCheckbox);
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(date);
    content.appendChild(projectTitle);
    content.appendChild(actions);

    return card;
  }
  
}


export { TodoItemView }