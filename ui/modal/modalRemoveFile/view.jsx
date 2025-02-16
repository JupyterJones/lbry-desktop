// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import { Form, FormField } from 'component/common/form';
import Button from 'component/button';
import usePersistedState from 'effects/use-persisted-state';

type Props = {
  uri: string,
  claim: StreamClaim,
  claimIsMine: boolean,
  closeModal: () => void,
  deleteFile: (string, boolean, boolean) => void,
  title: string,
  fileInfo?: {
    outpoint: ?string,
  },
};

function ModalRemoveFile(props: Props) {
  const { uri, claimIsMine, closeModal, deleteFile, title, claim } = props;
  const [deleteChecked, setDeleteChecked] = usePersistedState('modal-remove-file:delete', true);
  const [abandonChecked, setAbandonChecked] = usePersistedState('modal-remove-file:abandon', true);

  return (
    <Modal isOpen title="Remove File" contentLabel={__('Confirm File Remove')} type="custom" onAborted={closeModal}>
      <section>
        <p>
          {__("Are you sure you'd like to remove")} <cite>{`"${title}"`}</cite> {__('from LBRY?')}
        </p>
      </section>
      <Form onSubmit={() => deleteFile(uri, deleteChecked, claimIsMine ? abandonChecked : false)}>
        {/* @if TARGET='app' */}
        <FormField
          name="file_delete"
          label={__('Delete this file from my computer')}
          type="checkbox"
          checked={deleteChecked}
          onChange={() => setDeleteChecked(!deleteChecked)}
        />
        {/* @endif */}

        {claimIsMine && (
          <div>
            <FormField
              name="claim_abandon"
              label={__('Abandon on blockchain (reclaim %amount% LBC)', { amount: claim.amount })}
              type="checkbox"
              checked={abandonChecked}
              onChange={() => setAbandonChecked(!abandonChecked)}
            />
            {abandonChecked === true && <p className="error-text">This action is permanent and cannot be undone.</p>}

            {/* @if TARGET='app' */}
            {abandonChecked === false && deleteChecked && (
              <p>This file will be removed from your Library and Downloads folder.</p>
            )}
            {!deleteChecked && <p>This file will be removed from your Library but will remain in your Downloads folder.</p>}
            {/* @endif */}
          </div>
        )}
        <div className="card__actions">
          <Button type="submit" button="primary" label={__('OK')} />
          <Button button="link" label={__('Cancel')} onClick={closeModal} />
        </div>
      </Form>
    </Modal>
  );
}

export default ModalRemoveFile;
