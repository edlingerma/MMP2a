import template from './list.hbs';
import barData from '../../js/bars-data'
import barsData from '../../js/bars-data';

export default class ListPage {
    constructor(root) {
      console.log('It\'s an Index!');
      this.root = root;
      this.template = template;
    }
    render() {
      this.root.innerHTML = this.template({ heading: 'Nearby Bars', barData: barsData });
    }
}