import Login from '../lib/LoginAPI';
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
		console.log(this.params);
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
		const login = new Login();
		return /* HTML */ `
			<div class="flex min-h-screen bg-black font-sans text-white">
				<nav class="bar2">
					<div class=" w-24 h-screen">
						<div class="flex flex-col items-center mt-auto text-center">
							<div class="text-white p4 h-20 mt-4 mb-4 ">
								<a class="text-center icons" href="/">
									<div class="img-container">
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
									<div class="img-container">
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
					<div class="table rounded bg-dark text-center ">
						<div class="member-table">
							<h1 class="pb-9">Members of SET ${this.params.id}</h1>

							${this.state.team.members
								? this.state.team.members
										.map(
											(member: string) =>
												/* HTML */ ` <div class="flex flex-col items-center justify-center pb-5">${member}</div> `
										)
										.join('')
								: 'Loading...'}
						</div>
					</div>
				</div>
			</div>
		`;
	}
}

export default Members;
