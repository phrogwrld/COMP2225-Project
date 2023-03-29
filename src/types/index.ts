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
