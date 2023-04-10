import Login from '../../lib/LoginAPI';

describe('Login', () => {
	describe('isAuthenticated', () => {
		it('returns true if a token is present in local storage', () => {
			localStorage.setItem('token', '1');
			const login = new Login();
			expect(login.isAuthenticated()).toBe(true);
			localStorage.removeItem('token');
		});

		it('returns false if no token is present in local storage', () => {
			const login = new Login();
			expect(login.isAuthenticated()).toBe(false);
		});
	});

	describe('login', () => {
		it('sets a token in local storage and redirects to /dashboard', () => {
			const login = new Login();
			const spy = jest.spyOn(window.location, 'href', 'set');
			login.login();
			expect(localStorage.getItem('token')).toBe('1');
			expect(spy).toHaveBeenCalledWith('/dashboard');
			spy.mockRestore();
			localStorage.removeItem('token');
		});
	});

	describe('logout', () => {
		it('removes the token from local storage and redirects to /', () => {
			const login = new Login();
			localStorage.setItem('token', '1');
			const spy = jest.spyOn(window.location, 'href', 'set');
			login.logout();
			expect(localStorage.getItem('token')).toBe(null);
			expect(spy).toHaveBeenCalledWith('/');
			spy.mockRestore();
		});
	});
});
