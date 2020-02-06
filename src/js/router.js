import Navigo from 'navigo';

import IndexPage from '../pages/Index';
import NotFoundPage from '../pages/NotFound';
import MapPage from '../pages/Map';
import ProfilePage from '../pages/Profile';
import ListPage from '../pages/List';
import BarPage from '../pages/Bar';

import barData from '../js/bars-data';

const navigoRoot = window.location.origin;
const router = new Navigo(navigoRoot, true);
const root = document.querySelector('#layout');

router.notFound(() => {
  const notFound = new NotFoundPage(root);
  notFound.render();
});

router
  .on(
    {
      '/': function () {
        const index = new IndexPage(root);
        index.render();
      },
      'not-there': function () {
        const notFound = new NotFoundPage(root);
        notFound.render();
      },
      'map': function () {
        let mapll = new MapPage(root);
        mapll.render();
        let map = mapll.mymap;
        mapll.getUserLocation(map);
        mapll.setMarker(map);
      },
      'profile': function () {
        const profile = new ProfilePage(root);
        profile.render();
      },
      'bars': function () {
        const barList = new ListPage(root);
        barList.render();
      },
      ':id': (params) => {
        const barT = new BarPage(root);
        barT.render(barData, params, barT);
      },
    },
  );


export default router;
