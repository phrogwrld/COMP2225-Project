import Login from '../lib/LoginAPI';
import Page from '../lib/Page';

import { TeamData, WeekPoints } from '../types';

class Dashboard extends Page {
	constructor() {
		super();
		this.state = {
			teams: [] as TeamData[],
		};
	}

	async onMount() {
		const log = new Login();

		if (this.state.teams.length === 0) {
			// check if data has already been fetched
			const response = await fetch('http://127.0.0.1:3000/team');
			const teams = await response.json();
			this.setState({ teams });
		}

		const logoutButton = document.querySelector('#logout') as HTMLButtonElement;
		logoutButton.addEventListener('click', () => {
			log.logout();
		});

		const [team, week, points, volatility, specs, size, faults] = [
			document.querySelector('#team') as HTMLSelectElement,
			document.querySelector('#week') as HTMLSelectElement,
			document.querySelector('#points') as HTMLInputElement,
			document.querySelector('#volatility') as HTMLInputElement,
			document.querySelector('#specs') as HTMLInputElement,
			document.querySelector('#size') as HTMLInputElement,
			document.querySelector('#faults') as HTMLInputElement,
		];

		const { teams } = this.state;

		// Default value

		week.value = `${
			teams.find((team: TeamData) => team.id === 1)?.weeks.find((week: WeekPoints) => week.week === 1)?.week ?? 1
		}`;

		points.value = `${
			teams.find((team: TeamData) => team.id === 1)?.weeks.find((week: WeekPoints) => week.week === 1)?.points ?? 0
		}`;

		volatility.value = `${
			teams
				.find((team: TeamData) => team.id === 1)
				?.weeks.find((week: WeekPoints) => week.week === 1)?.metrics?.requirements_volatility ?? 0
		}`;

		specs.value = `${
			teams
				.find((team: TeamData) => team.id === 1)
				?.weeks.find((week: WeekPoints) => week.week === 1)?.metrics?.spec_docs ?? 0
		}`;

		size.value = `${
			teams
				.find((team: TeamData) => team.id === 1)
				?.weeks.find((week: WeekPoints) => week.week === 1)?.metrics?.size_lines_of_code ?? 0
		}`;

		faults.value = `${
			teams
				.find((team: TeamData) => team.id === 1)
				?.weeks.find((week: WeekPoints) => week.week === 1)?.metrics?.design_faults ?? 0
		}`;

		const updatePoints = () => {
			const selectedTeam = team.value;
			const selectedWeek = week.value;

			points.value = `${
				teams
					.find((team: TeamData) => team.id === Number(selectedTeam))
					?.weeks.find((week: WeekPoints) => week.week === Number(selectedWeek))?.points ?? 0
			}`;

			volatility.value = `${
				teams
					.find((team: TeamData) => team.id === Number(selectedTeam))
					?.weeks.find((week: WeekPoints) => week.week === Number(selectedWeek))?.metrics?.requirements_volatility ?? 0
			}`;

			specs.value = `${
				teams
					.find((team: TeamData) => team.id === Number(selectedTeam))
					?.weeks.find((week: WeekPoints) => week.week === Number(selectedWeek))?.metrics?.spec_docs ?? 0
			}`;

			size.value = `${
				teams
					.find((team: TeamData) => team.id === Number(selectedTeam))
					?.weeks.find((week: WeekPoints) => week.week === Number(selectedWeek))?.metrics?.size_lines_of_code ?? 0
			}`;

			faults.value = `${
				teams
					.find((team: TeamData) => team.id === Number(selectedTeam))
					?.weeks.find((week: WeekPoints) => week.week === Number(selectedWeek))?.metrics?.design_faults ?? 0
			}`;
		};

		team.addEventListener('change', updatePoints);
		week.addEventListener('change', updatePoints);

		team.addEventListener('change', () => {
			const selectedTeam = this.state.teams.find((teams: TeamData) => teams.id === Number(team.value));

			const teamWeeks = selectedTeam?.weeks
				.map((week: WeekPoints) => week.week)
				.map((week: number) => `<option value="${week}">Week ${week}</option>`)
				.join('');

			week.innerHTML = teamWeeks ?? '';
		});

		const addWeek = document.querySelector('#addWeek') as HTMLButtonElement;
		addWeek.addEventListener('click', async (e) => {
			e.preventDefault();

			const selectedTeam = team.value;
			const selectedWeek = parseInt(week.value);

			const nextWeek = selectedWeek + 1;
			const teamIndex = teams.findIndex((team: TeamData) => team.id === parseInt(selectedTeam));

			if (teams[teamIndex].weeks.some((week: WeekPoints) => week.week === nextWeek)) {
				alert(`Week ${nextWeek} already exists for this team`);
				return;
			}

			teams[teamIndex].weeks.push({ week: nextWeek, points: 0 });

			const teamWeeks = teams[teamIndex].weeks
				.map((week: WeekPoints) => `<option value="${week.week}">Week ${week.week}</option>`)
				.join('');

			week.innerHTML = teamWeeks;

			const weekOption = week.querySelector(`option[value="${nextWeek}"]`) as HTMLOptionElement;
			weekOption.selected = true;

			fetch(`http://localhost:3000/api/team/${selectedTeam}/week/${nextWeek}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					points: 0,
					metrics: {
						requirements_volatility: 0,
						spec_docs: 0,
						size_lines_of_code: 0,
						design_faults: 0,
					},
				}),
			});
		});

		const submitButton = document.querySelector('#submitPoints') as HTMLButtonElement;
		submitButton.addEventListener('click', async (e) => {
			e.preventDefault();

			const selectedTeam = team.value;
			const selectedWeek = week.value;
			const metrics = {
				requirements_volatility: Number(volatility.value),
				spec_docs: Number(specs.value),
				size_lines_of_code: Number(size.value),
				design_faults: Number(faults.value),
			};

			const response = await fetch(`http://localhost:3000/api/team/${selectedTeam}/week/${selectedWeek}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(metrics),
			});

			if (response.status === 200) {
				alert('Points updated!');
				this.render();
			} else {
				alert('Something went wrong');
			}
		});
	}

	render() {
		const { teams } = this.state;
		const login = new Login();
		const teamOptions = teams
			.sort((a: { name: string }, b: { name: any }) => a.name.localeCompare(b.name))
			.map((team: { id: any; name: any }) => {
				return /* HTML */ ` <option value="${team.id}">${team.name}</option>`;
			})
			.join('');

		return /* HTML */ `
		<div class="flex flex-row h-screen">
		<nav>
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
			
			<div class="flex flex-col flex-1 main">
				<form action="">
					<div class="flex flex-1 p-20">
						<h1 class="title">Add Points To A Team</h1>
						<div class="mt-6>
						<div class="pb-4"></div>
					</div>
					<label class="label">Team</label>
					<select class="input" name="team" id="team">
						${teamOptions}
					</select>
					<div class="pb-4"></div>
					<label class="label">Week</label>
					<select class="input" name="week" id="week">
					
						${[...new Set(teams.flatMap((team: TeamData) => team.weeks.map((week) => week.week)))]
							.map((week) => {
								return /* HTML */ `<option value="${week}">Week ${week}</option>`;
							})
							.join('')}

					</select>
				
					<div class="pb-4"></div>
					<button class="btn btn-week" id="addWeek">Add Week</button>

					<div class="pb-4"></div>
					<label class="label">Requirements Volatility</label>
					<input type="text" class="input" name="volatility" id="volatility" />
                    
					<div class="pb-4"></div>
					<label class="label">Number of Pages in Specification Document</label>
					<input type="text" class="input" name="specs" id="specs" />
				
          <div class="pb-4"></div>
					<label class="label">Size-Standard Lines of Code</label>
					<input type="text" class="input" name="size" id="size"  />
            
            <div class="pb-4"></div>
					<label class="label">Quality-No of Design Faults</label>
					<input type="text" class="input" name="faults" id="faults"  />

					<div class="pb-4"></div>
					<label class="label">Points</label>
					<input type="text" class="input" id="points" placeholder="Search" disabled/>
					

					<div class="pb-4"></div>
					<button id="submitPoints" class="btn btn-primary">Add points</button>
				</form>
				</div>
			</div>
		</div>
		`;
	}
}

export default Dashboard;
