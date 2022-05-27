import './style.css';
import * as TodoModels from './todo-models';
import * as TodoViews from './todo-views';
import * as TodoControllers from './todo-controllers';
import { Misc } from './util';

const list = new TodoModels.TodoList();
const deletedItemsList = new TodoModels.TodoList();

const projectList = new TodoModels.ProjectList();
const projectListView = new TodoViews.ProjectListView();
const projectListController = new TodoControllers.ProjectListController(projectList, projectListView, list);

Misc.populateTodoListFromLocalStorage('TodoList', list);
if (Misc.populateProjectListFromLocalStorage('ProjectList', projectList, list) === -1) {
  projectList.addProject(new TodoModels.Project('Default', list));
}

const listView = new TodoViews.TodoListView();
const todoListController = new TodoControllers.TodoListController(list, listView, projectList, projectListView, deletedItemsList);
todoListController.setRefreshTodoListViewFunction(projectListController.refreshProjectListView.bind(projectListController));
todoListController.refreshView();

projectListController.setRefreshTodoListViewFunction(todoListController.refreshView.bind(todoListController));
projectListController.refreshProjectListView();
projectListController.projectListView.setProjectMainTitle('Default');
