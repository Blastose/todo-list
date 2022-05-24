import * as TodoModels from './todo-models';
import * as TodoViews from './todo-views';
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

  constructor(todoListModel: TodoModels.TodoList, todoListView: TodoViews.TodoListView) {
    this.todoListModel = todoListModel;
    this.todoListView = todoListView;
  }

  showList() {
    return this.todoListView.createViewElement(
      this.todoListModel,
      this.removeListItemAndRefreshView.bind(this),
      this.addListItem.bind(this));
  }

  // Create a separate function instead of using an arrow function
  // because I couldn't get the arrow function to work
  removeListItemAndRefreshView(id: string) {
    this.removeListItemById(id);
    this.refreshView();
  }

  removeListItem(index: number) {
    this.todoListModel.remove(index);
  }

  removeListItemById(id: string) {
    this.todoListModel.removeById(id);
  }

  addListItem(item: TodoModels.TodoItem) {
    this.todoListModel.add(item);
    this.refreshView();
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

  constructor(projectListModel: TodoModels.ProjectList, projectListView: TodoViews.ProjectListView, todoList: TodoModels.TodoList) {
    this.projectListModel = projectListModel;
    this.projectListView = projectListView;
    this.modal = new TodoViews.ProjectModalView(todoList).createViewElement(
      (e: TodoModels.Project) => {
      this.addProject(e);
      this.refreshProjectListView();
      this.modal.remove();
    });

    this.projectListView.addProjectButton.addEventListener('click', () => {
      document.querySelector('.container')?.prepend(this.modal);
      document.getElementById('project-title')?.focus();
    });
  }

  showProjectList(): HTMLElement {
    return this.projectListView.createViewElement(this.projectListModel);
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