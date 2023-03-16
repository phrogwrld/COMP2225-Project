import Team from './Team';

function main() {
	const t = new Team('./src/data/teams.json');

	t.getTeamSETPoints(1);
	t.generateRanking();
}

main();
export {};
