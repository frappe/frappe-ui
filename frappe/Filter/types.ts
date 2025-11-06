export interface FilterProps {
	doctype: string;
}

// interface Option {
// 	label: string;
// 	value: string;
// }

export interface Field {
	fieldName: string;
	fieldType: string;
	options?: string[];
}

export interface StateRow {
	field: Field;
	operator: string;
	value: string;
}
