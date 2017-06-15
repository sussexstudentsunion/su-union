import React from 'react';
import PropTypes from 'prop-types';

const FigureCollection = ({ children }) => (
  <ul className="FigureCollection">
    {children}
  </ul>
);

FigureCollection.propTypes = {
  children: PropTypes.node.isRequired,
};

FigureCollection.ui = {
  children: {
    allowed: ['FigureCollectionFigure'],
  },
};

export default FigureCollection;
