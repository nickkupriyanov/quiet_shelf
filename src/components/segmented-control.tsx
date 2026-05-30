type SegmentedControlOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  label: string;
  options: SegmentedControlOption<T>[];
  value: T;
  onChange?: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-medium text-secondary">{label}</legend>
      <div className="flex flex-wrap gap-1 rounded-full bg-soft p-1">
        {options.map((option) => {
          const selected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange?.(option.value)}
              className={[
                "min-h-10 rounded-full px-4 text-sm font-medium transition",
                selected
                  ? "bg-ink text-[#f8f7f2] shadow-sm"
                  : "text-secondary hover:bg-card hover:text-primary",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
