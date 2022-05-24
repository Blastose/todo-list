class DOMManipulation {
  static createElementWithClass(elementName: string, className: string): HTMLElement {
    const element = document.createElement(elementName);
    element.classList.add(className);
    return element;
  }

  static createFormInput(inputType: string, id: string, className: string, labelText: string): HTMLElement[] {
    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = labelText;
    
    const input = document.createElement('input');
    input.setAttribute('type', inputType);
    input.setAttribute('id', id);
    input.setAttribute('class', className);
    input.setAttribute('required', '');

    return [label, input];
  }

}

export { DOMManipulation }