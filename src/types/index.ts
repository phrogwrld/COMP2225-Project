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
