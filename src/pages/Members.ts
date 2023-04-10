import Page from '../lib/Page';

import type { TeamData } from '../types';

class Members extends Page {
	constructor() {
		super();
		this.state = {
			team: {} as TeamData,
		};
	}

	async onMount(): Promise<void> {
		if (this.state.teams !== null) {
			// check if data has already been fetched
			const response = await fetch(`http://127.0.0.1:3000/api/team/${Number(this.params.id)}`);
			const team = await response.json();
			this.setState({ team });
		}

		const backBtn = document.querySelector<HTMLButtonElement>('#back') as HTMLButtonElement;
		backBtn.addEventListener('click', () => {
			window.location.href = '/';
		});
	}

	render() {
		return /* HTML */ `
		<button id="back">Back</button>
			<div class="flex min-h-screen items-center justify-center bg-black font-sans text-white">
				<div class="table rounded bg-dark text-center">

							<h1 class="pb-2">Members of SET ${this.params.id}</h1>

							${
								this.state.team.members
									? this.state.team.members
											.map(
												(member: string) =>
													/* HTML */ ` <div class="flex flex-col items-center justify-center pb-5">${member}</div> `
											)
											.join('')
									: 'Loading...'
							}

						</tr>
					</thead>
				</table>
			</div>
		`;
	}
}

export default Members;
