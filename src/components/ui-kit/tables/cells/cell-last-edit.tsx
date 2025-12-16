import { useMemo } from "react";
import { dateTimeOrNull } from "../../../../utils/utils";

export function CellLastEdit(props: { item: any }) {
  const latestHistoryItem = useMemo(
    () =>
      "update_history" in props.item && Array.isArray(props.item.update_history)
        ? props.item.update_history[0]
        : undefined,
    [props.item],
  );

  return (
    <>
      {latestHistoryItem && (
        <>
          {dateTimeOrNull(latestHistoryItem.timestamp, true)} by{" "}
          {latestHistoryItem.username}
        </>
      )}
    </>
  );
}
