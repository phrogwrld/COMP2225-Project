import { IncomingMessage, ServerResponse } from 'http';

export interface Team {
	id: number;
	name: string;
	members: string[];
	points: number;
	rank?: null | number;
}

export interface TeamsData {
	teams: Team[];
}

interface Route {
	path: string;
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	component: any;
}

export interface Credentials {
	username: string;
	password: string;
}

export interface User {
	username: string;
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
}

export interface WeekPoints {
	week: number;
	points: number;
}

export interface PositionChange {
	id: number;
	previousRank: number | null;
	newRank: number;
}

export type TeamsDataMap = Map<number, TeamData>;

export interface CookieOptions {
	res?: ServerResponse;
	req?: IncomingMessage & {
		cookies?: {
			[key: string]: string | Partial<{ [key: string]: string }>;
		};
	};
}

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
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	component: new (...args: any[]) => Page;
	title?: string;
	description?: string;
	children?: Route[];
	auth?: boolean;
	params?: Record<string, string>;
}
