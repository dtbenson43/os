class TestApp extends HTMLElement {
  constructor(...args) {
    const self = super(...args);
    this.innerText = 'wow';
    return self;
  }
}

customElements.define("test-app", TestApp);

export default TestApp