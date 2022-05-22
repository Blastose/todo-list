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