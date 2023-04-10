import Login from '../lib/LoginAPI';
import Page from '../lib/Page';

class NotFoundPage extends Page {
	constructor() {
		super();
	}

	render(): string {
		const login = new Login();
		return /* HTML */ `
			<div class="flex min-h-screen bg-black font-sans text-white">
				<div class="bg-gray-900 w-24 h-screen">
					<div class="flex flex-col items-center mt-auto text-center">
						<div
							class="rounded-lg border border-gray-200 bg-gray-800 text-white p4 w-20 h-20 mt-4 mb-4 hover:bg-gray-700"
						>
							<a class="text-center mx-auto" href="/">
								<img
									class="w-8 h-8 justify-center items-center mx-auto mt-auto "
									src="/leaderboard_icon.svg"
									alt="leaderboard icon"
								/>
								<span class="text-xs">Leaderboard</span>
							</a>
						</div>
						<div class="rounded-lg border border-gray-200 bg-gray-800 text-white p4 w-20 h-20 mb-4 hover:bg-gray-700">
							<a class="text-center mx-auto" href="${login.isAuthenticated() ? '/dashboard' : '/login'}">
								<img
									class="w-8 h-8 justify-center items-center mx-auto mt-auto "
									src="/dashboard_icon.svg"
									alt="dashboard icon"
								/>
								<span class="text-xs">Dashboard</span>
							</a>
						</div>
						${login.isAuthenticated() ? /* HTML */ ` <button id="logout">Logout</button>` : ''}
					</div>
				</div>
				<div class="flex-1 flex items-center justify-center">
					<div class="text-center">
						<h1 class="text-5xl font-bold">404</h1>
						<p class="text-2xl">Page not found</p>
					</div>
				</div>
			</div>
		`;
	}
}

export default NotFoundPage;
