import React from 'react';
import { Link } from 'react-router';
import { PropTypes } from 'prop-types';
import TableCell from './TableCell';


export default function LinkCell(props) {
  const { column, record } = props;
  const {
    className = '',
    hrefFn,
    textKey = 'label',
    textFn,
  } = column;

  let children = props.children;
  if (!children) {
    if (textFn) {
      children = textFn(record);
    } else {
      children = record[textKey];
    }
  }

  const name = record[textKey];
  const tooltipText = `${name} \n ID: ${record.id}`;

  return (
    <TableCell
      className={`LinkCell ${className}`}
      column={column}
      record={record}
      tooltip={tooltipText}
    >
      <Link to={hrefFn(record)}>
        {children}
      </Link>
    </TableCell>
  );
}

LinkCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  column: PropTypes.shape({
    hrefFn: PropTypes.func.isRequired,
    titleKey: PropTypes.string,
    textKey: PropTypes.string,
    // TODO: consider generalizing textFn for formatting
    textFn: PropTypes.func,
  }).isRequired,
  record: PropTypes.object.isRequired,
};
