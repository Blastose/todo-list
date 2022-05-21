import './style.css'
import * as TodoModels from './todo-models'
import * as TodoViews from './todo-views'


const item = new TodoModels.TodoItem('My todo item', 'This is my todo item', new Date(), TodoModels.Priority.none, false);
const view = new TodoViews.TodoItemView(item);
const list = new TodoModels.TodoList();
for (let i = 0; i < 10; i++) {
  const i = new TodoModels.TodoItem('My todo item', 'This is my todo item', new Date(), TodoModels.Priority.none, false);
  list.add(i);
}
const listView = new TodoViews.TodoListView(list);

const container = document.querySelector('.main-todo-items');
container?.appendChild(view.createViewElement());

const main = document.querySelector('.main-content');
main?.appendChild(listView.createViewElement());