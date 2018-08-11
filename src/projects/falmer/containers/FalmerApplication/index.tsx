import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Router } from '@reach/router';
import Loadable from 'react-loadable';
import { requestAuthToken } from '~falmer/ducks/auth';
import FalmerHeader from '~falmer/components/FalmerHeader';
import Loader from '~components/Loader';
import LoadableLoading from '~components/LoadableLoading';
import { RootState } from '~types/falmer';
import { compose } from 'recompose';

const LoadableMedia = Loadable({
  loader: () => import(/* webpackChunkName: "Media" */ '../FalmerMedia'),
  loading: LoadableLoading,
}) as any;

const LoadableBookMarket = Loadable({
  loader: () =>
    import(/* webpackChunkName: "BookMarket" */ '../FalmerBookMarket'),
  loading: LoadableLoading,
}) as any;

const LoadableStudentGroups = Loadable({
  loader: () =>
    import(/* webpackChunkName: "StudentGroups" */ '../FalmerStudentGroups'),
  loading: LoadableLoading,
}) as any;

const LoadableEvents = Loadable({
  loader: () => import(/* webpackChunkName: "Events" */ '../FalmerEvents'),
  loading: LoadableLoading,
}) as any;

const LoadableDashboard = Loadable({
  loader: () =>
    import(/* webpackChunkName: "Dashboard" */ '../FalmerDashboard'),
  loading: LoadableLoading,
}) as any;

interface IProps {
  requestAuthToken(): void;
  isAuthenticated: boolean;
}

class FalmerApplication extends React.Component<IProps> {
  componentDidMount() {
    this.props.requestAuthToken();
  }

  render() {
    const { isAuthenticated } = this.props;

    if (!isAuthenticated) {
      return <Loader />;
    }

    return (
      <section>
        <Helmet titleTemplate="%s | Falmer" />
        <FalmerHeader />
        <main className="FalmerViewContainer">
          <Router>
            <LoadableDashboard path="/" exact />
            <LoadableEvents path="/events/*" />
            <LoadableStudentGroups path="/groups/*" />
            <LoadableMedia path="/media/*" />
            <LoadableBookMarket path="/book-market/*" />
          </Router>
        </main>
      </section>
    );
  }
}

export default compose<IProps, {}>(
  connect(
    (state: RootState) => ({
      isAuthenticated: state.auth.user !== null,
    }),
    {
      requestAuthToken,
    },
  ),
)(FalmerApplication);
