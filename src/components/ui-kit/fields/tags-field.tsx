import { useState } from "react";
import { reacter } from "../../../utils/react";
import { Tag } from "../tag";
import styles from "./tags-field.module.css";

export const TagsField = reacter(function TagsField<T extends object>({
  attr,
  model,
}: {
  attr: keyof T;
  model: T;
}) {
  const [listAdd, setListAdd] = useState(false);

  const tags = (model?.[attr] as string[]) ?? [];

  return (
    <>
      {tags.map((value) => (
        <Tag
          key={value}
          className={styles.editable}
          deleteable
          onDelete={() => {
            model[attr] = (model[attr] as string[]).filter(
              (v) => v !== value,
            ) as any;
          }}
        >
          {value}
        </Tag>
      ))}{" "}
      {!listAdd && (
        <Tag
          className={styles.add}
          onClick={() => {
            setListAdd(true);
          }}
        >
          add
        </Tag>
      )}
      {listAdd && (
        <>
          <input
            onKeyUp={(event) => {
              if (event.key === "Enter") {
                (model[attr] as string[]).push(event.currentTarget.value);
                setListAdd(false);
              }
            }}
          />{" "}
          <Tag
            className={styles.add}
            onClick={() => {
              setListAdd(false);
            }}
          >
            X
          </Tag>
        </>
      )}
    </>
  );
});
