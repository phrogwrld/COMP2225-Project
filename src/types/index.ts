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
