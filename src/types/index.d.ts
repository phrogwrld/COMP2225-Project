/**
 * Represents a Route object used by Router to handle navigation.
 * @interface Route
 * @property {string} path - The path of the route.
 * @property {Function} component - The component function to render the route.
 * @property {string} [title] - The title of the page.
 * @property {string} [description] - The description of the page.
 * @property {Route[]} [children] - The child routes of the route.
 * @property {boolean} [auth] - Whether the route requires authentication.
 * @property {Record<string, string>} params - The parameters of the route.
 */
export interface Route {
	path: string;
	component: new (...args: any[]) => Page;
	title?: string;
	description?: string;
	children?: Route[];
	auth?: boolean;
	params?: Record<string, string>;
}

/**
 * Represents team data.
 * @interface
 * @property {number} id - The ID of the team.
 * @property {string} name - The name of the team.
 * @property {string[]} members - An array of members' usernames.
 * @property {WeekPoints[]} weeks - An array of weekly points for the team.
 * @property {number} rank - The rank of the team.
 */
export interface TeamData {
	id: number;
	name: string;
	members: string[];
	weeks: WeekPoints[];
	rank: number;
	change: number;
}

export interface Metrics {
	requirements_volatility?: number;
	spec_docs?: number;
	size_lines_of_code?: number;
	design_faults?: number;
}

export interface WeekPoints {
	week: number;
	points: number;
	metrics?: Metrics;
}

export interface Credentials {
	username: string;
	password: string;
}

export interface User {
	username: string;
}
