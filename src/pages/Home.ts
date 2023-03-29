import Page from '../lib/Page';
import data from '../data/teams.json';
import Team from '../Team';

import type { TeamData } from '../types';

class Home extends Page {
	private teamHandler;

	constructor() {
		super(document.querySelector<HTMLDivElement>('#app') as HTMLElement);
		this.state = {
			teams: data as unknown as TeamData[],
			sortColumn: 'total',
			sortOrder: 'asc',
		};

		this.teamHandler = new Team();
	}

	onMount(): void {
		console.log('Home pages mounted');
		console.log(this.state);

		const totalHeader = document.getElementById(
			'total'
		) as HTMLTableCellElement;
		totalHeader.addEventListener('click', () => {
			this.toggleSort('total');
			this.render();
			console.log(this.render());
			this.sortTeams();
		});

		// this.state.teams[0].weeks.forEach((_: TeamData, index: number) => {
		// 	const weekColumnId = `week${index + 1}`;

		// 	const weekHeader = document.getElementById(
		// 		weekColumnId
		// 	) as HTMLTableCellElement;
		// 	weekHeader.addEventListener('click', () => {
		// 		this.toggleSort(weekColumnId);
		// 		this.render();
		// 		this.sortTeams();
		// 	});
		// });

		// rome-ignore lint/style/noNonNullAssertion: <explanation>
		document.getElementById('should')!.addEventListener('click', this.tsss);

		// rome-ignore lint/style/noNonNullAssertion: <explanation>
		document.getElementById('total')!.addEventListener('click', () => {
			this.toggleSort('total');
			if (this.state.sortOrder === 'asc') {
				// rome-ignore lint/style/noNonNullAssertion: <explanation>
				document.getElementById('total')!.innerHTML = 'Total &#8593;';
			} else if (this.state.sortOrder === 'desc') {
				// rome-ignore lint/style/noNonNullAssertion: <explanation>
				document.getElementById('total')!.innerHTML = 'Total &#8595;';
			} else {
				// rome-ignore lint/style/noNonNullAssertion: <explanation>
				document.getElementById('total')!.innerHTML = 'Total';
			}
		});
	}

	sortTeams() {
		const { teams, sortColumn, sortOrder } = this.state;

		if (sortColumn === 'total') {
			console.log('Sorting by total');

			const sortedTeams = [...teams].sort((a, b) => {
				const aTotal = a.weeks.reduce(
					// rome-ignore lint/suspicious/noExplicitAny: <explanation>
					(acc: any, week: { points: any }) => acc + week.points,
					0
				);
				const bTotal = b.weeks.reduce(
					// rome-ignore lint/suspicious/noExplicitAny: <explanation>
					(acc: any, week: { points: any }) => acc + week.points,
					0
				);

				if (sortOrder === 'asc') {
					return aTotal < bTotal ? -1 : 1;
				} else {
					return aTotal > bTotal ? -1 : 1;
				}
			});

			this.setState({ teams: sortedTeams });

			// this.getRoot().innerHTML = this.render();

			console.log(sortedTeams);

			// this.teamHandler.addPoints(1, 1000);
			// console.log(this.teamHandler.getTeamData(1));
			// this.setState({ teams: this.teamHandler.getAllTeamsData() });
			// console.log(this.state);
			// const sortedTeams = teams;
			// // const sortedTeams = [...teams].sort((a, b) => {
			// // 	if (sortOrder === 'asc') {
			// // 		return a[sortColumn] < b[sortColumn] ? -1 : 1;
			// // 	} else {
			// // 		return a[sortColumn] > b[sortColumn] ? -1 : 1;
			// // 	}
			// // });

			// this.setState({ teams: sortedTeams });
		} else {
			const sortedTeams = [...teams].sort((a, b) => {
				const weekIndex = parseInt(sortColumn.replace('Week ', ''), 10) - 1;
				const aPoints = a.weeks[weekIndex]?.points ?? 0;
				const bPoints = b.weeks[weekIndex]?.points ?? 0;

				if (sortOrder === 'asc') {
					return aPoints < bPoints ? -1 : 1;
				} else {
					return aPoints > bPoints ? -1 : 1;
				}
			});

			this.setState({ teams: sortedTeams });
		}

		console.log(this.state);
	}

	toggleSort(column: string) {
		const { sortColumn, sortOrder } = this.state;

		if (sortColumn === column) {
			this.setState({ sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' });
		} else {
			this.setState({ sortColumn: column, sortOrder: 'asc' });
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
								// rome-ignore lint/suspicious/noExplicitAny: <explanation>
								.map((team: { weeks: any[] }, index: number) => {
									if (index === 0 && team.weeks && team.weeks.length > 0) {
										return (
											team.weeks
												// rome-ignore lint/suspicious/noExplicitAny: <explanation>
												.map((week: any, index: number) => {
													const weekNumber = `Week ${index + 1}`;

													return `<th>${weekNumber} ${
														sortColumn === weekNumber && sortOrder === 'asc'
															? '▲'
															: sortColumn === weekNumber &&
															  sortOrder === 'desc'
															? '▼'
															: ''
													}</th>`;
												})
												.join('')
										);
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
							// rome-ignore lint/suspicious/noExplicitAny: <explanation>
							.map((team: { name: string; weeks: any[] }, index: number) => {
								return `<tr>
							<td>${index + 1}</td>
							<td>${team.name}</td>
							${
								team.weeks && team.weeks.length > 0
									? team.weeks
											.map(
												(week: { points: number }) => `<td>${week.points}</td>`
											)
											.join('')
									: ''
							}
							${
								team.weeks && team.weeks.length > 0
									? `<td>${team.weeks
											.map((week: { points: number }) => week.points)
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
		`;
	}
}

export default Home;