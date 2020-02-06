import template from './list.hbs';
import barsData from '../../js/bars-data';
import { rateMe, withIcon, markHeaderLink } from '../../js/functions';

export default class ListPage {
    constructor(root) {
      console.log('It\'s a List!');
      this.root = root;
      this.template = template;
    }
    setRating() {
      barsData.map(data => {
        let parentEl = document.querySelector(`a[href="./#/${data.id}"]`);
        rateMe(parentEl, data.rating);
        withIcon(parentEl, data.type);
      })
    }
    render() {
      this.root.innerHTML = this.template({ heading: 'Nearby Bars', barsData });
      markHeaderLink('bars');
      this.setRating();
    }
}
