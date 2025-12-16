import clsx from "clsx";
import { useMemo, useState } from "react";
import { reacter } from "../../../utils/react";
import { Tag } from "../tag";
import { ComboboxOption } from "./combobox-field";
import styles from "./combobox-field.module.css";

export const ComboboxMultipleField = reacter(function ComboboxMultipleField<
  T extends object,
  V,
>({
  model,
  attr,
  value: propsValue,
  options = [],
  onChange: propsOnChange,
  placeholder,
}: {
  model?: T;
  attr?: keyof T;
  value?: V[];
  options?: ComboboxOption<V>[];
  onChange?: (value: V[]) => void;
  placeholder?: string;
}) {
  const [filterText, setFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const value: V[] =
    propsValue !== undefined
      ? propsValue
      : model && attr
        ? (model[attr] as V[])
        : [];

  const filteredOptions = useMemo(() => {
    if (!filterText) return options;
    const lower = filterText.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(lower));
  }, [options, filterText]);

  const selectedOptions = useMemo(() => {
    return (
      value?.map((v) => options.find((o) => o.value === v)).filter(Boolean) ||
      []
    );
  }, [value, options]);

  const handleSelect = (optionValue: V) => {
    const newValue = value?.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...(value || []), optionValue];

    if (model && attr) {
      model[attr] = newValue as any;
    }
    propsOnChange?.(newValue);
    setFilterText("");
  };

  const handleRemove = (optionValue: V) => {
    const newValue = value.filter((v) => v !== optionValue);
    if (model && attr) {
      model[attr] = newValue as any;
    }
    propsOnChange?.(newValue);
  };

  const handleClear = () => {
    if (model && attr) {
      model[attr] = [] as any;
    }
    propsOnChange?.([]);
  };

  return (
    <div style={{ position: "relative" }}>
      <div className={clsx(styles.control, styles.controlMulti)}>
        <div className="flex flex-wrap grow">
          {selectedOptions.map((option) => (
            <Tag
              key={String(option.value)}
              className="m-[1px]"
              deleteable
              onDelete={() => handleRemove(option.value)}
            >
              {option.label}
            </Tag>
          ))}
          <input
            className={styles.input}
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              // Delay to allow click on option
              setTimeout(() => setIsOpen(false), 200);
            }}
            placeholder={placeholder}
          />
        </div>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleClear}
          className={styles.reset}
        >
          X
        </button>
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <div
          className={styles.content}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
        >
          <div className={styles.listbox}>
            {filteredOptions.map((option) => (
              <div
                key={String(option.value)}
                className={styles.item}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent blur
                  handleSelect(option.value);
                }}
              >
                <span className="flex justify-between w-full">
                  <span>{option.label}</span>
                  {value?.includes(option.value) && <span>✓</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
