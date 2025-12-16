import { ReactNode, useMemo, useState } from "react";
import { DataModel } from "../../../../models/data-model";
import { reacter } from "../../../../utils/react";
import { Button } from "../../button";

export const CellChoose = reacter(function CellChoose(props: {
  model: DataModel;
  index: number;
  valueView: ReactNode;
  valueEdit: ReactNode;
  disabled?: boolean;
  modal: React.ComponentType<{ onClose: () => void }>;
}) {
  const editing = useMemo(
    () => props.model.editingIndex === props.index,
    [props.model.editingIndex, props.index],
  );
  const [modalOpen, setModalOpen] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  const ModalComponent = props.modal;

  return (
    <>
      {editing && (
        <>
          <span>{props.valueEdit}</span>
          <br />
          {!props.disabled && (
            <Button
              variant="subtle"
              onClick={() => {
                setModalOpen(true);
              }}
            >
              Choose
            </Button>
          )}
        </>
      )}

      {!editing && props.valueView}

      {modalOpen && <ModalComponent onClose={closeModal} />}
    </>
  );
});
