import * as TodoModels from './todo-models';
import { DOMManipulation, Misc } from './util';
import { format } from 'date-fns'

class TodoItemView {

  createViewElement(
    todoItem: TodoModels.TodoItem,
    deleteFunction: (id: string) => void,
    editFunction: (todoItem: TodoModels.TodoItem) => void,
    refreshProjectListViewFunction: () => void
    ): HTMLElement
  {
    const card = DOMManipulation.createElementWithClass('div', 'todo-item-card');
    const highlight = DOMManipulation.createElementWithClass('div', 'todo-item-highlight');
    const content = DOMManipulation.createElementWithClass('div', 'todo-item-content');
    card.appendChild(highlight);
    card.appendChild(content);

    card.classList.add(`prio-${TodoModels.Priority[todoItem.priority]}`);

    const labelCheckbox = DOMManipulation.createElementWithClass('label', 'todo-item-checkbox');
    labelCheckbox.setAttribute('for', todoItem.id);
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('id', todoItem.id);
    if (todoItem.completed) {
      checkbox.checked = true;
      card.classList.add('completed');
    }
    checkbox.addEventListener('change', (e) => {
      if ((e.currentTarget! as HTMLInputElement).checked) {
        todoItem.completed = true;
        card.classList.add('completed');
      } else {
        todoItem.completed = false;
        card.classList.remove('completed');
      }
      refreshProjectListViewFunction();
    });
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
    editButton.addEventListener('click', () => {
       editFunction(todoItem);
    });
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
    editFunction: (todoItem: TodoModels.TodoItem) => void,
    refreshProjectListViewFunction: () => void,
    filter?: string
    ): HTMLElement
  {
    const items = DOMManipulation.createElementWithClass('div', 'main-todo-items');
    list.todoList.forEach((item) => {
      if (filter) {
        if (item.project === filter || item.dueDateWithinTime(filter)) {
          const itemView = new TodoItemView();
          items.appendChild(itemView.createViewElement(
            item, deleteFunction, editFunction, refreshProjectListViewFunction
          ));
        }
      } else {
        const itemView = new TodoItemView();
        items.appendChild(itemView.createViewElement(
          item, deleteFunction, editFunction, refreshProjectListViewFunction
          ));
      }
    });
    
    const addButton = DOMManipulation.createElementWithClass('button', 'add');
    addButton.textContent = 'Add';
    addButton.addEventListener('click', () => {
      addFunction();
    });
    const addButtonHeader = document.querySelector('.add-project-button-header');
    // Remove event previous listeners by replacing the node with a clone
    const newAddButtonHeader = addButtonHeader?.cloneNode(true);
    addButtonHeader?.parentNode?.replaceChild(newAddButtonHeader!, addButtonHeader);
    newAddButtonHeader?.addEventListener('click', () => {
      addFunction();
    });

    items.appendChild(addButton);
    return items;
  }
}

class ProjectView {

  createViewElement(projectName: string, projectCount: number, onClick: () => void): HTMLElement {
    const sidebarItem = DOMManipulation.createElementWithClass('li', 'sidebar-item');
    const projectItemContent = DOMManipulation.createElementWithClass('div', 'project-item-content');
    const projectTitle = DOMManipulation.createElementWithClass('span', 'sidebar-item-title');
    projectTitle.textContent = projectName;
    const projectItemCount = DOMManipulation.createElementWithClass('span', 'project-item-count');
    projectItemCount.textContent = String(projectCount);

    projectItemContent.appendChild(projectTitle);
    projectItemContent.appendChild(projectItemCount);
    projectItemContent.addEventListener('click', onClick);

    sidebarItem.appendChild(projectItemContent);

    return sidebarItem;
  }
}

class ProjectListView {
  addProjectButton: HTMLElement;
  showHideProjectListButton: HTMLElement;
  active: string | undefined;
  hide: boolean;
  specialProjectNames: string[];

  constructor() {
    this.addProjectButton = document.querySelector('.add-project-button')!;
    this.showHideProjectListButton = document.querySelector('.project-list-show-hide-button')!;
    this.showHideProjectListButton.addEventListener('click', this.toggleProjectListCollapse.bind(this));
    this.active = 'Default';
    this.hide = false;

    this.specialProjectNames = ['Default', 'Today', 'This week', 'Next week'];
  }

  updateActiveProject(newActive: string) {
    this.active = newActive;
    this.setProjectMainTitle(this.active);
    this.updateProjectActionsDisplay();
  }

  updateProjectActionsDisplay() {
    const actions = document.querySelector('.project-title-actions');
    if (this.specialProjectNames.includes(this.active!)) {
      actions?.classList.add('hide');
    } else {
      actions?.classList.remove('hide');
    }
  }

  setProjectMainTitle(title: string) {
    const listTitle = document.querySelector('.main-title-text');
    listTitle!.textContent = title;
  }

