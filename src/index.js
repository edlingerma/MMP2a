import './styles/main.scss';
import router from './js/router.js';

router.resolve();

[...document.querySelectorAll('a')].map((el) => {
  el.addEventListener('click', (e) => {
    const href = e.currentTarget.getAttribute('href');
    if (!href.startsWith('http') && !href.startsWith('www')) {
      e.preventDefault();
      router.navigate(href.substr(1));
    }
  });
});