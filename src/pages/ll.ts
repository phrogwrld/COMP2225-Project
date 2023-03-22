import Page from '../lib/Page';

import data from '../data/teams.json';
import Team from '../Team';

class Test extends Page {
	constructor() {
		super();
	}

	// fetchData = async () => {
	// 	const res = await fetch('http://localhost:3000/');
	// 	const data = await res.json();
	// 	return data;
	// };

	// renderData = async () => {
	// 	const data = await this.fetchData();
	// 	let html = '';
	// 	for (const [key, value] of Object.entries(data)) {
	// 		html += `<div>${key}: ${value}</div>`;
	// 	}
	// 	document.querySelector('#data')!.innerHTML = html;
	// };

	render() {
		// this.renderData();
		return `<div
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
          <td>${team.weeks[1]?.points}</td>
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
<p class=" text-red">if data is showing the connection to API is working</p>`;
	}
}

export default Test;
