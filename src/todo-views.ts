import * as TodoModels from './todo-models';
import { DOMManipulation } from './util';
import { add, format, sub } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { es } from 'date-fns/locale';

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

  createViewElement(
    list: TodoModels.TodoList, 
    deleteFunction:  (id: string) => void, 
    addFunction: () => void,
    filter?: string
    ): HTMLElement
  {
    const items = DOMManipulation.createElementWithClass('div', 'main-todo-items');
    list.todoList.forEach((item) => {
      if (filter) {
        if (item.project === filter) {
          const itemView = new TodoItemView();
          items.appendChild(itemView.createViewElement(item, deleteFunction));
        }
      } else {
        const itemView = new TodoItemView();
        items.appendChild(itemView.createViewElement(item, deleteFunction));
      }
    });
    
    const addButton = DOMManipulation.createElementWithClass('button', 'add');
    addButton.textContent = 'Add';
    addButton.addEventListener('click', () => {
      addFunction();
    });

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
  addProjectButton: HTMLElement;
  active: string | undefined;

  constructor() {
    this.addProjectButton = document.querySelector('.add-project-button')!;
    this.active = undefined;
  }

  createViewElement(projectList: TodoModels.ProjectList, 
    refreshProjectListViewFunction: () => void,
    refreshTodoListViewFunction: () => void
    ): HTMLElement 
  {
    const menuList = DOMManipulation.createElementWithClass('div', 'menu-list');
    const ul = DOMManipulation.createElementWithClass('ul', 'ul-project-list');
    menuList.appendChild(ul);

    projectList.projects.forEach((project) => {
      const projectView = new ProjectView();
      const projectViewElement = projectView.createViewElement(project, () => {
        this.active = project.title;
        refreshProjectListViewFunction();
        refreshTodoListViewFunction();
      });
      
      if (project.title === this.active) {
        projectViewElement.classList.add('sidebar-active');
      }

      ul.appendChild(projectViewElement);
    });

    return menuList;
  }
}

class ModalView {
  static createViewElement(modalTitle: string): HTMLElement {
    const modal = DOMManipulation.createElementWithClass('div', 'modal');
    const modalContainer = DOMManipulation.createElementWithClass('div', 'modal-container');
    modal.appendChild(modalContainer);
    
    const modalContent = DOMManipulation.createElementWithClass('div', 'modal-content');
    modalContainer.appendChild(modalContent);

    const title = DOMManipulation.createElementWithClass('div', 'modal-title');
    title.textContent = modalTitle;
    modalContent.appendChild(title);

    const closeButton = DOMManipulation.createElementWithClass('button', 'close-modal');
    closeButton.textContent = 'X';
    title.appendChild(closeButton);
    closeButton.addEventListener('click', () => {
      modal.remove();
    })

    return modal;
  }
}

class ProjectModalView {
  todoList: TodoModels.TodoList

  constructor(todoList: TodoModels.TodoList) {
    this.todoList = todoList;
  }

  createViewElement(addFunction: (project: TodoModels.Project) => void): HTMLElement {
    const modal = ModalView.createViewElement('Add project');
    const modalContent = modal.querySelector('.modal-content')!;

    const form = (DOMManipulation.createElementWithClass('form', 'project-form') as HTMLFormElement);
    modalContent.appendChild(form);

    const [projectTitleLabel, projectTitleInput] = DOMManipulation.createFormInput('text', 'project-title', 'form-field', 'Name');
    const submitButton = document.createElement('input');
    submitButton.setAttribute('type', 'button');
    submitButton.setAttribute('value', 'Add');
    submitButton.addEventListener('click', () => {
      addFunction(new TodoModels.Project(projectTitleInput.value, this.todoList));
      form.reset();
    });
    
    form.appendChild(projectTitleLabel);
    form.appendChild(projectTitleInput);
    form.appendChild(submitButton);
    
    return modal;
  }
}

class TodoItemModalView {

  constructor() {

  }

  createViewElement(addFunction: (todoItem: TodoModels.TodoItem) => void): HTMLElement {
    const modal = ModalView.createViewElement('Add todo task');
    const modalContent = modal.querySelector('.modal-content')!;

    const [todoItemTitleLabel, todoItemTitleInput] = DOMManipulation.createFormInput('text', 'todo-item-title', '', 'Name');
    const [todoItemDescriptionLabel, todoItemDescriptionInput] = DOMManipulation.createFormInput('text', 'todo-item-description', '', 'Description');
    const [todoItemDateLabel, todoItemDateInput] = DOMManipulation.createFormInput('date', 'todo-item-date', '', 'Due date');
        
    const formView = new FormView([
      new TodoModels.FormItem(todoItemTitleInput, todoItemTitleLabel), 
      new TodoModels.FormItem(todoItemDescriptionInput, todoItemDescriptionLabel), 
      new TodoModels.FormItem(todoItemDateInput, todoItemDateLabel)
    ]);
    const form = formView.createViewElement('todo-item-form')

    const [selectLabel, selectOptions] = DOMManipulation.selectInputMaker('Project', 'project-list', 'project-list', ['asdf', 'alksdfj']);
    form.appendChild(selectLabel);
    form.appendChild(selectOptions);

    const submitButton = document.createElement('input');
    submitButton.setAttribute('type', 'button');
    submitButton.setAttribute('value', 'Add');
    submitButton.addEventListener('click', () => {
      const todoItem = DOMManipulation.extractTodoItemFormValues((form as HTMLFormElement));
      addFunction(todoItem);
    });

    form.appendChild(submitButton);
    modalContent.appendChild(form);

    return modal;
  }
}

class FormView {
  formItems: TodoModels.FormItem[];

  constructor(formItems: TodoModels.FormItem[]) {
    this.formItems = formItems;
  }

  createViewElement(formClass: string) {
    const form = DOMManipulation.createElementWithClass('form', formClass);
    this.formItems.forEach(item => {
      if (item.formLabel) {
        form.appendChild(item.formLabel);
      }
      form.appendChild(item.formInput);
    });

    return form;
  }
}

export { TodoItemView, TodoListView, ProjectView, ProjectListView, ProjectModalView, TodoItemModalView }