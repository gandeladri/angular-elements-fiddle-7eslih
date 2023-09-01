export class NativeCustomElement extends HTMLElement {

  constructor() {
    super();
  }

  static get observedAttributes() { return ["name"] }

  get name() {
    return this.getAttribute("name");
  }

  set name(val) {
    this.setAttribute("name", val);
  }

  connectedCallback() {
    console.log("element added");
  }

  disconnectedCallback() {
    console.log("element removed");
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log("attribute changed");
  }

}