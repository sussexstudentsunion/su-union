import React from 'react';
import ContentAPIComposer from '~components/ContentAPIComposer';

class GetInvolved extends React.Component {
  render() {
    return (
      <div>
        <div className="Layout">
          <div>
            <ContentAPIComposer pageId="10" />
          </div>
        </div>
      </div>
    );
  }
}

export default GetInvolved;