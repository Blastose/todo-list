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
    this.todoListView.createViewElement(this.todoListModel);
  }
}