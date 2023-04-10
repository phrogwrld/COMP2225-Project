import Page from '../lib/Page';
import data from '../data/teams.json';
import Team from '../Team';

import type { TeamData, WeekPoints } from '../types';

class Home extends Page {
	private teamHandler: Team;

	constructor() {
		super();
		this.state = {
			teams: [] as TeamData[],
			sortColumn: 'total',
			sortOrder: 'asc',
		};

		this.teamHandler = new Team();
	}

	async onMount(): Promise<void> {
		if (this.state.teams.length === 0) {
			// check if data has already been fetched
			const response = await fetch('http://127.0.0.1:3000/team');
			const teams = await response.json();
			this.setState({ teams });
		}

		const totalHeader = document.getElementById(
			'total'
		) as HTMLTableCellElement;
		totalHeader.addEventListener('click', () => {
			this.toggleSort('total');
			this.sortTeams();

			if (this.state.sortOrder === 'asc') {
				document.getElementById('total')!.innerHTML = 'Total &#8593;';
			} else if (this.state.sortOrder === 'desc') {
				document.getElementById('total')!.innerHTML = 'Total &#8595;';
			} else {
				document.getElementById('total')!.innerHTML = 'Total';
			}
		});

		this.state.teams[0].weeks.forEach((_: TeamData, index: number) => {
			const weekColumnId = `week${index + 1}`;

			const weekHeader = document.getElementById(
				weekColumnId
			) as HTMLTableCellElement;
			weekHeader.addEventListener('click', () => {
				this.toggleSort(weekColumnId);
				this.sortTeams();

				if (this.state.sortOrder === 'asc') {
					console.log('asc');
					document.getElementById(weekColumnId)!.innerHTML = `Week ${
						index + 1
					} &#8593;`;
				} else if (this.state.sortOrder === 'desc') {
					document.getElementById(weekColumnId)!.innerHTML = `Week ${
						index + 1
					} &#8595;`;
				} else {
					document.getElementById(weekColumnId)!.innerHTML = `Week ${
						index + 1
					}`;
				}
			});
		});

		// rome-ignore lint/style/noNonNullAssertion: <explanation>
		document.getElementById('should')!.addEventListener('click', this.tsss);
	}

	/**

	Sorts the teams array in state based on the given sortColumn and sortOrder.
	If sortColumn is 'total', sorts by the sum of points earned by each team over all weeks.
	If sortColumn is a week number, sorts by the points earned by each team in that week.
	sortOrder can be either 'asc' for ascending or 'desc' for descending order.
	Updates the teams array in state with the sorted teams.
	
	@function sortTeams
	@memberof Component
	@returns {void}
	*/
	sortTeams(): void {
		const { teams, sortColumn, sortOrder } = this.state;

		if (sortColumn === 'total') {
			const sortedTeams = [...teams].sort((a, b) => {
				const aTotal = a.weeks.reduce(
					(acc: number, week: WeekPoints) => acc + week.points,
					0
				);
				const bTotal = b.weeks.reduce(
					(acc: number, week: WeekPoints) => acc + week.points,
					0
				);

				if (sortOrder === 'asc') {
					return aTotal < bTotal ? -1 : 1;
				} else {
					return aTotal > bTotal ? -1 : 1;
				}
			});

			this.setState({ teams: sortedTeams });
		} else {
			const sortedTeams = [...teams].sort((a: TeamData, b: TeamData) => {
				const weekIndex = parseInt(sortColumn.replace('week', ''), 10) - 1;
				const aPoints = a.weeks[weekIndex]?.points ?? 0;
				const bPoints = b.weeks[weekIndex]?.points ?? 0;

				if (sortOrder === 'asc') {
					return aPoints < bPoints ? -1 : 1;
				} else {
					return aPoints > bPoints ? -1 : 1;
				}
			});

			console.log({ sortOrder });
			console.log('hey');
			this.setState({ teams: sortedTeams });
		}

		console.log(this.state);
	}

	toggleSort(column: string) {
		const { sortColumn, sortOrder } = this.state;

		if (sortColumn === column) {
			console.log(sortColumn, column, sortOrder);
			this.setState({ sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' });
		} else {
			this.setState({ sortColumn: column, sortOrder: 'desc' });
		}
	}

	tsss() {
		console.log('Button clicked!');
	}

	render() {
		const { teams, sortColumn, sortOrder } = this.state;

		return /* HTML */ `
			<div
				class="flex min-h-screen items-center justify-center bg-black font-sans text-white"
			>
				<table class="table rounded bg-dark text-left" id="leaderboard">
					<thead>
						<tr>
							<th>RANKiNg</th>
							<th>Name</th>
							${teams
								.map((team: TeamData, index: number) => {
									if (index === 0 && team.weeks && team.weeks.length > 0) {
										return team.weeks
											.map((_, index: number) => {
												const weekNumber = `Week ${index + 1}`;

												return `<th id ="week${index + 1}">${weekNumber} ${
													sortColumn === weekNumber && sortOrder === 'asc'
														? '▲'
														: sortColumn === weekNumber && sortOrder === 'desc'
														? '▼'
														: ''
												}</th>`;
											})
											.join('');
									} else {
										return '';
									}
								})
								.join('')}
							<th id="total">Total</th>
						</tr>
					</thead>
					<tbody>
						${teams
							.map((team: TeamData, index: number) => {
								return `<tr>
							<td>${index + 1}</td>
							<td><a href="/members/${team.id}">${team.name}<a></td>
							${
								team.weeks && team.weeks.length > 0
									? team.weeks
											.map((week: WeekPoints) => `<td>${week.points}</td>`)
											.join('')
									: ''
							}
							${
								team.weeks && team.weeks.length > 0
									? `<td>${team.weeks
											.map((week: WeekPoints) => week.points)
											.reduce((a: number, b: number) => a + b, 0)}</td>`
									: ''
							}
							
						</tr>`;
							})
							.join('')}
					</tbody>
				</table>
			</div>

			<button id="should">Click me</button>
			<a href="/about">Click me</a>
		`;
	}
}

export default Home;
