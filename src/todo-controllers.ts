import * as TodoModels from './todo-models';
import * as TodoViews from './todo-views';
import { DOMManipulation } from './util';
import { v4 as uuidv4 } from 'uuid'

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
  addItemModal: HTMLElement;
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

    this.addItemModal = new TodoViews.TodoItemFormModalView().createViewElement(
      DOMManipulation.getProjectTitles(this.projectListModel), 
      (todoItem: TodoModels.TodoItem) => {
        this.addListItem(todoItem);
        this.addItemModal.remove();
      }
    );

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
      this.projectListView.active
      );
  }

  updateModal() {
    this.addItemModal = new TodoViews.TodoItemFormModalView().createViewElement(
      DOMManipulation.getProjectTitles(this.projectListModel), 
      (todoItem: TodoModels.TodoItem) => {
        this.addListItem(todoItem);
        this.addItemModal.remove();
      }
    );
  }

  showModal() {
    this.updateModal();
    document.querySelector('.container')?.prepend(this.addItemModal);
    document.getElementById('todo-item-title')?.focus();
  }

  showUndoDeleteModal() {
    document.querySelector('.container')?.prepend(this.undoDeletionModal.createViewElement());
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
  }

  removeListItemById(id: string) {
    const item = this.todoListModel.removeById(id);
    if (item) {
      this.deletedTodoListModel.add(item);
    }
  }

  addListItem(item: TodoModels.TodoItem) {
    this.todoListModel.add(item);
    this.refreshView();
    this.refreshProjectListView!();
  }

  undoItemDeletion() {
    const deletedItem = this.deletedTodoListModel.pop();
    if (deletedItem) {
      this.todoListModel.add(deletedItem);
      console.log(deletedItem);
    }
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
  modal: HTMLElement;
  refreshTodoListView: (() => void) | undefined;

  constructor(projectListModel: TodoModels.ProjectList, projectListView: TodoViews.ProjectListView, todoList: TodoModels.TodoList) {
    this.projectListModel = projectListModel;
    this.projectListView = projectListView;
    this.modal = new TodoViews.ProjectModalView(todoList).createViewElement(
      (project: TodoModels.Project) => {
      this.addProject(project);
      this.refreshProjectListView();
      this.modal.remove();
    });

    this.projectListView.addProjectButton.addEventListener('click', () => {
      document.querySelector('.container')?.prepend(this.modal);
      document.getElementById('project-title')?.focus();
    });
  }

  setRefreshTodoListViewFunction(refreshTodoListViewFunction: () => void) {
    this.refreshTodoListView = refreshTodoListViewFunction;
  }

  showProjectList(): HTMLElement {
    return this.projectListView.createViewElement(
      this.projectListModel, 
      this.refreshProjectListView.bind(this),
      this.refreshTodoListView!
      );
  }

  refreshProjectListView() {
    const projectList = document.querySelector('.project-list > .menu-list');
    projectList?.remove();

    const projectMenuList = document.querySelector('.project-list');
    projectMenuList?.appendChild(this.showProjectList());
  }

  addProject(project: TodoModels.Project) {
    this.projectListModel.addProject(project);
  }

  deleteProject() {

  }

}

export { TodoItemController, TodoListController, ProjectListController } 