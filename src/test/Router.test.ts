import Router, { Route } from '../lib/Router';
import Page from '../lib/Page';

class MockPage extends Page {
	render() {
		return '<h1>Mock Page</h1>';
	}
}

describe('Router', () => {
	let router: Router;
	let root: HTMLElement;

	beforeEach(() => {
		root = document.createElement('div');
		router = new Router(root);
	});

	describe('addRoute', () => {
		it('should add a new route to the routes array', () => {
			const route: Route = {
				path: '/',
				component: MockPage,
			};

			router.addRoute(route);

			expect(router.getRoutes().length).toBe(1);
			expect(router.getRoutes()[0]).toEqual(route);
		});
	});
});
