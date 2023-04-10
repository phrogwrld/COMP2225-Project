import Login from '../lib/LoginAPI';
import Page from '../lib/Page';
import data from '../data/teams.json';

class Yep extends Page {
	constructor() {
		super();
	}

	render() {
		const l = data.reduce((prev, curr) =>
			prev.weeks.length > curr.weeks.length ? prev : curr
		);

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
					${data
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((team, index) => {
							return /* HTML */ `<option value="${team.id}">
								${team.name}
							</option>`;
						})
						.join('')}
				</select>
				<div class="pb-4"></div>
				<label class="label">Week</label>
				<select class="input" name="week" id="week">
					${l.weeks
						.map((week, index) => {
							return /* HTML */ `<option value="${week.week}">
								Week ${week.week}
							</option>`;
						})
						.join('')}
				</select>
				<div class="pb-4"></div>
				<label class="label">New Points</label>
				<input type="text" class="input" id="points" placeholder="Search" />

				<div class="pb-4"></div>
				<button class="btn btn-primary">Add points</button>
			</form> `;
	}

	onMount() {
		const log = new Login();

		const logoutButton = document.querySelector('#logout') as HTMLButtonElement;
		logoutButton.addEventListener('click', () => {
			log.logout();
		});

		const team = document.querySelector('#team') as HTMLSelectElement;
		const week = document.querySelector('#week') as HTMLSelectElement;
		const points = document.querySelector('#points') as HTMLInputElement;

		// Default value
		points.value = `${
			data
				.find((team) => team.id === Number(1))
				?.weeks.find((week) => week.week === Number(1))?.points ?? 0
		}`;

		team.addEventListener('change', () => {
			const selectedTeam = team.value;

			const selectedWeek = week.value;

			points.value = `${
				data
					.find((team) => team.id === Number(selectedTeam))
					?.weeks.find((week) => week.week === Number(selectedWeek))?.points ??
				0
			}`;
		});

		week.addEventListener('change', () => {
			const selectedTeam = team.value;

			const selectedWeek = week.value;

			points.value = `${
				data
					.find((team) => team.id === Number(selectedTeam))
					?.weeks.find((week) => week.week === Number(selectedWeek))?.points ??
				0
			}`;
		});
	}
}

export default Yep;
