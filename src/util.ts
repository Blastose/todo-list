class DOMManipulation {
  static createElementWithClass(elementName: string, className: string): HTMLElement {
    const element = document.createElement(elementName);
    element.classList.add(className);
    return element;
  }
}

export { DOMManipulation }