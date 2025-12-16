import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import { useId } from "react";
import styles from "./header-filter-base.module.css";

export function HeaderFilterBase<V>(props: {
  name?: string;
  options: Map<V, string>;
  onChange?: (selected: V[]) => void;
  selected?: V[];
  disabled?: boolean;
}) {
  const baseId = useId();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={clsx(
          styles.toggle,
          props.selected && props.selected.length > 0 && styles.active,
        )}
        disabled={props.disabled}
        style={{
          opacity: props.disabled ? "0.4" : "1",
        }}
      >
        {props.name ? `Filter by ${props.name}` : "Filter"}
        {props.selected && props.selected.length > 0
          ? ` (${props.selected.length})`
          : ""}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.menu}>
          {Array.from(props.options.entries()).map(([value, label], index) => {
            const id = `${baseId}-${index}`;
            const checked = props.selected?.includes(value) ?? false;

            return (
              <label key={String(value)} htmlFor={id}>
                <input
                  id={id}
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const newSelected = [...(props.selected ?? [])];

                    if (checked) {
                      const index = newSelected.indexOf(value);
                      if (index !== -1) {
                        newSelected.splice(index, 1);
                      }
                    } else {
                      if (!newSelected.includes(value)) {
                        newSelected.push(value);
                      }
                    }

                    props.onChange?.(newSelected);
                  }}
                />
                <span>{label}</span>
              </label>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
