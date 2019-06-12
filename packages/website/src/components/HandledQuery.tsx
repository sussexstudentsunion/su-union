import React from 'react';
import { Query, QueryProps } from 'react-apollo';
import Loader from './Loader';
import { ErrorState } from './ErrorState';

interface HandledQueryProps<TData, TVariables>
  extends QueryProps<TData, TVariables> {
  loader?: any;
  error?: any;
}

export class HandledQuery<TData, TVariables> extends React.Component<
  HandledQueryProps<TData, TVariables>
> {
  static defaultProps = {
    loader: Loader,
    error: ErrorState,
  };

  render() {
    return (
      <Query {...(this.props as any)}>
        {(queryProps: any) => {
          if (queryProps.loading) {
            return React.createElement(this.props.loader);
          }

          if (queryProps.error || queryProps.data === undefined) {
            return React.createElement(this.props.error);
          }
          return this.props.children(queryProps as any);
        }}
      </Query>
    );
  }
}
// todo: apollo
