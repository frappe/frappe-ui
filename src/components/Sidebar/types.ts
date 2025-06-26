import { RouteLocationRaw } from "vue-router";

export type SidebarHeaderProps = {
	title: string;
	subtitle: string;
	menuItems: {
		label: string;
		icon?: any; // Icon component
		onClick?: () => void;
	}[]
}

export type SidebarItemProps = {
	label: string;
	icon?: any; // Icon component
	suffix?: string;
	to?: RouteLocationRaw;
	isActive?: boolean;
	onClick?: () => void;
};

export type SidebarSectionProps = {
	label: string;
	items: SidebarItemProps[];
	collapsible?: boolean;
}

export type SidebarProps = {
	header: SidebarHeaderProps;
	sections?: SidebarSectionProps[];
}
