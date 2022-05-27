import * as TodoModels from './todo-models';
import { v4 as uuidv4 } from 'uuid'
import { parseISO } from 'date-fns';

class DOMManipulation {
  static createElementWithClass(elementName: string, className: string): HTMLElement {
    const element = document.createElement(elementName);
    element.classList.add(className);
    return element;
  }

  static createFormInput(inputType: string, id: string, className: string, labelText: string): [HTMLLabelElement, HTMLInputElement] {
    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = labelText;
    
    const input = document.createElement('input');
    input.setAttribute('type', inputType);
    input.setAttribute('id', id);
    input.setAttribute('class', className);

    return [label, input];
  }
  
  static selectInputMaker(labelText: string, selectName: string, selectId: string, selectOptions: string[]) {
    const label = document.createElement('label');
    label.setAttribute('for', selectId);
    label.textContent = labelText;
    const select = document.createElement('select');
    select.setAttribute('name', selectName);
    select.setAttribute('id', selectId);
    selectOptions.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.setAttribute('value', option);
      optionElement.textContent = option;
      select.appendChild(optionElement);
    });

    return [label, select];
  }

  static extractTodoItemFormValues(form: HTMLFormElement) {
    const title = (form.querySelector('#todo-item-title') as HTMLInputElement).value;
    const description = (form.querySelector('#todo-item-description') as HTMLInputElement).value;
    const date = (form.querySelector('#todo-item-date') as HTMLInputElement).value;
    const select = (form.querySelector('#project-list') as HTMLSelectElement);
    const project = select.options[select.selectedIndex].value;
    const selectPrio = (form.querySelector('#priority-list') as HTMLSelectElement);
    const priority = selectPrio.options[selectPrio.selectedIndex].value;
    form.reset();

    // Need to use keyof typeof 'Enum' to work with --noImplicitAny
    return new TodoModels.TodoItem(title, description, date ? Misc.getDateFromDateInputString(date) : new Date(), TodoModels.Priority[priority as keyof typeof TodoModels.Priority], false, uuidv4(), project);
  }

  static getProjectTitles(projectList: TodoModels.ProjectList): string[] {
    return projectList.projects.map(project => {
      return project.title;
    });
  }

  static selectOption(selectElement: HTMLElement, optionToSelect: string) {
    selectElement.childNodes.forEach(child => {
      if ((child as HTMLOptionElement).value === optionToSelect) {
        (child as HTMLOptionElement).selected = true;
      }
    });
  }
}

class Misc{
  static parseDateInput(date: string) {
    return date.split('-');
  }

  static getDateFromDateInputString(date: string) {
    const parsedDate = this.parseDateInput(date);
    const d = new Date();
    d.setFullYear(Number(parsedDate[0]));
    d.setMonth(Number(parsedDate[1]) - 1);
    d.setDate(Number(parsedDate[2]));
    return d;
  }

  static populateTodoListFromLocalStorage(storageListKey: string, list: TodoModels.TodoList) {
    const storageList = JSON.parse(localStorage.getItem(storageListKey)!);
    console.log(storageList);
    if (storageList) {
      const storageListArray  = (storageList.todoList as TodoModels.TodoItem[]);
      storageListArray.forEach(item => {
        const newItem = new TodoModels.TodoItem(item.title, item.description, parseISO(item.dueDate as unknown as string), item.priority, item.completed, item.id, item.project);
        list.add(newItem);
      });
      return 0;
    }
    return -1;
  }

  static populateProjectListFromLocalStorage(storageListKey: string, list: TodoModels.ProjectList, todoList: TodoModels.TodoList) {
    const storageList = JSON.parse(localStorage.getItem(storageListKey)!);
    console.log(storageList);
    if (storageList) {
      const storageListArray  = (storageList.projects as TodoModels.Project[]);
      storageListArray.forEach(item => {
        const newItem = new TodoModels.Project(item.title, todoList);
        list.addProject(newItem);
      });
      return 0;
    }
    return -1;
  }

  static setLocalStorage(key: string, object: any) {
    localStorage.setItem(key, JSON.stringify(object));
  }
}

export { DOMManipulation, Misc }