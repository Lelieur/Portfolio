import { Button } from "./Button";

export type ListFilterOption = {
  value: string | null;
  label: string;
  count: number;
};

export function ListFilter({
  ariaLabel,
  options,
  value,
  onChange,
}: {
  ariaLabel: string;
  options: ListFilterOption[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <nav className="ui-filter-bar" aria-label={ariaLabel}>
      {options.map((option) => (
        <Button
          key={option.value ?? "all"}
          type="button"
          className="ui-filter-option"
          data-active={value === option.value}
          onPress={() => onChange(option.value)}
        >
          <span className="text-sm leading-normal">{option.label}</span>
          <sup className="text-xs leading-normal">{option.count}</sup>
        </Button>
      ))}
    </nav>
  );
}
