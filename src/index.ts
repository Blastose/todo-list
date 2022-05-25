import './style.css';
import * as TodoModels from './todo-models';
import * as TodoViews from './todo-views';
import * as TodoControllers from './todo-controllers';
import { v4 as uuidv4 } from 'uuid'

const list = new TodoModels.TodoList();
for (let i = 0; i < 10; i++) {
  const item = new TodoModels.TodoItem(`${i}`, 'This is my todo item', new Date(), TodoModels.Priority.none, false, uuidv4(), 'Old Project');
  const item2 = new TodoModels.TodoItem(`${i}-${i}`, 'MY todo item', new Date(), TodoModels.Priority.medium, false, uuidv4(), 'My Project');
  list.add(item);
  list.add(item2);
}

const deletedItemsList = new TodoModels.TodoList();

const project = new TodoModels.Project('New Project item', list);
const projectList = new TodoModels.ProjectList([new TodoModels.Project('Default', list), project, new TodoModels.Project('Old Project', list), new TodoModels.Project('My Project', list)]);
const projectListView = new TodoViews.ProjectListView();
const projectListController = new TodoControllers.ProjectListController(projectList, projectListView, list);
projectListController.addProject(new TodoModels.Project('New Project', list));

const listView = new TodoViews.TodoListView();
const todoListController = new TodoControllers.TodoListController(list, listView, projectList, projectListView, deletedItemsList);
todoListController.setRefreshTodoListViewFunction(projectListController.refreshProjectListView.bind(projectListController));
todoListController.refreshView();

projectListController.setRefreshTodoListViewFunction(todoListController.refreshView.bind(todoListController));
projectListController.refreshProjectListView();
