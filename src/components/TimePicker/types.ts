export interface TimePickerProps {
	value?: string | null;
	modelValue?: string | null;
	variant?: 'subtle' | 'outline' | 'ghost';
	placeholder?: string;
	placement?: string;
}

export type TimeOption = {
  label: string
  value: string
  onClick: () => void
  isSelected: () => boolean
}