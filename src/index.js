import './styles/main.scss';
import router from './js/router.js';
import { removeOld } from './js/functions';

router.resolve();

function importAll(r) {
  return r.keys().map(r);
}
const images = importAll(require.context('./images/', false, /\.(png|jpe?g|svg)$/));

[...document.querySelectorAll('a')].map(el => {
  el.addEventListener('click', e => {
    const href = e.currentTarget.getAttribute('href');
    if (!href.startsWith('http') && !href.startsWith('www')) {
      e.preventDefault();
      router.navigate(href.substr(1));
      removeOld();
    }
  });
});
