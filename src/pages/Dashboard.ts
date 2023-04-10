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

		const [team, week, points] = [
			document.querySelector('#team') as HTMLSelectElement,
			document.querySelector('#week') as HTMLSelectElement,
			document.querySelector('#points') as HTMLInputElement,
		];

		const { teams } = this.state;

		// Default value

		week.value = `${
			teams
				.find((team: TeamData) => team.id === 1)
				?.weeks.find((week: WeekPoints) => week.week === 1)?.week ?? 1
		}`;

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
			const selectedTeam = this.state.teams.find(
				(teams: TeamData) => teams.id === Number(team.value)
			);

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
			const teamIndex = teams.findIndex(
				(team: TeamData) => team.id === parseInt(selectedTeam)
			);

			if (
				teams[teamIndex].weeks.some(
					(week: WeekPoints) => week.week === nextWeek
				)
			) {
				alert(`Week ${nextWeek} already exists for this team`);
				return;
			}

			teams[teamIndex].weeks.push({ week: nextWeek, points: 0 });

			const teamWeeks = teams[teamIndex].weeks
				.map(
					(week: WeekPoints) =>
						`<option value="${week.week}">Week ${week.week}</option>`
				)
				.join('');

			week.innerHTML = teamWeeks;

			const weekOption = week.querySelector(
				`option[value="${nextWeek}"]`
			) as HTMLOptionElement;
			weekOption.selected = true;

			fetch(`http://localhost:3000/api/team/${selectedTeam}/week/${nextWeek}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ points: 0 }),
			});
		});

		const submitButton = document.querySelector(
			'#submitPoints'
		) as HTMLButtonElement;
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
		const { teams } = this.state;
		const teamOptions = teams
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
							teams.flatMap((team: TeamData) =>
								team.weeks.map((week) => week.week)
							)
						),
					]
						.map((week) => {
							return /* HTML */ `<option value="${week}">Week ${week}</option>`;
						})
						.join('')}
				</select>
				<button class="btn pl-2" id="addWeek">Add Week</button>
				<div class="pb-4"></div>
				<label class="label">New Points</label>
				<input type="text" class="input" id="points" placeholder="Search" />

				<div class="pb-4"></div>
				<button id="submitPoints" class="btn btn-primary">Add points</button>
			</form> `;
	}
}

export default Dashboard;
