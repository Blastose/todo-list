import './style.css'
import * as TodoModels from './todo-models'
import * as TodoViews from './todo-views'


const item = new TodoModels.TodoItem('My todo item', 'This is my todo item', new Date(), TodoModels.Priority.none, false);
const view = new TodoViews.TodoItemView(item);

const container = document.querySelector('.main-todo-items');
container?.appendChild(view.createViewElement());
