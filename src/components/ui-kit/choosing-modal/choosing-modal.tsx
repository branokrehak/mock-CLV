import React from "react";
import { DataModel } from "../../../models/data-model";
import { reacter } from "../../../utils/react";
import { Button } from "../button";
import { Dialog } from "../dialog";
import styles from "./choosing-modal.module.css";

export const ChoosingModal = reacter(function ChoosingModal({
  model,
  title,
  onConfirm,
  onClose,
  table,
  readOnly,
  loading,
}: {
  model: DataModel;
  title: React.ReactNode;
  onConfirm: (params: { selected: any[] }) => void;
  onClose: () => void;
  table: React.ReactNode;
  readOnly?: boolean;
  loading?: boolean;
}) {
  const closeModal = () => {
    onClose();
  };

  return (
    <Dialog
      open
      className={styles.dialog}
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
        }
      }}
    >
      <div className="flex flex-col items-start">
        <div className="self-stretch flex items-center justify-between pb-8">
          <h3 style={{ margin: 0, padding: 0 }}>{title}</h3>

          <Button className={styles.closeButton} onClick={closeModal}>
            X
          </Button>
        </div>

        {loading ? "Loading..." : table}

        {!readOnly && (
          <div className="self-center mt-8">
            <Button
              disabled={
                loading ||
                (model.selectionMode === "single" &&
                  model.selected.length === 0)
              }
              onClick={() => {
                onConfirm({ selected: model.selected });
                closeModal();
              }}
            >
              Confirm
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  );
});
