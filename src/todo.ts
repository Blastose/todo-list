enum Priority {
  none,
  low,
  medium,
  high,
}

class TodoItem {
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  completed: boolean;
    
  constructor(title: string, description: string, dueDate: Date, priority: Priority, completed: boolean) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = completed;
  }
}

class TodoList {
  todoList: TodoItem[];

  constructor(todoList: TodoItem[]) {
    this.todoList = todoList;
  }
}

class Project {
  title: string;
  todoList: TodoList;

  constructor(title: string, todoList: TodoList) {
    this.title = title;
    this.todoList = todoList;
  }
}

class ProjectList {
  projects: Project[];

  constructor(projects: Project[]) {
    this.projects = projects;
  }
}

export { Priority, TodoItem, TodoList, Project, ProjectList }