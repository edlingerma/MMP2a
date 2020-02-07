import template from './notFound.hbs';

export default class NotFoundPage {
  constructor(root) {
    console.log("It ain't there!");
    this.root = root;
    this.template = template;
  }

  render() {
    this.root.innerHTML = this.template({ heading: '404 Not Found!' });
  }
}
