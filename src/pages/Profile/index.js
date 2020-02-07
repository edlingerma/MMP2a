import barsData from '../../js/bars-data';
import challs from '../../js/challenges';
import { loadUser } from '../../js/user';
import { markHeaderLink } from '../../js/functions';

import template from './profile.hbs';

const user = loadUser();

export default class IndexPage {
  constructor(root) {
    console.log("It's You!");
    this.root = root;
    this.template = template;
  }
  listChallenges(bar) {
    let list = document.querySelector(`#list${bar.barID}`);
    let listEls = list.querySelectorAll('li');
    if (bar.doneChallenges.length == 0) {
      list.parentNode.querySelector('.barcont__label__img').classList.add('no-style');
    }
    let i = 0;
    bar.doneChallenges.reverse().forEach(chall => {
      let info = challs.find(ch => ch.id == chall);
      listEls[i].querySelector('.yourchalls__challs--description').innerHTML = info.challenge;
      listEls[i].querySelector('.yourchalls__challs--score').innerHTML = `+${info.points} Points`;
      i++;
    });
  }
  listBars() {
    let isfirst = true;
    user.barsVisited.map(bar => {
      let listEl = document.querySelector(`#bar${bar.barID}`);
      const info = barsData.find(b => b.id == bar.barID);
      listEl.querySelector('label').setAttribute('for', `challs${bar.barID}`);
      let inp = listEl.querySelector('input');
      inp.setAttribute('id', `challs${bar.barID}`);
      listEl.querySelector('h3').innerHTML = info.name;
      listEl.querySelector('p').innerHTML = `+${bar.score} Points`;
      inp.addEventListener('change', e => {
        if (e.target.checked) {
          listEl.classList.add('yourbars__bartag--open');
          listEl.querySelector('p').innerHTML = `+5 Points`;
        } else {
          listEl.classList.remove('yourbars__bartag--open');
          listEl.querySelector('p').innerHTML = `+${bar.score} Points`;
        }
      });
      if (isfirst) {
        console.log('TRIGGERED');
        inp.checked = true;
        listEl.classList.add('yourbars__bartag--open');
        isfirst = false;
      }
      this.listChallenges(bar);
    });
  }
  render() {
    this.root.innerHTML = this.template({ heading: 'Score:', user });
    this.listBars();
    markHeaderLink('profile');
  }
}
