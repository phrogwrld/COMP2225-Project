import Page from '../lib/Page';
import { Credentials } from '../types';

class Login extends Page {
	constructor() {
		super();
	}

	onMount(): void {
		const form = document.querySelector('form') as HTMLFormElement;

		form.addEventListener('submit', (e) => {
			e.preventDefault();

			const loginData: Credentials = {
				username: (document.querySelector('#username') as HTMLInputElement)
					.value,
				password: (document.querySelector('#password') as HTMLInputElement)
					.value,
			};

			console.log(loginData);
		});
	}

	render() {
		return /* HTML */ `
			<div
				class="flex min-h-screen items-center justify-center bg-black font-sans text-white"
			>
				<div class="w-full max-w-xs">
					<form class="bg-dark shadow-md rounded px-8 pt-6 pb-8 mb-4">
						<div class="mb-4">
							<label
								class="block text-white text-sm font-bold mb-2"
								for="username"
							>
								Username
							</label>
							<input
								class="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
								id="username"
								type="text"
								placeholder="Username"
							/>
						</div>
						<div class="mb-6">
							<label
								class="block text-white text-sm font-bold mb-2"
								for="password"
							>
								Password
							</label>
							<input
								class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline"
								id="password"
								type="password"
								placeholder="Password"
							/>
						</div>
						<div class="flex items-center justify-between">
							<button
								class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
								type="submit"
							>
								Sign In
							</button>
						</div>
					</form>
				</div>
			</div>
		`;
	}
}

export default Login;
