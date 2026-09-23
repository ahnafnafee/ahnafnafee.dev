'use client'

type Choice<Value extends string> = {
  value: Value
  label: string
}

type ChoiceGroupProps<Value extends string> = {
  ariaLabel: string
  options: readonly Choice<Value>[]
  value: Value
  onChange: (value: Value) => void
}

export function ChoiceGroup<Value extends string>({ ariaLabel, options, value, onChange }: ChoiceGroupProps<Value>) {
  return (
    <div className='flex flex-wrap gap-2' role='group' aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type='button'
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${value === option.value ? 'border-blue-500 bg-blue-500 font-semibold text-white' : 'border-border bg-card text-card-foreground hover:border-blue-500'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
