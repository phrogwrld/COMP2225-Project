import Page from './Page';

export interface Route {
	path: string;
	component: new () => Page;
	title?: string;
	description?: string;
	children?: Route[];
}

class Router {
	private routes: Route[];
	$root: HTMLElement;

	constructor($root: HTMLElement) {
		this.routes = [];
		this.$root = $root;

		document.addEventListener('DOMContentLoaded', () => {
			this.navigate(window.location.pathname, false);
		});

		window.onpopstate = () => {
			console.log(window.location.pathname);
			this.navigate(window.location.pathname, false);
		};
	}

	addRoute(route: Route) {
		this.routes.push(route);
	}

	removeRoute(route: Route) {
		this.routes = this.routes.filter((r) => r !== route);
	}

	navigate(pathname: string, push: boolean) {
		if (push) {
			window.history.pushState({}, '', pathname);
		}

		const path = new URL(pathname, window.location.origin);
		const matchedRoute = this.matchRoute(path);

		if (matchedRoute) {
			const { component, title, description } = matchedRoute;
			const page = new component();
			this.$root.innerHTML = page.render();
			document.title = title || 'T';
			document
				.querySelector('meta[name="description"]')!
				.setAttribute('content', description || '');
		} else {
			// Add a 404 page later
			this.$root.innerHTML = '404';
		}
	}

	private matchRoute(path: URL): Route | undefined {
		for (const route of this.routes) {
			if (route.path === path.pathname) {
				return route;
			}
		}
		return undefined;
	}

	public getRoutes(): Route[] {
		return this.routes;
	}
}

export default Router;
