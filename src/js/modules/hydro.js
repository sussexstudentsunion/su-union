import React from 'react';
import ReactDOM from 'react-dom';

export default function() {
  const componentMap = {
    ContentAPIComposer: () => import('@ussu/components/ContentAPIComposer'),
    TweetList: () =>
      import(/* webpackChunkName: "TweetList" */ '@ussu/components/TweetList'),
    EventsContainer: () =>
      import(/* webpackChunkName: "EventsPage" */ '@ussu/components/EventsCalender'),
    HeaderSearch: () =>
      import(/* webpackChunkName: "HeaderSearch" */ '@ussu/components/HeaderSearch'),
    HeadingHero: () =>
      import(/* webpackChunkName: "HeadingHero" */ '@ussu/components/HeadingHero'),
    FigureCollection: () =>
      import(/* webpackChunkName: "FigureCollection" */ '@ussu/components/FigureCollection'),
    StudentGroupsDiscoveryContainer: () =>
      import(/* webpackChunkName: "StudentGroupsDiscovery" */ '@ussu/components/StudentGroupsDiscovery'),
    Header: () =>
      import(/* webpackChunkName: "Header" */ '@ussu/components/Header'),
    UserBar: () =>
      import(/* webpackChunkName: "UserBar" */ '@ussu/components/UserBar'),
  };

  [...document.querySelectorAll('.Hydro')].forEach(el => {
    let props = {};
    if (el.hasAttribute('data-id')) {
      props = window[`HYDROSTATE_${el.getAttribute('data-id')}`];
    }

    const componentName = el.getAttribute('data-component');
    const getComponent = componentMap[componentName];

    if (!Object.hasOwnProperty.call(componentMap, componentName)) {
      console.warn(
        `[hydro] ${componentName} should have been rendered, but isn't in the component map!`
      );
      return;
    }

    getComponent().then(component => component.default).then(Component => {
      ReactDOM.render(<Component {...props} />, el);
    });
  });
}
