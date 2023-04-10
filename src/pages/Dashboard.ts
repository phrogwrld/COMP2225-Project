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

		const logoutButton = document.querySelector('#logout') as HTMLButtonElement;
		logoutButton.addEventListener('click', () => {
			log.logout();
		});

		if (this.state.teams.length === 0) {
			// check if data has already been fetched
			const response = await fetch('http://127.0.0.1:3000/team');
			const teams = await response.json();
			this.setState({ teams });
		}

		console.log(this.state.teams);

		const [team, week, points] = [
			document.querySelector('#team') as HTMLSelectElement,
			document.querySelector('#week') as HTMLSelectElement,
			document.querySelector('#points') as HTMLInputElement,
		];

		const { teams } = this.state;

		// Default value
		points.value = `${
			teams
				.find((team: TeamData) => team.id === 1)
				?.weeks.find((week: WeekPoints) => week.week === 1)?.points ?? 0
		}`;

		const updatePoints = () => {
			const selectedTeam = team.value;
			const selectedWeek = week.value;

			points.value = `${
				teams
					.find((team: TeamData) => team.id === Number(selectedTeam))
					?.weeks.find((week: WeekPoints) => week.week === Number(selectedWeek))
					?.points ?? 0
			}`;
		};

		team.addEventListener('change', updatePoints);
		week.addEventListener('change', updatePoints);

		team.addEventListener('change', () => {
			const selectedTe = team.value;

			const selectedTeam = this.state.teams.find(
				(team: TeamData) => team.id === Number(selectedTe)
			);

			if (selectedTeam) {
				const teamWeeks = selectedTeam.weeks
					.map((week: WeekPoints) => week.week)
					.map(
						(week: number) => `<option value="${week}">Week ${week}</option>`
					)
					.join('');

				week.innerHTML = teamWeeks;
			} else {
				week.innerHTML = '';
			}
		});

		const submitButton = document.querySelector('#submit') as HTMLButtonElement;
		submitButton.addEventListener('click', async (e) => {
			e.preventDefault();

			const selectedTeam = team.value;
			const selectedWeek = week.value;
			const newPoints = points.value;

			const response = await fetch(
				`http://localhost:3000/api/team/${selectedTeam}/week/${selectedWeek}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ points: Number(newPoints) }),
				}
			);

			if (response.status === 200) {
				alert('Points updated!');
				this.render();
			} else {
				alert('Something went wrong');
			}
		});
	}

	render() {
		const teamOptions = this.state.teams
			.sort((a: { name: string }, b: { name: any }) =>
				a.name.localeCompare(b.name)
			)
			.map((team: { id: any; name: any }) => {
				return /* HTML */ ` <option value="${team.id}">${team.name}</option>`;
			})
			.join('');

		return /* HTML */ `<div>Dashboard Page</div>
			<button id="logout">Logout</button>

			<form action="">
				<div class="flex flex-1 p-20">
					<h1 class="pb-2">Add points to a team</h1>
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
					${[
						...new Set(
							this.state.teams.flatMap((team: TeamData) =>
								team.weeks.map((week) => week.week)
							)
						),
					]
						.map((week, index) => {
							console.log(week);
							return /* HTML */ `<option value="${week}">Week ${week}</option>`;
						})
						.join('')}
				</select>
				<div class="pb-4"></div>
				<label class="label">New Points</label>
				<input type="text" class="input" id="points" placeholder="Search" />

				<div class="pb-4"></div>
				<button id="submit" class="btn btn-primary">Add points</button>
			</form> `;
	}
}

export default Dashboard;
