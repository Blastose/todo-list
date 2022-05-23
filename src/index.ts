import './style.css';
import * as TodoModels from './todo-models';
import * as TodoViews from './todo-views';
import * as TodoControllers from './todo-controllers';
import { v4 as uuidv4 } from 'uuid'

const list = new TodoModels.TodoList();
for (let i = 0; i < 10; i++) {
  const item = new TodoModels.TodoItem(`${i}`, 'This is my todo item', new Date(), TodoModels.Priority.none, false, uuidv4(), 'Old Project');
  list.add(item);
}

const listView = new TodoViews.TodoListView();
const todoListController = new TodoControllers.TodoListController(list, listView);
todoListController.refreshView();

const project = new TodoModels.Project('New Project item', list);
const projectList = new TodoModels.ProjectList([project, new TodoModels.Project('Old Project', list), new TodoModels.Project('My Project', list)]);
const projectListView = new TodoViews.ProjectListView();
const projectListController = new TodoControllers.ProjectListController(projectList, projectListView);
projectListController.addProject(new TodoModels.Project('New Project', list));
projectListController.refreshProjectList();

const projectModal = new TodoViews.ProjectModalView();
document.querySelector('.container')?.prepend(projectModal.createViewElement());