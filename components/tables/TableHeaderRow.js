import React from 'react';
import { PropTypes } from 'prop-types';

import TableHeaderCell from './TableHeaderCell';


export default function TableHeaderRow(props) {
  const { columns } = props;

  return (
    <div className="TableHeaderRow">
      {columns.map(function (column, index) {
        return (
          <TableHeaderCell
            className={column.headerClassName}
            key={index}
            text={column.label}
          />
        );
      })}
    </div>
  );
}

TableHeaderRow.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
  })).isRequired,
};
