import * as TodoModels from './todo-models';
import * as TodoViews from './todo-views';
import { DOMManipulation, Misc } from './util';

class TodoItemController {
  todoItemModel: TodoModels.TodoItem;
  todoItemView: TodoViews.TodoItemView;

  constructor(todoItemModel: TodoModels.TodoItem, todoItemView: TodoViews.TodoItemView) {
    this.todoItemModel = todoItemModel;
    this.todoItemView = todoItemView;
  }
}

class TodoListController {
  todoListModel: TodoModels.TodoList;
  todoListView: TodoViews.TodoListView;
  deletedTodoListModel: TodoModels.TodoList;
  projectListModel: TodoModels.ProjectList;
  projectListView: TodoViews.ProjectListView;
  undoDeletionModal: TodoViews.UndoView;
  refreshProjectListView: (() => void) | undefined;

  constructor(
    todoListModel: TodoModels.TodoList, 
    todoListView: TodoViews.TodoListView, 
    projectListModel: TodoModels.ProjectList, 
    projectListView: TodoViews.ProjectListView,
    deletedTodoListModel: TodoModels.TodoList
    )
  {
    this.todoListModel = todoListModel;
    this.todoListView = todoListView;
    this.projectListModel = projectListModel;
    this.projectListView = projectListView;
    this.deletedTodoListModel = deletedTodoListModel;

    this.undoDeletionModal = new TodoViews.UndoView(() => {
      this.undoItemDeletion();
      this.refreshView.bind(this)();
      this.refreshProjectListView!.bind(this)();
    });
  }

  setRefreshTodoListViewFunction(refreshProjectListViewFunction: () => void) {
    this.refreshProjectListView = refreshProjectListViewFunction;
  }

  showList() {
    return this.todoListView.createViewElement(
      this.todoListModel,
      this.removeListItemAndRefreshView.bind(this),
      this.showModal.bind(this),
      this.showEditModal.bind(this),
      this.refreshProjectListView!,
      this.projectListView.active
      );
  }

  showModal() {
    const addItemModal = new TodoViews.TodoItemFormModalView().createViewElement(
      DOMManipulation.getProjectTitles(this.projectListModel), 
      this.projectListView.active, 
      (todoItem: TodoModels.TodoItem) => {
        this.addListItem(todoItem);
        addItemModal.remove();
      }
    );
    document.querySelector('.container')?.prepend(addItemModal);
    document.getElementById('todo-item-title')?.focus();
  }

  showUndoDeleteModal() {
    document.querySelector('.container')?.prepend(this.undoDeletionModal.createViewElement());
  }

  showEditModal(todoItem: TodoModels.TodoItem) {
    const editModal = new TodoViews.TodoItemEditFormModalView().createViewElement(
      DOMManipulation.getProjectTitles(this.projectListModel),
      todoItem,
      (newTodoItem: TodoModels.TodoItem) => {
        this.editListItem(todoItem, newTodoItem);
        editModal.remove();
      },
    );
    document.querySelector('.container')?.prepend(editModal);
    document.getElementById('todo-item-title')?.focus();
  }

  // Create a separate function instead of using an arrow function
  // because I couldn't get the arrow function to work
  removeListItemAndRefreshView(id: string) {
    this.removeListItemById(id);
    this.refreshView();
    this.refreshProjectListView!();
    this.showUndoDeleteModal();
  }

  removeListItem(index: number) {
    this.todoListModel.remove(index);
    Misc.setLocalStorage('TodoList', this.todoListModel);
  }

  removeListItemById(id: string) {
    const item = this.todoListModel.removeById(id);
    if (item) {
      this.deletedTodoListModel.add(item);
    }
    Misc.setLocalStorage('TodoList', this.todoListModel);
  }

  addListItem(item: TodoModels.TodoItem) {
    this.todoListModel.add(item);
    this.refreshView();
    this.refreshProjectListView!();
    Misc.setLocalStorage('TodoList', this.todoListModel);
  }

  undoItemDeletion() {
    const deletedItem = this.deletedTodoListModel.pop();
    if (deletedItem) {
      this.todoListModel.add(deletedItem);
      console.log(deletedItem);
    }
    Misc.setLocalStorage('TodoList', this.todoListModel);
  }

  editListItem(todoItem: TodoModels.TodoItem, newTodoItem: TodoModels.TodoItem) {
    Object.assign(todoItem, newTodoItem);
    this.todoListModel.removeById(todoItem.id);
    this.todoListModel.add(todoItem);
    this.refreshView();
    this.refreshProjectListView!();
    Misc.setLocalStorage('TodoList', this.todoListModel);
  }

  refreshView() {
    const todoItems = document.querySelectorAll('.main-todo-items')!;
    todoItems.forEach(item => item.remove());

    const mainContent = document.querySelector('.main-content')!;
    mainContent.appendChild(this.showList());
  }
}

