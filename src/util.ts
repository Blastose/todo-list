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
    form.reset();

    return new TodoModels.TodoItem(title, description, date ? new Date(date) : new Date(), TodoModels.Priority.none, false, uuidv4(), project);
  }

}

export { DOMManipulation }