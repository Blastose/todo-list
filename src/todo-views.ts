import * as TodoModels from './todo-models';
import { DOMManipulation } from './util';
import { add, format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'

class TodoItemView {

  createViewElement(todoItem: TodoModels.TodoItem, deleteFunction: (id: string) => void): HTMLElement {
    const card = DOMManipulation.createElementWithClass('div', 'todo-item-card');
    const highlight = DOMManipulation.createElementWithClass('div', 'todo-item-highlight');
    const content = DOMManipulation.createElementWithClass('div', 'todo-item-content');
    card.appendChild(highlight);
    card.appendChild(content);

    const labelCheckbox = DOMManipulation.createElementWithClass('label', 'todo-item-checkbox');
    labelCheckbox.setAttribute('for', todoItem.id);
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('id', todoItem.id);
    labelCheckbox.appendChild(checkbox);

    const title = DOMManipulation.createElementWithClass('div', 'todo-item-title');
    title.textContent = todoItem.title;

    const description = DOMManipulation.createElementWithClass('div', 'todo-item-description');
    description.textContent = todoItem.description;

    const date = DOMManipulation.createElementWithClass('div', 'todo-item-date');
    date.textContent = format(todoItem.dueDate, "MM/dd/yyyy");

    const projectTitle = DOMManipulation.createElementWithClass('div', 'todo-item-project-title');
    projectTitle.textContent = todoItem.project;

    const actions = DOMManipulation.createElementWithClass('div', 'todo-item-actions');
    const editSvgPath = require('./images/pencil.svg');
    const editButton = DOMManipulation.createElementWithClass('img', 'todo-item-edit');
    editButton.setAttribute('src', editSvgPath);
    editButton.setAttribute('title', 'Edit');
    const deleteSvgPath = require('./images/delete.svg');
    const deleteButton = DOMManipulation.createElementWithClass('img', 'todo-item-delete');
    deleteButton.setAttribute('src', deleteSvgPath);
    deleteButton.setAttribute('title', 'Delete');
    deleteButton.addEventListener('click',  () => { deleteFunction(todoItem.id) });
    
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

  createViewElement(list: TodoModels.TodoList, deleteFunction:  (id: string) => void, addFunction: (item: TodoModels.TodoItem) => void): HTMLElement {
    const items = DOMManipulation.createElementWithClass('div', 'main-todo-items');
    list.todoList.forEach((item) => {
      const itemView = new TodoItemView();
      items.appendChild(itemView.createViewElement(item, deleteFunction));
    });
    
    const addButton = DOMManipulation.createElementWithClass('button', 'add');
    addButton.textContent = 'Add';
    addButton.addEventListener('click', () => addFunction(new TodoModels.TodoItem(uuidv4(), uuidv4(), new Date(), TodoModels.Priority.none, false, uuidv4(), 'My Project')));

    items.appendChild(addButton);
    return items;
  }
}

class ProjectView {

  createViewElement(project: TodoModels.Project, onClick: () => void): HTMLElement {
    const sidebarItem = DOMManipulation.createElementWithClass('li', 'sidebar-item');
    const projectItemContent = DOMManipulation.createElementWithClass('div', 'project-item-content');
    const projectTitle = DOMManipulation.createElementWithClass('span', 'sidebar-item-title');
    projectTitle.textContent = project.title;
    const projectItemCount = DOMManipulation.createElementWithClass('span', 'project-item-count');
    projectItemCount.textContent = String(project.getCount());

    projectItemContent.appendChild(projectTitle);
    projectItemContent.appendChild(projectItemCount);
    projectItemContent.addEventListener('click', onClick);

    sidebarItem.appendChild(projectItemContent);

    return sidebarItem;
  }
}

class ProjectListView {

  createViewElement(projectList: TodoModels.ProjectList): HTMLElement {
    const menuList = DOMManipulation.createElementWithClass('div', 'menu-list');
    const ul = DOMManipulation.createElementWithClass('ul', 'ul-project-list');
    menuList.appendChild(ul);

    projectList.projects.forEach((project) => {
      const projectView = new ProjectView();

      ul.appendChild(projectView.createViewElement(project, () => {}));
    });

    return menuList;
  }
}

export { TodoItemView, TodoListView, ProjectView, ProjectListView }