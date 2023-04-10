import Page from '../lib/Page';
import data from '../data/teams.json';
import Team from '../Team';

import type { TeamData, WeekPoints } from '../types';
import Router from '../lib/Router';

class Members extends Page {
	private teamHandler: Team;
	private router: Router;

	constructor() {
		super();

		this.teamHandler = new Team();
		this.router = new Router(
			document.querySelector<HTMLDivElement>('#app') as HTMLElement
		);
	}

	onMount(): void {
		console.log('Members page mounted');
		console.log(this.params);

		const backBtn = document.querySelector<HTMLButtonElement>(
			'#back'
		) as HTMLButtonElement;
		backBtn.addEventListener('click', () => {
			this.router.goBack();
		});
	}

	beforeRender(): void {
		console.log('Members page before render');
	}

	render() {
		return /* HTML */ `
		<button id="back">Back</button>
			<div
				class="flex min-h-screen items-center justify-center bg-black font-sans text-white"
			>
				<div class="table rounded bg-dark text-center">

							<h1 class="pb-2">Members of SET ${this.params.id}</h1>


							${data
								.map((team, index) => {
									if (team.id === Number(this.params.id)) {
										return team.members
											.map((member, index) => {
												return /* HTML */ `
													<div>
														<p class="pb-5">${team.members[index]}</p>
													</div>
												`;
											})
											.join('');
									}
								})
								.join('')}
						</tr>
					</thead>
				</table>
			</div>
		`;
	}
}

export default Members;
