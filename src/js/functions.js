import halfStar from '../images/star_h.svg';
import fullStar from '../images/star_1.svg';
import bar from '../images/bar.svg';
import beerbar from '../images/beerbar.svg';
import cocktailbar from '../images/cocktailbar.svg';
import irishpub from '../images/irishpub.svg';
import lounges from '../images/lounges.svg';
import pub from '../images/pub.svg';
import winebar from '../images/winebar.svg';

export function rateMe(barTag, rating) {
  let list = barTag.querySelector('.rating');
  list.setAttribute('aria-label', `${ rating } out of five stars`)
  let half = rating % 1; // = 0.5 OR 0
  let whole = rating - half; // = 3 OR 4
  let empty = 5 - rating - half; //

  for (let i = 0; i < whole; i++) {
    list.children[i].setAttribute('src', fullStar);
  }
  if (half > 0) {
    list.children[whole].setAttribute('src', halfStar);
  }
  let sometry = 5;

  console.log(eval('sometry'));
}

export function withIcon(barTag, type) {
  let cont = barTag.querySelector('.bar__div__type');
  type = type.toLowerCase().replace(/\s/g, '');
  let img = barTag.querySelector('.bar__div__type__icon');
  switch (type) {
    case 'bar':
      img.setAttribute('src', bar);
      img.setAttribute('alt', `Icon for type: ${type}`);
      break;
    case 'beerbar':
      img.setAttribute('src', beerbar);
      img.setAttribute('alt', `Icon for type: ${type}`);
      break;
    case 'cocktailbar':
      img.setAttribute('src', cocktailbar);
      img.setAttribute('alt', `Icon for type: ${type}`);
      break;
    case 'irishpub':
      img.setAttribute('src', irishpub);
      img.setAttribute('alt', `Icon for type: ${type}`);
      break;
    case 'lounges':
      img.setAttribute('src', lounges);
      img.setAttribute('alt', `Icon for type: ${type}`);
      break;
    case 'pub':
      img.setAttribute('src', pub);
      img.setAttribute('alt', `Icon for type: ${type}`);
      break;
    case 'winebar':
      img.setAttribute('src', winebar);
      img.setAttribute('alt', `Icon for type: ${type}`);
      break;

    default:
  }
}

export function markHeaderLink(href) {
  removeOld();
  document.querySelector(`#${href}-link`).classList.add('selected');
}

export function removeOld() {
  let oldLink = document.querySelector('.selected');
  if (oldLink != null) {
    oldLink.classList.remove('selected');
  }
}