class ProjectListController {
  projectListModel: TodoModels.ProjectList;
  projectListView: TodoViews.ProjectListView;
  todoList: TodoModels.TodoList;
  refreshTodoListView: (() => void) | undefined;

  constructor(projectListModel: TodoModels.ProjectList, projectListView: TodoViews.ProjectListView, todoList: TodoModels.TodoList) {
    this.projectListModel = projectListModel;
    this.projectListView = projectListView;
    this.todoList = todoList;
    this.projectListView.addProjectButton.addEventListener('click', () => {
      this.showAddProjectModal();
      document.getElementById('project-title')?.focus();
    });

    this.projectListView.setDeleteProjectButtonFunction(this.showDeleteProjectModal.bind(this));
    this.projectListView.setEditProjectButtonFunction(this.showEditProjectModal.bind(this));
  }

  setRefreshTodoListViewFunction(refreshTodoListViewFunction: () => void) {
    this.refreshTodoListView = refreshTodoListViewFunction;
  }

  showAddProjectModal() {
    const modal = new TodoViews.ProjectModalView(this.todoList).createViewElement(
      'Add project',
      'Add',
      (project: TodoModels.Project) => {
        this.addProject(project);
        this.refreshProjectListView();
        modal.remove();
      }, 
      this.validAddProjectTitle.bind(this),
      '* Cannot add a project with the same name as an existing project or be blank.'
    );
    document.querySelector('.container')?.prepend(modal);
  }

  showProjectList(): HTMLElement {
    return this.projectListView.createViewElement(
      this.projectListModel, 
      this.refreshProjectListView.bind(this),
      this.refreshTodoListView!
      );
  }

  showTimeProjectList(): HTMLElement {
    return this.projectListView.createTimeViewElement(
      this.todoList,
      this.refreshProjectListView.bind(this),
      this.refreshTodoListView!
    )
  }

  refreshProjectListView() {
    const projectList = document.querySelector('.project-list > .menu-list');
    projectList?.remove();

    const projectMenuList = document.querySelector('.project-list');
    projectMenuList?.appendChild(this.showProjectList());

    // Show upper, time project headings
    const timeProjectList = document.querySelector('.time-based-list > .menu-list');
    timeProjectList?.remove();

    const timeProjectMenuList = document.querySelector('.time-based-list');
    timeProjectMenuList?.appendChild(this.showTimeProjectList());
    Misc.setLocalStorage('TodoList', this.todoList);
    Misc.setLocalStorage('ProjectList', this.projectListModel);
  }

  addProject(project: TodoModels.Project) {
    this.projectListModel.addProject(project);
    Misc.setLocalStorage('ProjectList', this.projectListModel);
  }

  editProject(projectName: string, newProjectName: string) {
    const project = this.projectListModel.projects[this.projectListModel.getIndexOfProjectName(projectName)];
    project.title = newProjectName;
    
    // Change each todoitem
    this.todoList.todoList.forEach(item => {
      if (item.project === projectName) {
        item.project = newProjectName;
      }
    });
    this.projectListView.updateActiveProject(newProjectName);
    Misc.setLocalStorage('ProjectList', this.projectListModel);
  }

  showEditProjectModal(projectName: string | undefined) {
    const editProjectModal = new TodoViews.ProjectModalView(this.todoList).createViewElement(
      'Edit project name',
      'Save',
      (project: TodoModels.Project) => {
        this.editProject(projectName!, project.title);
        this.refreshProjectListView();
        this.refreshTodoListView!();
        editProjectModal.remove();
      },
      this.validAddProjectTitle.bind(this),
      '* Cannot rename with the same name as an existing project or be blank.'
    );
    document.querySelector('.container')?.prepend(editProjectModal);
  }

  showDeleteProjectModal() {
    const deleteProjectModal = new TodoViews.ConfirmModal().createViewElement(
      this.projectListView.active,
      this.todoList,
      this.deleteProject.bind(this)
    );
    document.querySelector('.container')?.prepend(deleteProjectModal);
  }

  deleteProject(projectName: string) {
    this.projectListModel.removeProjectByName(projectName);
    this.projectListView.updateActiveProject('Default');
    this.todoList.removeAllWithProjectName(projectName);
    this.refreshProjectListView();
    this.refreshTodoListView!();
    Misc.setLocalStorage('ProjectList', this.projectListModel);
  }

  validAddProjectTitle(newProjectTitle: string): boolean {
    const invalidTitles = ['', 'Today', 'This week', 'Next week'];
    if (invalidTitles.includes(newProjectTitle)) {
      return false;
    }
    return !DOMManipulation.getProjectTitles(this.projectListModel).includes(newProjectTitle);
  }

}

export { TodoItemController, TodoListController, ProjectListController } 