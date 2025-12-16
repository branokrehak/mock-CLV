import { useMemo, useState } from "react";
import { reacter } from "../../../utils/react";
import styles from "./combobox-field.module.css";

export const ComboboxField = reacter(function ComboboxField<T>({
  model,
  attr,
  value: propsValue,
  options = [],
  onChange: propsOnChange,
  placeholder,
}: {
  model?: Record<string, any>;
  attr?: string;
  value?: T;
  options?: ComboboxOption<T>[];
  onChange?: (value: T) => void;
  placeholder?: string;
}) {
  const [filterText, setFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const value = propsValue !== undefined ? propsValue : model?.[attr];

  const filteredOptions = useMemo(() => {
    if (!filterText) return options;
    const lower = filterText.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(lower));
  }, [options, filterText]);

  const selectedOption = options.find((o) => o.value === value);

  const handleSelect = (newValue: T) => {
    if (model && attr) {
      model[attr] = newValue;
    }
    propsOnChange?.(newValue);
    setIsOpen(false);
    setFilterText("");
  };

  return (
    <div className={styles.control} style={{ position: "relative" }}>
      <input
        className={styles.input}
        type="text"
        value={isOpen ? filterText : selectedOption?.label || ""}
        onChange={(e) => setFilterText(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          // Delay to allow click on option
          setTimeout(() => setIsOpen(false), 200);
        }}
        placeholder={placeholder}
      />
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
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export interface ComboboxOption<T> {
  value: T;
  label: string;
}
