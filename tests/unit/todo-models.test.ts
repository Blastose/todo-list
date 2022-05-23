import * as TodoModels from '../../src/todo-models';

test('Create Todo Item', () => {
  const todoItem = new TodoModels.TodoItem('Clean dishes', 'Clean the dishes with soup', new Date(), TodoModels.Priority.high, false, 'id', 'Project');
  expect(todoItem.title).toBe('Clean dishes');
});

test('Project count', () => {
  const project = new TodoModels.Project('Project', new TodoModels.TodoList());
  project.todoList.add(new TodoModels.TodoItem('Clean dishes', 'Clean the dishes with soup', new Date(), TodoModels.Priority.high, false, 'id', 'Project'));
  project.todoList.add(new TodoModels.TodoItem('Clean dishes', 'Clean the dishes with soup', new Date(), TodoModels.Priority.high, false, 'id', 'Project'));
  project.todoList.add(new TodoModels.TodoItem('Clean dishes', 'Clean the dishes with soup', new Date(), TodoModels.Priority.high, false, 'id', 'Project2'));

  expect(project.getCount()).toBe(2);
});