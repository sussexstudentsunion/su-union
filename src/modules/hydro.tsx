import React from 'react';
import ReactDOM from 'react-dom';
import isFunction from 'lodash/isFunction';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import getApolloClientForFalmer from '../libs/getApolloClientForFalmer';
import ScrollToTop from '../components/ScrollToTop';

interface ComponentMap {
  [componentName: string]: () => Promise<any>;
}

export default function() {
  const componentMap: ComponentMap = {
    ContentAPIComposer: () => import('~components/ContentAPIComposer'),
    TweetList: () =>
      import(/* webpackChunkName: "TweetList" */ '~components/TweetList'),
    EventList: () =>
      import(/* webpackChunkName: "EventList" */ '~components/EventList'),
    EventsApplication: () =>
      import(/* webpackChunkName: "EventsPage" */ '~components/EventsApplication'),
    HeaderSearch: () =>
      import(/* webpackChunkName: "HeaderSearch" */ '~components/HeaderSearch'),
    HeadingHero: () =>
      import(/* webpackChunkName: "HeadingHero" */ '~components/HeadingHero'),
    FigureCollection: () =>
      import(/* webpackChunkName: "FigureCollection" */ '~components/FigureCollection'),
    StudentGroupsDiscoveryContainer: () =>
      import(/* webpackChunkName: "StudentGroupsDiscovery" */ '~components/StudentGroupsDiscovery'),
    Header: () => import(/* webpackChunkName: "Header" */ '~components/Header'),
    UserBar: () =>
      import(/* webpackChunkName: "UserBar" */ '~components/UserBar').then(
        module => module.DesktopUserBar
      ),
    AnnualPlan: () =>
      import(/* webpackChunkName: "AnnualPlan" */ '~components/AnnualPlan'),
    PolicyGenerator: () =>
      import(/* webpackChunkName: "PolicyGenerator" */ '~components/PolicyGenerator'),
  };

  Array.from(document.querySelectorAll('.Hydro')).forEach(el => {
    let props = {};
    if (el.hasAttribute('data-id')) {
      const hydroKey = el.getAttribute('data-id');
      props = (window as any)[`HYDROSTATE_${hydroKey}`];
      const scriptElement = document.querySelector(`#hydroscript-${hydroKey}`);
      if (scriptElement) {
        scriptElement.remove();
      }
    }

    console.log(el);

    const componentName = el.getAttribute('data-component');

    if (componentName === null) {
      return;
    }

    if (!Object.hasOwnProperty.call(componentMap, componentName)) {
      console.warn(
        `[hydro] ${
          componentName
          } should have been rendered, but isn't in the component map!`
      );
      return;
    }

    const getComponent = componentMap[componentName];

    getComponent()
      .then(
        (component: any) => (!isFunction(component) ? component.default : component)
      )
      .then((Component: React.SFC) => {
        if (!Component) {
          console.warn(
            `[hydro] ${
              componentName
              } should have been rendered, but it is "${Component}"`
          );
          return;
        }
        const shouldHydrate = el.children.length > 0;

        const renderRoot = (
          <ApolloProvider client={getApolloClientForFalmer}>
            <BrowserRouter basename={window.location.pathname.startsWith('/~/') ? '/~/' : undefined}>
              <ScrollToTop>
                <Component {...props} />
              </ScrollToTop>
            </BrowserRouter>
          </ApolloProvider>
        );

        if (shouldHydrate) {
          ReactDOM.hydrate(renderRoot, el);
        } else {
          ReactDOM.render(renderRoot, el);
        }
      });
  });
}