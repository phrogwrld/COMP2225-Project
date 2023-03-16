import * as fs from 'fs';

interface Team {
	id: number;
	name: string;
	members: string[];
	points: number;
	rank: number;
}

interface TeamsData {
	teams: Team[];
}

class Team {
	constructor(private dataFilePath: string) {
		if (!fs.existsSync(dataFilePath)) {
			throw new Error(`File ${dataFilePath} does not exist`);
		}
	}

	getTeamSETPoints(teamID: number): number | undefined {
		const team = this.getDataJSON().find((team) => team.id === teamID);
		return team?.points;
	}

	setTeamSETPoints(teamID: number, points: number): void {
		const team = this.getDataJSON().find((team) => team.id === teamID);
		if (!team) {
			throw new Error(`Team with id ${teamID} not found`);
		}
		team.points = points;
	}

	getDataJSON(): Team[] {
		const data = fs.readFileSync(this.dataFilePath, 'utf8');
		const teams: Team[] = JSON.parse(data);
		return teams;
	}

	setDataJSON(data: Team): void {
		fs.writeFileSync(this.dataFilePath, JSON.stringify(data));
	}

	cachePoints(): Map<number, number> {
		const prevPoints = new Map<number, number>();
		this.getDataJSON().forEach((team) => {
			prevPoints.set(team.id, team.points);
		});
		return prevPoints;
	}

	generateRanking(): Team[] {
		const teams = this.getDataJSON();
		const descTeams = teams.sort((a, b) => b.points - a.points);

		descTeams.forEach((team, index) => {
			team.rank = index + 1;
		});

		fs.writeFileSync(this.dataFilePath, JSON.stringify(teams));

		return teams;
	}

	// positionChange(curr: Map<number, number>, prev: Map<number, number>): number {
	// 	return prev.rank - curr.rank;
	// }

	// missingRankKey() {
	// 	const data: Team[] = this.getDataJSON().teams;

	// 	if (data.every((team) => 'rank' in team)) return;

	// 	const newData = data.map((team) => ({ ...team, rank: team.rank ?? 0 }));

	// 	this.setDataJSON({ teams: newData });
	// }
}

export default Team;
