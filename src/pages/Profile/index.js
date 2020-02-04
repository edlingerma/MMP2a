import template from './profile.hbs';

export default class IndexPage {
    constructor(root) {
      console.log('It\'s You!');
      this.root = root;
      this.template = template;
    }
  
    render() {
      this.root.innerHTML = this.template({ heading: 'Profile' });
    }
}