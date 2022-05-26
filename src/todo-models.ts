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
    const item = this.todoList[index];
    this.todoList.splice(index, 1);
    return item;
  }

  removeById(id: string) {
    const foundIndex = this.getIndexOfId(id);
    if (foundIndex !== -1) {
      return this.remove(foundIndex);
    }
  }

  removeAllWithProjectName(projectName: string) {
    let index = this.getIndexOfProjectName(projectName);
    while (index !== -1) {
      this.remove(index);
      index = this.getIndexOfProjectName(projectName);
    }
  }

  pop() {
    return this.todoList.pop();
  }

  update(index: number, todoItem: TodoItem) {
    this.todoList.splice(index, 1, todoItem);
  }

  getIndexOfId(id: string) {
    return this.todoList.findIndex((item) => {
      return item.id === id;
    });
  }

  getIndexOfProjectName(projectName: string) {
    return this.todoList.findIndex((item) => {
      return item.project === projectName;
    })
  }

  count(projectName: string) {
    let count = 0;
    this.todoList.forEach(item => {
      if (item.project === projectName) {
        count += 1;
      }
    });
    return count;
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
      if (item.project === this.title && !item.completed) {
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

  removeProject(index: number) {
    const item = this.projects[index];
    this.projects.splice(index, 1);
    return item;
  }

  removeProjectByName(projectName: string) {
    const foundIndex = this.getIndexOfProjectName(projectName);
    if (foundIndex !== -1) {
      return this.removeProject(foundIndex);
    }
  }
  
  getIndexOfProjectName(projectName: string) {
    return this.projects.findIndex((item) => {
      return item.title === projectName;
    });
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