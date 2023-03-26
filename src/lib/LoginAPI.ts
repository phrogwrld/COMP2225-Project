import { Credentials, User } from '../types';
import '../data/user.json';

class Login {
	constructor() {}

	async authenticate(credentials: Credentials): Promise<User> {
		const res = await fetch('./src/data/user.json');

		const users = await res.json();

		if (!(credentials.username && credentials.password)) {
			throw new Error('Please enter username and password');
		}

		const user = users.find(
			(user: User) => user.username === credentials.username
		);

		if (user && user.password === credentials.password) {
			console.log(user);
			return user;
		} else {
			throw new Error('Invalid username or password');
		}
	}

	isAuthenticated(): boolean {
		return localStorage.getItem('token') !== null;
	}

	login(): void {
		localStorage.setItem('token', '1');
		window.location.href = '/yep';
	}

	logout(): void {
		localStorage.removeItem('token');
		window.location.href = '/';
	}
}

export default Login;
