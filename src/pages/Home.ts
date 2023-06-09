import Login from '../lib/LoginAPI';
import Page from '../lib/Page';

import type { TeamData, WeekPoints } from '../types';

class Home extends Page {
	teamTable: HTMLElement | undefined;

	constructor() {
		super();
		this.state = {
			teams: [] as TeamData[],
			sortColumn: 'total',
			sortOrder: 'asc',
		};
	}

	async onMount(): Promise<void> {
		const log = new Login();
		if (this.state.teams.length === 0) {
			// check if data has already been fetched
			const response = await fetch('http://127.0.0.1:3000/team');
			const teams = await response.json();
			this.setState({ teams, sortColumn: 'total', sortOrder: 'desc' });
			this.sortTeams();
		}

		this.teamTable = document.getElementById('leaderboard') as HTMLElement;
		this.teamTable.addEventListener('click', (event: Event) => {
			if (event.target instanceof HTMLTableCellElement) {
				const headerId = event.target.id;
				if (headerId === 'total' || headerId.startsWith('week')) {
					this.toggleSort(headerId);
					this.sortTeams();
					this.setHeaderHTML(headerId);
				}
			}
		});

		const logoutButton = document.querySelector('#logout') as HTMLButtonElement;
		logoutButton.addEventListener('click', () => {
			log.logout();
		});
	}

	private setHeaderHTML(headerId: string) {
		const sortOrder = this.state.sortOrder;
		const arrow = sortOrder === 'asc' ? '&#8593;' : '&#8595;';
		document.getElementById(headerId)!.innerHTML = `${document
			.getElementById(headerId)
			?.innerHTML.replace('&#8593;', '')} ${arrow}`;
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
				const aTotal = a.weeks.reduce((acc: number, week: WeekPoints) => acc + week.points, 0);
				const bTotal = b.weeks.reduce((acc: number, week: WeekPoints) => acc + week.points, 0);

				return sortOrder === 'asc' ? aTotal - bTotal : bTotal - aTotal;
			});

			this.setState({ teams: sortedTeams });
			this.onMount();
		} else {
			const sortedTeams = [...teams].sort((a: TeamData, b: TeamData) => {
				const weekIndex = parseInt(sortColumn.replace('week', ''), 10) - 1;
				const aPoints = a.weeks[weekIndex]?.points ?? 0;
				const bPoints = b.weeks[weekIndex]?.points ?? 0;

				return sortOrder === 'asc' ? aPoints - bPoints : bPoints - aPoints;
			});
			this.setState({ teams: sortedTeams });
			this.onMount();
		}
	}

	toggleSort(column: string) {
		const { sortColumn, sortOrder } = this.state;

		if (sortColumn === column) {
			this.setState({ sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' });
			this.onMount();
		} else {
			this.setState({ sortColumn: column, sortOrder: 'desc' });
			this.onMount();
		}
	}

	render() {
		let teams: TeamData[] = this.state.teams;

		let maxWeeks = 0;
		teams.forEach((team: TeamData) => {
			if (team.weeks && team.weeks.length > maxWeeks) {
				maxWeeks = team.weeks.length;
			}
		});

		const login = new Login();

		return /* HTML */ `
			<div class=" min-h-screen bg-black font-sans text-white">


			<nav class="bar2">
			<div class=" w-24 h-screen">


				<div class="flex flex-col items-center mt-auto text-center">
					<div
						class="text-white p4 h-20 mt-4 mb-4 "
					>
						<a class="text-center icons" href="/">

						<div class= "img-container">
							<img
								class="w-8 h-8 justify-center items-center mx-auto mt-auto "
								src="/leaderboard_icon.svg"
								alt="leaderboard icon"
							/>
						</div>

							<span class=" nav-item">Leaderboard</span>
						</a>
					</div>
					<div class=" text-white p4  h-20 mb-4 ">
						<a class="icons" href="${login.isAuthenticated() ? '/dashboard' : '/login'}">

						<div class= "img-container">
							<img
								class="w-8 h-8 justify-center items-center mx-auto mt-auto "
								src="/dashboard_icon.svg"
								alt="dashboard icon"
							/>
						</div>


							<span class="nav-item">Dashboard</span>
						</a>
					</div>
					${login.isAuthenticated() ? /* HTML */ ` <button id="logout">Logout</button>` : ''}
				</div>
			</div>
		</nav>

				<div class="flex-1 flex items-center justify-center">

			<main>
			
				<div class= "table-container">
					<table class="table rounded bg-dark" id="leaderboard">
					<h1 class="leaderboard-heading">Leaderboard of Software Engineering Teams</h1>
						<thead>
							<tr>
								<th>RANKING</th>
								<th>Name</th>
								${Array(maxWeeks)
									.fill(null)
									.map((_, index: number) => {
										const weekNumber = `Week ${index + 1}`;

										return `<th id ="week${index + 1}">${weekNumber} </th>`;
									})
									.join('')}
								<th id="total">Total</th>
							</tr>
						</thead>
						<tbody>
							${teams
								.map((team: TeamData, index: number) => {
									const weeks = team.weeks || [];

									return `<tr>
								<td class="flex">${index + 1} ${
										team.change != null &&
										team.change !== 0 &&
										this.state.sortColumn === 'total' &&
										this.state.sortOrder === 'desc'
											? `<span class="flex items-center ml-4">
									<img class="w-8 h-8 mr-2 pt-1" src="${team.change >= 1 ? '/up_arrow.svg' : '/down_arrow.svg'}" alt="${
													team.change >= 1 ? 'up arrow' : 'down arrow'
											  }">
									<span class="text-sm absolute pl-5">${Math.abs(team.change)}</span>
							</span>`
											: ''
									}</td>
							<td class="teams"><a href="/members/${team.id}">${team.name}</a></td>
							${Array(maxWeeks)
								.fill(null)
								.map((_, index: number) => {
									const week = weeks[index] || { points: 0 };
									return `<td><a href="/metrics/${team.id}/${index + 1}">${week.points}</a></td>`;
								})
								.join('')}

							<td>${weeks.reduce((acc: number, week: WeekPoints) => acc + week.points, 0)}</td>
							
						</tr>`;
								})
								.join('')}
						</tbody>
					</table>
				</div>
			<main>
				</div>
			</div>
		`;
	}
}

export default Home;
