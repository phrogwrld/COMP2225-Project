import Page from '../lib/Page';
import data from '../data/teams.json';
import Team from '../Team';

import type { TeamData, WeekPoints } from '../types';

class Members extends Page {
	private teamHandler: Team;

	constructor() {
		super();

		this.teamHandler = new Team();
	}

	onMount(): void {
		console.log('Members page mounted');
		console.log(this.params);
	}

	beforeRender(): void {
		console.log('Members page before render');
	}

	render() {
		return `
      <h1>Members ${this.params.id}</h1>

      ${data
				.map((team, index) => {
					if (team.id === Number(this.params.id)) {
						return team.members
							.map((member, index) => {
								return /* HTML */ `
									<div>
										<p>${team.members[index]}</p>
									</div>
								`;
							})
							.join('');
					}
				})
				.join('')}
    `;
	}
}

export default Members;
