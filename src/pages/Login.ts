import Page from '../lib/Page';
import { Credentials } from '../types';
import LoginAPI from '../lib/LoginAPI';

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

			const login = new LoginAPI();
			fetch('http://127.0.0.1:3000/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(loginData),
			})
				.then((res) => {
					if (res.status === 200) {
						return res.json();
					} else {
						throw new Error('Invalid username or password');
					}
				})
				.then((data) => {
					console.log(data);
					login.login();
				})
				.catch((err) => {
					console.log(err);
				});

			// login
			// 	.authenticate(loginData)
			// 	.then((user) => {
			// 		console.log(user);
			// 		login.login();
			// 	})
			// 	.catch((err) => {
			// const errorMessage = document.querySelector('#error') as HTMLDivElement;
			// errorMessage.classList.remove('hidden');
			// errorMessage.classList.add('block');
			// errorMessage.classList.add('text-red-500');
			// errorMessage.classList.add('text-sm');
			// errorMessage.classList.add('font-bold');
			// errorMessage.classList.add('mb-4');
			// errorMessage.classList.add('text-center');
			// errorMessage.classList.add('border');
			// errorMessage.classList.add('border-red-500');
			// errorMessage.classList.add('rounded');
			// errorMessage.classList.add('p-4');
			// errorMessage.classList.add('bg-red-100');
			// errorMessage.classList.add('w-full');
			// errorMessage.classList.add('max-w-xs');
			// errorMessage.classList.add('mx-auto');
			// errorMessage.classList.add('mt-6');
			// Add error message to bottom of login page
			// errorMessage.textContent = err.message;
			// console.log(err);
			// 	});
		});
	}

	beforeRender(): void {
		if (window.localStorage.getItem('token')) {
			window.location.href = '/dashboard';
		}
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
