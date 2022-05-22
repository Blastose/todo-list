import * as TodoModels from './todo-models';
import * as TodoViews from './todo-views';

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
    return this.todoListView.createViewElement(this.todoListModel, this.removeListItemAndRefreshView.bind(this));
  }

  // Create a separate function instead of using an arrow function
  // because I couldn't get the arrow function to work
  removeListItemAndRefreshView(index: number) {
    this.removeListItem(index);
    this.refreshView();
  }

  removeListItem(index: number) {
    this.todoListModel.remove(index);
  }

  refreshView() {
    const todoItems = document.querySelectorAll('.main-todo-items')!;
    todoItems.forEach(item => item.remove());

    const mainContent = document.querySelector('.main-content')!;
    mainContent.appendChild(this.showList());
  }
}

export { TodoItemController, TodoListController } 