import * as fs from 'fs';
import HttpCodes from './common/HttpCodes';
import type {
	TeamsDataMap,
	PositionChange,
	TeamData,
	WeekPoints,
} from './types';

class Team {
	private teams: TeamsDataMap;
	private previousRanks: Map<number, number>;
	private postionChanges: PositionChange[];
	private dataFilePath: string;

	constructor() {
		this.dataFilePath = './src/data/teams.json';

		fetch(this.dataFilePath).then((response) => {
			if (response.status === HttpCodes.NOT_FOUND) {
				throw new Error(`File ${this.dataFilePath} does not exist`);
			}
		});

		this.teams = new Map();
		this.previousRanks = new Map();
		this.postionChanges = [];
		this.init();
	}

	private async init(): Promise<void> {
		console.log('init');
		await this.getData();
		// this.cachePreviousRanks();
		console.log('init done');
		console.log(this.teams);
	}

	private async getData(): Promise<void> {
		console.log('getting data');
		try {
			const res = await fetch(this.dataFilePath);
			if (!res.ok) {
				throw new Error(
					`Could not load data from ${this.dataFilePath}: ${res.status} ${res.statusText}`
				);
			}
			const data: TeamData[] = await res.json();
			data.forEach((team) => {
				this.teams.set(team.id, team);
			});
		} catch (err) {
			throw new Error(err as string);
		}
	}

	private cachePreviousRanks(): void {
		this.teams.forEach((team) => {
			this.previousRanks.set(team.id, team.rank);
		});
	}

	private updatePositions(): void {
		this.cachePreviousRanks();

		const sortedTeams = Array.from(this.teams.values()).sort(
			(a, b) =>
				b.weeks.reduce((total, week) => total + week.points, 0) -
				a.weeks.reduce((total, week) => total + week.points, 0)
		);

		sortedTeams.forEach((team, index) => {
			team.rank = index + 1;
		});

		this.saveData();

		this.postionChanges = sortedTeams.map((team) => {
			const previousRank = this.previousRanks.get(team.id);
			return {
				id: team.id,
				previousRank: previousRank !== undefined ? previousRank : null,
				newRank: team.rank,
			};
		});
	}

	private saveData(): void {
		const data = Array.from(this.teams.values());
		const dataJSON = JSON.stringify(data, null, 2);
		fs.writeFileSync(this.dataFilePath, dataJSON, 'utf8');
	}

	getPositionChanges(): PositionChange[] {
		return this.postionChanges;
	}

	getTeamData(id: number): TeamData | undefined {
		return this.teams.get(id);
	}

	getAllTeamsData(): TeamData[] {
		return Array.from(this.teams.values());
	}

	getTeamPoints(id: number): number | undefined {
		const team = this.teams.get(id);
		if (!team) {
			throw new Error(`Team with id ${id} not found`);
		}
		return team.weeks.reduce((total, week) => total + week.points, 0);
	}

	addPoints(id: number, points: number): void {
		const team = this.teams.get(id);
		if (!team) {
			throw new Error(`Team with id ${id} not found`);
		}

		const weekPoints: WeekPoints = { week: team.weeks.length + 1, points };
		team.weeks.push(weekPoints);
		// this.updatePositions();
	}

	updatePoints(id: number, week: number, points: number): void {
		const team = this.teams.get(id);
		if (!team) {
			throw new Error(`Team with id ${id} not found`);
		}

		const updatedWeek = { week: week, points: points };
		team.weeks[week - 1] = updatedWeek;
		this.updatePositions();
	}

	removePoints(id: number, week: number): void {
		const team = this.teams.get(id);
		if (!team) {
			throw new Error(`Team with id ${id} not found`);
		}
		team.weeks.splice(week - 1, 1);
		this.updatePositions();
	}

	addMember(id: number, member: string): void {
		const team = this.teams.get(id);
		if (!team) {
			throw new Error(`Team with id ${id} not found`);
		}
		team.members.push(member);
		this.saveData();
	}

	removeMember(id: number, member: string): void {
		const team = this.teams.get(id);
		if (!team) {
			throw new Error(`Team with id ${id} not found`);
		}
		const memberIndex = team.members.indexOf(member);
		if (memberIndex === -1) {
			throw new Error(`Member ${member} not found`);
		}
		team.members.splice(memberIndex, 1);
		this.saveData();
	}

	updateMember(id: number, oldMember: string, newMember: string): void {
		const team = this.teams.get(id);
		if (!team) {
			throw new Error(`Team with id ${id} not found`);
		}
		const memberIndex = team.members.indexOf(oldMember);
		if (memberIndex === -1) {
			throw new Error(`Member ${oldMember} not found`);
		}
		team.members[memberIndex] = newMember;
		this.saveData();
	}

	addTeam(name: string, members: string[]): void {
		const id = this.teams.size + 1;
		const team: TeamData = {
			id,
			name,
			members,
			weeks: [],
			rank: 0,
		};
		this.teams.set(id, team);
		this.saveData();
	}

	removeTeam(id: number): void {
		this.teams.delete(id);
		this.saveData();
	}

	updateTeam(id: number, name: string, members: string[]): void {
		const team = this.teams.get(id);
		if (!team) {
			throw new Error(`Team with id ${id} not found`);
		}
		team.name = name;
		team.members = members;
		this.saveData();
	}

	resetPoints(): void {
		this.teams.forEach((team) => {
			team.weeks = [];
		});
		this.saveData();
	}

	resetTeamPoints(id: number): void {
		const team = this.teams.get(id);
		if (!team) {
			throw new Error(`Team with id ${id} not found`);
		}
		team.weeks = [];
		this.saveData();
	}

	public resetTeams(): void {
		this.teams.clear();
		this.saveData();
	}
}

export default Team;
