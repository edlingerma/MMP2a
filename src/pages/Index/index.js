import template from './index.hbs';
import logo from '../../images/logo.svg'

export default class IndexPage {
    constructor(root) {
      console.log('It\'s an Index!');
      this.root = root;
      this.template = template;
    }
  
    render() {
      this.root.innerHTML = this.template({ heading: 'Welcome', logo });
    }
}