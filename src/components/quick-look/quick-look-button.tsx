import { reactive } from "@vue/reactivity";
import { QuickLookTasks } from "../../api";
import { ApiConnector } from "../../api/api-connector";
import {
  HeartCoreQuickLook,
  PatientQuickLook,
  QuickLook,
} from "../../models/quick-look-analyses";
import { reacter } from "../../utils/react";
import { Button } from "../ui-kit/button";
import styles from "./quick-look-button.module.css";

export interface QuickLookButtonProps {
  model: QuickLook;
  label: string;
  resultLabel: string;
  disabled?: boolean;
  size?: "large" | "small";
}

export const QuickLookButton = reacter(function QuickLookButton({
  model,
  label,
  resultLabel,
  disabled,
  size = "large",
}: QuickLookButtonProps) {
  return (
    <Button
      variant={size === "large" ? "large" : "default"}
      pending={model.processing}
      disabled={disabled}
      onClick={() => {
        if (model.resultUrl) {
          window.open(model.resultUrl, "_blank");
        } else {
          model.submit();
        }
      }}
      className={
        size === "large" ? styles.heartcoreButton : styles.heartcoreButtonSmall
      }
    >
      {model.resultUrl ? resultLabel : label}
    </Button>
  );
});

export const QuickLookPerLevel = reacter(function QuickLookPerLevel({
  api,
  patientId,
}: {
  api: ApiConnector;
  patientId: number;
}) {
  let model: QuickLook;
  let buttonLabel: string;

  if (api.userLevel >= 3) {
    model = reactive(
      new PatientQuickLook(api, QuickLookTasks.hf_dri_timeseries_ql, patientId),
    );
    buttonLabel = "DRI HeartCore";
  } else if (api.userLevel == 2) {
    model = reactive(new HeartCoreQuickLook(api, patientId, 12, 3));
    buttonLabel = "LVFP HeartCore";
  }

  return (
    <QuickLookButton
      label={buttonLabel}
      resultLabel="View HeartCore"
      model={model}
      size="small"
    />
  );
});
