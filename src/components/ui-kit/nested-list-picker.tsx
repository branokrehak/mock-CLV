import { useMemo, useRef, useState } from "react";
import { reacter } from "../../utils/react";
import { TextField } from "./fields/text-field";

export interface NestedListItem<TParentValue, TChildValue> {
  value: TParentValue;
  label: string;
  children: Array<{
    value: TChildValue;
    label: string;
  }>;
}

export interface NestedListSelection<TParentValue, TChildValue> {
  value: TParentValue;
  children: TChildValue[];
}

interface NestedListPickerProps<TParentValue, TChildValue> {
  items: NestedListItem<TParentValue, TChildValue>[];
  selection: NestedListSelection<TParentValue, TChildValue>[];
  onChange: (
    selection: NestedListSelection<TParentValue, TChildValue>[],
  ) => void;
  disabled?: boolean;
}

export const NestedListPicker = reacter(function NestedListPicker<
  TParentValue,
  TChildValue,
>({
  items,
  selection,
  onChange,
  disabled,
}: NestedListPickerProps<TParentValue, TChildValue>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedParents, setExpandedParents] = useState<Set<TParentValue>>(
    new Set(),
  );
  const parentRefs = useRef<Map<TParentValue, HTMLDivElement>>(new Map());
  const [expandedBeforeSearch, setExpandedBeforeSearch] =
    useState<Set<TParentValue> | null>(null);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return items;

    return items
      .map((item) => {
        const parentMatches = item.label.toLowerCase().includes(query);
        const matchingChildren = item.children.filter((child) =>
          child.label.toLowerCase().includes(query),
        );

        if (parentMatches || matchingChildren.length > 0) {
          return {
            ...item,
            children: parentMatches ? item.children : matchingChildren,
          };
        }
        return null;
      })
      .filter(
        (item): item is NestedListItem<TParentValue, TChildValue> =>
          item !== null,
      );
  }, [items, searchQuery]);

  // Auto-expand filtered items and sort selected to top
  const itemsToDisplay = useMemo(() => {
    const query = searchQuery.trim();

    if (query) {
      // Save the current expanded state before auto-expanding (only on first search)
      if (expandedBeforeSearch === null) {
        setExpandedBeforeSearch(new Set(expandedParents));
      }
      // Auto-expand all when searching
      const newExpanded = new Set(filteredItems.map((item) => item.value));
      if (
        JSON.stringify([...expandedParents]) !==
        JSON.stringify([...newExpanded])
      ) {
        setExpandedParents(newExpanded);
      }
    } else if (expandedBeforeSearch !== null) {
      // Restore the previous expanded state when search is cleared
      setExpandedParents(expandedBeforeSearch);
      setExpandedBeforeSearch(null);
    }

    // Sort: selected items first, then unselected items
    return [...filteredItems].sort((a, b) => {
      const aSelected = getParentSelection(a.value);
      const bSelected = getParentSelection(b.value);

      // If one is selected and the other isn't, selected comes first
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      // Otherwise maintain alphabetical order by label
      return a.label.localeCompare(b.label);
    });
  }, [filteredItems, searchQuery, expandedBeforeSearch]);

  const toggleParentExpanded = (parentValue: TParentValue) => {
    const expanded = new Set(expandedParents);
    if (expanded.has(parentValue)) {
      expanded.delete(parentValue);
    } else {
      expanded.add(parentValue);
    }
    setExpandedParents(expanded);
  };

  const isParentExpanded = (parentValue: TParentValue) =>
    expandedParents.has(parentValue);

  const getParentSelection = (parentValue: TParentValue) => {
    return selection.find((s) => s.value === parentValue);
  };

  const isParentFullySelected = (
    item: NestedListItem<TParentValue, TChildValue>,
  ) => {
    const sel = getParentSelection(item.value);
    if (!sel) return false;
    return item.children.every((child) => sel.children.includes(child.value));
  };

  const isParentPartiallySelected = (
    item: NestedListItem<TParentValue, TChildValue>,
  ) => {
    const sel = getParentSelection(item.value);
    if (!sel || sel.children.length === 0) return false;
    return !isParentFullySelected(item);
  };

  const isChildSelected = (
    parentValue: TParentValue,
    childValue: TChildValue,
  ) => {
    const sel = getParentSelection(parentValue);
    return sel?.children.includes(childValue) ?? false;
  };

  const scrollToParent = (parentValue: TParentValue) => {
    const element = parentRefs.current.get(parentValue);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const toggleParent = (item: NestedListItem<TParentValue, TChildValue>) => {
    const newSelection = [...selection];
    const existingIndex = newSelection.findIndex((s) => s.value === item.value);
    const wasSelected = existingIndex >= 0;

    if (isParentFullySelected(item)) {
      // Deselect all
      if (existingIndex >= 0) {
        newSelection.splice(existingIndex, 1);
      }
    } else {
      // Select all
      if (existingIndex >= 0) {
        newSelection[existingIndex] = {
          value: item.value,
          children: item.children.map((c) => c.value),
        };
      } else {
        newSelection.push({
          value: item.value,
          children: item.children.map((c) => c.value),
        });
      }
      // Scroll to the newly selected parent if it wasn't already selected
      if (!wasSelected) {
        setTimeout(() => scrollToParent(item.value), 0);
      }
    }

    onChange(newSelection);
  };

  const toggleChild = (parentValue: TParentValue, childValue: TChildValue) => {
    const newSelection = [...selection];
    const existingIndex = newSelection.findIndex(
      (s) => s.value === parentValue,
    );

    if (existingIndex >= 0) {
      const sel = newSelection[existingIndex];
      const childIndex = sel.children.indexOf(childValue);

      if (childIndex >= 0) {
        // Deselect child
        sel.children.splice(childIndex, 1);
        // Remove parent if no children left
        if (sel.children.length === 0) {
          newSelection.splice(existingIndex, 1);
        }
      } else {
        // Select child
        sel.children.push(childValue);
      }
    } else {
      // Add new parent with this child
      newSelection.push({
        value: parentValue,
        children: [childValue],
      });
      // Scroll to the newly selected parent
      setTimeout(() => scrollToParent(parentValue), 0);
    }

    onChange(newSelection);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search box */}
      <TextField
        value={searchQuery}
        onChange={setSearchQuery}
        type="text"
        autofocus
        disabled={disabled}
        placeholder="Search..."
        className="w-full"
      />

      {/* List */}
      <div className="flex flex-col gap-1 max-h-96 overflow-y-auto">
        {itemsToDisplay.map((item) => (
          <div key={String(item.value)} className="flex flex-col">
            {/* Parent row */}
            <div
              className="flex items-center gap-2 py-1"
              ref={(el) => {
                if (el) {
                  parentRefs.current.set(item.value, el);
                }
              }}
            >
              {/* Expand/collapse button */}
              <button
                type="button"
                onClick={() => toggleParentExpanded(item.value)}
                className="w-5 h-5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors bg-transparent border-0 p-0 cursor-pointer"
                disabled={disabled}
              >
                {isParentExpanded(item.value) ? "▼" : "▶"}
              </button>

              {/* Parent checkbox */}
              <input
                type="checkbox"
                checked={isParentFullySelected(item)}
                ref={(el) => {
                  if (el) {
                    // Set indeterminate property which is not available as HTML attribute
                    el.indeterminate = isParentPartiallySelected(item);
                  }
                }}
                onChange={() => toggleParent(item)}
                disabled={disabled}
                className="cursor-pointer"
              />

              {/* Parent label */}
              <label
                className="flex-1 cursor-pointer select-none"
                onClick={() => toggleParent(item)}
              >
                {item.label}
              </label>

              {/* Selection count */}
              {getParentSelection(item.value) && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {getParentSelection(item.value)!.children.length}/
                  {item.children.length}
                </span>
              )}
            </div>

            {/* Children rows */}
            {isParentExpanded(item.value) && (
              <div className="flex flex-col gap-1 ml-8 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
                {item.children.map((child) => (
                  <div
                    key={String(child.value)}
                    className="flex items-center gap-2 py-1"
                  >
                    {/* Child checkbox */}
                    <input
                      type="checkbox"
                      checked={isChildSelected(item.value, child.value)}
                      onChange={() => toggleChild(item.value, child.value)}
                      disabled={disabled}
                      className="cursor-pointer"
                    />

                    {/* Child label */}
                    <label
                      className="flex-1 cursor-pointer select-none"
                      onClick={() => toggleChild(item.value, child.value)}
                    >
                      {child.label}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
