import * as TodoModels from '../../src/todo-models';

test('Create Todo Item', () => {
  const todoItem = new TodoModels.TodoItem('Clean dishes', 'Clean the dishes with soup', new Date(), TodoModels.Priority.high, false, 'id', 'Project');
  expect(todoItem.title).toBe('Clean dishes');
});