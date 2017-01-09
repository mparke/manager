import React, { PropTypes } from 'react';

import { hideModal } from '~/actions/modal';

export default function ModalShell(props) {
  console.log('props: ', props);
  const { title, body, open, dispatch } = props;
  const close = () => dispatch(hideModal());
  return (
    <div
      className={`modal-overlay ${open ? 'open' : ''}`}
      onClick={close}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3>{title}</h3>
        </header>
        <div className="modal-body">{body}</div>
      </div>
    </div>
  );
}

ModalShell.propTypes = {
  title: PropTypes.string,
  body: PropTypes.node,
  open: PropTypes.bool.isRequired,

  dispatch: PropTypes.func.isRequired,
};

ModalShell.defaultProps = {
  open: false,
};