  setEditProjectButtonFunction(editProjectFunction: (projectName: string | undefined) => void) {
    const editProjectButton = document.getElementById('project-title-edit');
    editProjectButton?.addEventListener('click', () => {
      editProjectFunction(this.active);
    });
  }

  setDeleteProjectButtonFunction(deleteProjectFunction: () => void) {
    const deleteProjectButton = document.getElementById('project-title-delete');
    deleteProjectButton?.addEventListener('click', deleteProjectFunction);
  }

  toggleProjectListCollapse() {
    const list = document.querySelector('.project-list > .menu-list')!;
    list.classList.toggle('hide');
    if (this.showHideProjectListButton.textContent === '▼') {
      this.showHideProjectListButton.textContent = '▶';
      this.hide = true;
    } else {
      this.showHideProjectListButton.textContent = '▼';
      this.hide = false;
    }
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
      const projectViewElement = projectView.createViewElement(project.title, project.getCount(), () => {
        this.updateActiveProject(project.title);
        refreshProjectListViewFunction();
        refreshTodoListViewFunction();
      });
      
      if (project.title === this.active) {
        projectViewElement.classList.add('sidebar-active');
      }

      ul.appendChild(projectViewElement);
    });

    if (this.hide) {
      menuList.classList.add('hide');
    }

    return menuList;
  }

  createTimeViewElement(
    todoList: TodoModels.TodoList,
    refreshProjectListViewFunction: () => void,
    refreshTodoListViewFunction: () => void
    ): HTMLElement 
  {
    const menuList = DOMManipulation.createElementWithClass('div', 'menu-list');
    const ul = DOMManipulation.createElementWithClass('ul', 'ul-project-list');
    menuList.appendChild(ul);

    const timeList = new TodoModels.ProjectList(
      [
        new TodoModels.Project('Today', todoList),
        new TodoModels.Project('This week', todoList),
        new TodoModels.Project('Next week', todoList)
      ]
    );

    timeList.projects.forEach((project) => {
      const projectView = new ProjectView();
      const projectViewElement = projectView.createViewElement(
        project.title, 
        project.getCountWithinTime(project.title), 
        () => {
          this.updateActiveProject(project.title);
          refreshProjectListViewFunction();
          refreshTodoListViewFunction();
        }
      );
      
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

  createViewElement
  (
    modalTitle: string,
    buttonText: string,
    addFunction: (project: TodoModels.Project) => void,
    validateFunction: (newProjectTitle: string) => boolean,
    validateErrorMessage: string,
  ): HTMLElement
  {
    const modal = ModalView.createViewElement(modalTitle);
    const modalContent = modal.querySelector('.modal-content')!;

    const form = (DOMManipulation.createElementWithClass('form', 'project-form') as HTMLFormElement);
    modalContent.appendChild(form);

    const [projectTitleLabel, projectTitleInput] = DOMManipulation.createFormInput('text', 'project-title', 'form-field', 'Name');
    projectTitleInput.addEventListener('input', () => { errorMessage.classList.add('hide') });
    const submitButton = document.createElement('input');
    submitButton.setAttribute('type', 'button');
    submitButton.setAttribute('value', buttonText);
    submitButton.addEventListener('click', () => {
      if (validateFunction(projectTitleInput.value)) {
        addFunction(new TodoModels.Project(projectTitleInput.value, this.todoList));
        form.reset();
      } else {
        console.log("Invalid title");
        errorMessage.classList.remove('hide');
      }
    });
    
    form.appendChild(projectTitleLabel);
    form.appendChild(projectTitleInput);

    const errorMessage = DOMManipulation.createElementWithClass('span', 'error-message');
    errorMessage.classList.add('hide');
    errorMessage.textContent = validateErrorMessage;
    form.appendChild(errorMessage);

    // Hack to prevent form from redirecting when only one form input on enter key press
    const hidden = document.createElement('input');
    hidden.setAttribute('hidden', '');
    form.appendChild(hidden);
    form.appendChild(submitButton);
    
    return modal;
  }
}

class TodoItemFormModalBase {
  static createViewElement(modalTitle: string, projectList: string[])
  :[HTMLElement, HTMLElement, [HTMLInputElement, HTMLInputElement, HTMLInputElement, HTMLElement, HTMLElement, HTMLInputElement]]
  {
    const modal = ModalView.createViewElement(modalTitle);
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

    const [selectLabel, selectOptions] = DOMManipulation.selectInputMaker(
      'Project', 'project-list', 'project-list', 
      projectList);
    form.appendChild(selectLabel);
    form.appendChild(selectOptions);

    const [selectPrioLabel, selectPrioOptions] = DOMManipulation.selectInputMaker(
      'Priority', 'priority-list', 'priority-list', 
      // Object values of enums include the number values as well so we need to filter them out
      (Object.values(TodoModels.Priority)).filter(value => typeof value === 'string') as string[]);
    form.appendChild(selectPrioLabel);
    form.appendChild(selectPrioOptions);

    const submitButton = document.createElement('input');
    submitButton.setAttribute('type', 'button');

    form.appendChild(submitButton);
    modalContent.appendChild(form);

    return [modal, form, [todoItemTitleInput, todoItemDescriptionInput, todoItemDateInput, selectOptions, selectPrioOptions, submitButton]];
  }
}

class TodoItemFormModalView {

  createViewElement(projectList: string[], activeProject: string | undefined, addFunction: (todoItem: TodoModels.TodoItem) => void): HTMLElement {
    const [modal, form, 
      [
        , 
        , 
        , 
        selectOptions,
        ,
        submitButton
      ]] = TodoItemFormModalBase.createViewElement('Add todo task', projectList);

    if (activeProject) {
      DOMManipulation.selectOption(selectOptions, activeProject);
    }
    submitButton.setAttribute('value', 'Add');
    submitButton.addEventListener('click', () => {
      const todoItem = DOMManipulation.extractTodoItemFormValues((form as HTMLFormElement));
      addFunction(todoItem);
    });

    return modal;
  }
}

class TodoItemEditFormModalView {

  createViewElement(projectList: string[], todoItem: TodoModels.TodoItem, editFunction: (todoItem: TodoModels.TodoItem) => void): HTMLElement {
    const [modal, form, 
      [
        todoItemTitleInput, 
        todoItemDescriptionInput, 
        todoItemDateInput, 
        selectOptions,
        selectPrioOptions,
        submitButton
      ]] = TodoItemFormModalBase.createViewElement('Edit todo task', projectList);

    todoItemTitleInput.value = todoItem.title;
    todoItemDescriptionInput.value = todoItem.description;
    todoItemDateInput.value = format(todoItem.dueDate, 'yyyy-MM-dd');
    DOMManipulation.selectOption(selectOptions, todoItem.project);
    DOMManipulation.selectOption(selectPrioOptions, TodoModels.Priority[todoItem.priority]);

    submitButton.setAttribute('value', 'Save');
    submitButton.addEventListener('click', () => {
      const newTodoItem = DOMManipulation.extractTodoItemFormValues((form as HTMLFormElement));
      editFunction(newTodoItem);
    });

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

class UndoView {
  undoFunction: () => void;

  constructor(undoFunction: () => void) {
    this.undoFunction = undoFunction;
  }

  createViewElement() {
    const view = DOMManipulation.createElementWithClass('div', 'undo-container');
    const card = DOMManipulation.createElementWithClass('div', 'undo-card');
    view.appendChild(card);
    const undoText = DOMManipulation.createElementWithClass('span', 'undo');
    undoText.textContent = 'Undo deletion?';
    const undoButton = DOMManipulation.createElementWithClass('button', 'btn-undo-delete');
    undoButton.addEventListener('click', () => {
      this.undoFunction();
      view.remove();
    });
    undoButton.textContent = 'Undo';

    const closeButton = DOMManipulation.createElementWithClass('button', 'btn-undo-close');
    closeButton.addEventListener('click', () => view.remove());
    closeButton.textContent = 'X';

    card.appendChild(undoText);
    card.appendChild(undoButton);
    card.appendChild(closeButton);

    setTimeout(() => {
      view.remove();
    }, 5000)

    return view;
  }
}

class ConfirmModal {
  createViewElement(projectName: string | undefined, todoList: TodoModels.TodoList, deleteFunction: (projectName: string) => void) {
    const modal = ModalView.createViewElement('Delete project?');
    const modalContent = modal.querySelector('.modal-content')!;

    const warningText = DOMManipulation.createElementWithClass('span', 'warning-text');
    if (projectName) {
      warningText.innerText = `There are ${todoList.count(projectName)} todo tasks in ${projectName}. \nDeleting the project will remove all of the todo tasks. \nDo you still want to delete the project?`;
    }

    const deleteButton = DOMManipulation.createElementWithClass('button', 'confirm-delete-button');
    deleteButton.textContent = 'Delete';
    const cancelButton = DOMManipulation.createElementWithClass('button', 'confirm-cancel-button');
    cancelButton.textContent = 'Cancel';

    const buttonsDiv = DOMManipulation.createElementWithClass('div', 'button-container');

    modalContent.appendChild(warningText);
    buttonsDiv.appendChild(cancelButton);
    buttonsDiv.appendChild(deleteButton);
    modalContent.appendChild(buttonsDiv);

    deleteButton.addEventListener('click', () => {
      if (projectName && projectName !== 'Default') {
        deleteFunction(projectName);
        modal.remove();
      }
    });
    cancelButton.addEventListener('click', () => { modal.remove() });

    return modal;
  }
}

export { TodoItemView, TodoListView, ProjectView, ProjectListView, ProjectModalView, TodoItemFormModalView, TodoItemEditFormModalView, UndoView, ConfirmModal }