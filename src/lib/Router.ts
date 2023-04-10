import type { Route } from '../types';
/**
 *A class that handles client-side routing.
 *@class Router
 */
class Router {
	/**
		An array of routes.
		@private
		@type {Route[]}
	*/
	private routes: Route[];

	/**
		The root element to render components.
		@type {HTMLElement}
	*/
	private readonly $root: HTMLElement;

	/**
	Creates a new Router instance.
	@param {HTMLElement} $root - The root element to render components.
	*/
	constructor($root: HTMLElement) {
		this.routes = [];
		this.$root = $root;

		window.onpopstate = () => {
			this.navigate(window.location.pathname, true);
		};

		document.addEventListener('DOMContentLoaded', () => {
			this.navigate(window.location.pathname, true);
		});
	}

	/**
		Adds a new route.
		@method addRoute
		@param {Route} route - The route object to add.
	*/
	addRoute(route: Route) {
		this.routes.push(route);
	}

	/**
	 * Removes a route.
	 * @method removeRoute
	 * @param {Route} route - The route object to remove.
	 */
	removeRoute(route: Route) {
		this.routes = this.routes.filter((r) => r !== route);
	}

	/**
	 * Navigate to the specified path and render the matching component if authorized, otherwise render a 404 page.
	 * @param {string} pathname - The path to navigate to.
	 * @param {boolean} push - Whether to push the new path to the browser's history or not.
	 * @returns {void}
	 */
	navigate(pathname: string, push: boolean): void {
		if (push) {
			window.history.pushState({}, '', pathname);
		}

		const path = new URL(pathname, window.location.origin);
		const matchedRoute = this.matchRoute(path);

		if (matchedRoute && this.checkAuth(matchedRoute)) {
			const { component, title, description } = matchedRoute;
			const params = this.getParams(matchedRoute, path.pathname);
			const page = new component(this.$root);
			page.params = params;
			this.$root.innerHTML = page.render();
			document.title = title || 'SET Leaderboard';
			document.querySelector('meta[name="description"]')!.setAttribute('content', description || '');

			document.querySelectorAll<HTMLAnchorElement>('a').forEach((a) => {
				a.addEventListener('click', (e) => {
					e.preventDefault();
					const href = a.getAttribute('href');
					if (href && href !== window.location.pathname) {
						this.navigate(href, true);
					}
				});
			});

			page.onMount();
		} else {
			this.navigate('/404', false);
		}
	}

	getParams(route: Route, pathname: String): Record<string, string> {
		const params: Record<string, string> = {};
		const pattern = new RegExp(`^${route.path.replace(/:[^\s/]+/g, '([\\w-]+)')}$`);
		const matches = pathname.match(pattern);
		if (matches) {
			route.path.split('/').forEach((part, i) => {
				if (part.startsWith(':')) {
					const key = part.slice(1);
					params[key] = matches[i - 1] ?? `:${key}`;
				}
			});
		}
		return params;
	}

	/**
	 * Finds a matching route for a given path.
	 * @private
	 * @method matchRoute
	 * @param {URL} path - The path to match.
	 * @returns {Route} The matching route or undefined if no match is found.
	 */
	private matchRoute(path: URL): Route | undefined {
		for (const route of this.routes) {
			const pattern = new RegExp(`^${route.path.replace(/:[^\s/]+/g, '([\\w-]+)')}$`);
			const match = path.pathname.match(pattern);
			if (match && match[0] === path.pathname) {
				const paramNames = route.path
					.split('/')
					.filter((part) => part.startsWith(':'))
					.map((part) => part.slice(1));

				const params = match.slice(1).reduce((acc, val, i) => {
					const key = paramNames[i];
					if (key) acc[key] = val;
					return acc;
				}, {} as Record<string, string>);

				return {
					...route,
					params,
				};
			}
		}
		return undefined;
	}

	/**
	 * Returns an array of all registered routes.
	 * @returns {Route[]} An array of all registered routes.
	 */
	public getRoutes(): Route[] {
		return this.routes;
	}

	/**
	 * Checks whether the user is authenticated to access the given route. If the route requires
	 * authentication and the user is not authenticated, it will navigate to the login page.
	 * @param {Route} route - The route to check authentication for.
	 * @returns {boolean} `true` if the user is authenticated or if the route does not require
	 * authentication. `false` if the route requires authentication and the user is not authenticated.
	 */
	private checkAuth(route: Route): boolean {
		if (route.auth && !this.isAuthenticated()) {
			this.navigate('/login', false);
			return false;
		}
		return true;
	}

	/**
	 * Checks whether the user is authenticated by checking for a token in local storage.
	 * @returns {boolean} `true` if the user is authenticated (i.e., there is a token in local storage).
	 * `false` otherwise.
	 */
	private isAuthenticated(): boolean {
		return !!localStorage.getItem('token');
	}

	/**
	 * Navigate back to the previous page in the history.
	 * @returns {void}
	 */
	goBack(): void {
		window.history.back();
	}
}

export default Router;
