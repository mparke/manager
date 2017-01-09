import React, { PropTypes } from 'react';

import Section from '~/styleguide/components/Section';
import ModalBody from '~/layouts/ModalBody';
import ConfirmModal from '~/components/ConfirmModal';
import { showModal, hideModal } from '~/actions/modal';

export default function Modals(props) {
  return (
    <Section name="modals" title="Modals">
      <a
        onClick={e => {
          e.preventDefault();
          dispatch(showModal('Confirm Modal',
            <ConfirmModal
              buttonText="Delete config"
              onOk={() => dispatch(hideModal())}
              onCancel={() => dispatch(hideModal())}
            >
              This is a confirm modal.
            </ConfirmModal>
          ));
        }}
      >Show confirm modal</a>
    </Section>
  );
}

Modals.propTypes = {

};
