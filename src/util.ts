import * as TodoModels from './todo-models';
import { v4 as uuidv4 } from 'uuid'

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
    return new TodoModels.TodoItem(title, description, date ? this.getDateFromDateInputString(date) : new Date(), TodoModels.Priority[priority as keyof typeof TodoModels.Priority], false, uuidv4(), project);
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

}

export { DOMManipulation }