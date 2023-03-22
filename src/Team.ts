import * as fs from 'fs';

interface TeamData {
	id: number;
	name: string;
	members: string[];
	weeklyPoints: number[];
	rank: number;
}

interface PositionChange {
	id: number;
	previousRank: number | null;
	newRank: number;
}

type TeamsDataMap = Map<number, TeamData>;

class Team {
	private teams: TeamsDataMap;
	private previousRanks: Map<number, number>;
	private postionChanges: PositionChange[];

	constructor(private dataFilePath: string) {
		if (!fs.existsSync(dataFilePath)) {
			throw new Error(`File ${dataFilePath} does not exist`);
		}

		this.teams = new Map();
		this.previousRanks = new Map();
		this.postionChanges = [];
		this.getData();
	}

	private async getData(): Promise<void> {
		try {
			const res = await fetch(this.dataFilePath);
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
				b.weeklyPoints.reduce((a, b) => a + b, 0) -
				a.weeklyPoints.reduce((a, b) => a + b, 0)
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
		return team?.weeklyPoints.reduce((a, b) => a + b, 0);
	}

	private saveData(): void {
		const data = Array.from(this.teams.values());
		const dataJSON = JSON.stringify(data, null, 2);
		fs.writeFileSync(this.dataFilePath, dataJSON, 'utf8');
	}

	public addPoints(id: number, points: number): void {
		const team = this.teams.get(id);
		if (!team) {
			throw new Error(`Team with id ${id} not found`);
		}
		team.weeklyPoints.push(points);
		this.updatePositions();
	}

	public updatePoints(id: number, week: number, points: number): void {
		const team = this.teams.get(id);
		if (!team) {
			throw new Error(`Team with id ${id} not found`);
		}
		team.weeklyPoints[week - 1] = points;
		this.updatePositions();
	}

	public removePoints(id: number, week: number): void {
		const team = this.teams.get(id);
		if (!team) {
			throw new Error(`Team with id ${id} not found`);
		}
		team.weeklyPoints.splice(week - 1, 1);
		this.updatePositions();
	}

	public addMember(id: number, member: string): void {
		const team = this.teams.get(id);
		if (!team) {
			throw new Error(`Team with id ${id} not found`);
		}
		team.members.push(member);
		this.saveData();
	}

	public removeMember(id: number, member: string): void {
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

	public updateMember(id: number, oldMember: string, newMember: string): void {
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

	public addTeam(name: string, members: string[]): void {
		const id = this.teams.size + 1;
		const team: TeamData = {
			id,
			name,
			members,
			weeklyPoints: [],
			rank: 0,
		};
		this.teams.set(id, team);
		this.saveData();
	}

	public removeTeam(id: number): void {
		this.teams.delete(id);
		this.saveData();
	}

	public updateTeam(id: number, name: string, members: string[]): void {
		const team = this.teams.get(id);
		if (!team) {
			throw new Error(`Team with id ${id} not found`);
		}
		team.name = name;
		team.members = members;
		this.saveData();
	}

	public resetPoints(): void {
		this.teams.forEach((team) => {
			team.weeklyPoints = [];
		});
		this.saveData();
	}

	public resetTeamPoints(id: number): void {
		const team = this.teams.get(id);
		if (!team) {
			throw new Error(`Team with id ${id} not found`);
		}
		team.weeklyPoints = [];
		this.saveData();
	}

	public resetTeams(): void {
		this.teams.clear();
		this.saveData();
	}
}

export default Team;
