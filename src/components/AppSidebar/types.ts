import { RouteLocationRaw } from "vue-router";

export type AppSidebarHeaderProps = {
	title: string;
	subtitle: string;
	menuItems: {
		label: string;
		icon?: any; // Icon component
		onClick?: () => void;
	}[]
}

export type AppSidebarItem = {
	label: string;
	icon?: any; // Icon component
	suffix?: string;
	to?: RouteLocationRaw;
	isActive?: boolean;
	onClick?: () => void;
};

export type AppSidebarProps = {
	header: AppSidebarHeaderProps;
	items?: {
		group: string;
		items: AppSidebarItem[];
	}[];
}
