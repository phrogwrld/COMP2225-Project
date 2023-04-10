import Page from '../lib/Page';

class NotFoundPage extends Page {
	constructor() {
		super();
	}

	render(): string {
		return /* HTML */ `
			<div class="flex min-h-screen items-center justify-center bg-black font-sans text-white">
				<div class="text-center">
					<h1 class="text-5xl font-bold">404</h1>
					<p class="text-2xl">Page not found</p>
				</div>
			</div>
		`;
	}
}

export default NotFoundPage;
