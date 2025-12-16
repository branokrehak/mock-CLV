import React, { FunctionComponent, useState } from "react";
import { Button } from "../button";

export function ChooseField({
  value,
  modal: Modal,
}: {
  value: React.ReactNode;
  modal: FunctionComponent<{ onClose: () => void }>;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <span>{value}</span>
      <br />
      <Button
        onClick={() => {
          setModalOpen(true);
        }}
        variant="subtle"
      >
        Choose
      </Button>

      {modalOpen && <Modal onClose={closeModal} />}
    </>
  );
}
