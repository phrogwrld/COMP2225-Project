import './styles/tailwind.css';
import './styles/main.css';

import data from './data/teams.json';
import Team from './Team';

// const table = document.getElementById('leaderboard') as HTMLTableElement;

// const headerRow = table.createTHead().insertRow();
// for (const key in data[0]) {
// 	const cell = headerRow.insertCell();
// 	cell.innerHTML = key;
// }

// data.forEach((team) => {
// 	const row = table.insertRow();
// 	for (const key in team) {
// 		const cell = row.insertCell();
// 		cell.textContent = team[key] as string;
// 	}
// });

const fetchData = async () => {
	const res = await fetch('http://localhost:3000/');
	const data = await res.json();
	return data;
};

const renderData = async () => {
	const data = await fetchData();
	let html = '';
	for (const [key, value] of Object.entries(data)) {
		html += `<div>${key}: ${value}</div>`;
	}
	document.querySelector('#data')!.innerHTML = html;
};

renderData();

const oopp = () => {
	document.querySelector<HTMLButtonElement>('#submit')!.addEventListener(
		'click',
		() => {
			const id = document.querySelector<HTMLInputElement>('#inputid')!.value;
			const score =
				document.querySelector<HTMLInputElement>('#inputscore')!.value;

			const tid = parseInt(id);
			const tscore = parseInt(score);

			const t = new Team('./src/data/teams.json');
			t.setTeamSETPoints(tid, tscore);
			const prevmap = t.cachePoints();

			t.generateRanking();

			const currmap = t.cachePoints();
		},
		false
	);
};

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div
	class="flex min-h-screen items-center justify-center bg-black font-sans text-white"
>
	<table class="table rounded bg-dark text-left" id="leaderboard">
		<thead>
			<tr>
				<th
					>RANKiNg</th
				>
				<th
					>Name</th
				>
				<th
					>Points</th
				>
			</tr>
		</thead>
		<tbody>
      ${data
				.map((team, index) => {
					return `<tr>
          <td>${index + 1} arrow&positonal_change</td>
          <td>${team.name}</td>
          <td>${team.points}</td>
          </tr>`;
				})
				.join('')}
		</tbody>
	</table>
</div>
<div class="flex items-center justify-center pt-20" >
 <form>
      <input class="input" id="inputid"><input class="input" id="inputscore">
      <button class="button" id="submit">Submit</button>
 </form>
</div>
<div id="data"></div> 
<p class=" text-red">if data is showing the connection to API is working</p>
`;

export {};
