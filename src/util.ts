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

}

export { DOMManipulation }