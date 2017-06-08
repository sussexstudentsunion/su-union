import React from 'react';
import ReactDOM from 'react-dom';

export default function() {
  const componentMap = {
    ContentAPIComposer: () => import('@ussu/components/ContentAPIComposer'),
    TweetList: () =>
      import(/* webpackChunkName: "TweetList" */ '@ussu/components/TweetList'),
  };

  [...document.querySelectorAll('.Hydro')].forEach(el => {
    const props = window[`HYDROSTATE_${el.dataset.id}`];
    const componentName = el.dataset.component;
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