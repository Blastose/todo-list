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
  id: string;
  project: string;
    
  constructor(title: string, description: string, dueDate: Date, priority: Priority, completed: boolean, id: string, project: string) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = completed;
    this.id = id;
    this.project = project;
  }
}

class TodoList {
  todoList: TodoItem[];

  constructor(todoList?: TodoItem[]) {
    if (todoList) {
      this.todoList = todoList;
    } else {
      this.todoList = [] as TodoItem[];
    }
  }

  add(todoItem: TodoItem) {
    this.todoList.push(todoItem);
  }

  remove(index: number) {
    console.log(this);
    console.log(this.todoList[index]);
    this.todoList.splice(index, 1);
  }

  removeById(id: string) {
    let foundIndex = -1;
    // Can use Array.prototype.findIndex() instead
    for (let i = 0; i < this.todoList.length; i++) {
      if (this.todoList[i].id === id) {
        foundIndex = i;
        break;
      }
    };
    if (foundIndex !== -1) {
      this.remove(foundIndex);
    }
  }

  update(index: number, todoItem: TodoItem) {
    this.todoList.splice(index, 1, todoItem);
  }

}

class Project {
  title: string;
  todoList: TodoList;

  constructor(title: string, todoList: TodoList) {
    this.title = title;
    this.todoList = todoList;
  }

  getCount() {
    let count = 0;
    this.todoList.todoList.forEach((item) => {
      if (item.project === this.title) {
        count += 1;
      }
    });
    return count;
  }

}

class ProjectList {
  projects: Project[];

  constructor(projects: Project[]) {
    this.projects = projects;
  }

  addProject(project: Project) {
    this.projects.push(project);
  }
}

class FormItem {
  formLabel?: HTMLLabelElement;
  formInput: HTMLInputElement;

  constructor(formInput: HTMLInputElement, formLabel?: HTMLLabelElement, ) {
    this.formInput = formInput;
    this.formLabel = formLabel;
  }
}

export { Priority, TodoItem, TodoList, Project, ProjectList, FormItem }