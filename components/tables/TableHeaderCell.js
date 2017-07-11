import React from 'react';
import { PropTypes } from 'prop-types';


export default function TableHeaderCell(props) {
  const { className, text } = props;

  return (<div className={`TableHeaderCell ${className}`}>{text}</div>);
}

TableHeaderCell.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
};

TableHeaderCell.defaultProps = {
  className: ''
};
