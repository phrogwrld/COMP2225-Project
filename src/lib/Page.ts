class Page {
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	state: Record<string, any> = {};
	params: Record<string, string> = {};

	constructor(params?: Record<string, string>) {
		this.state = {};
		this.params = params || {};
	}

	public render(): string {
		throw new Error(
			`The render method must be implemented in the child class.${this} does not implement it.`
		);
	}

	onMount() {}

	beforeRender() {}

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	public setState(newState: Record<string, any>): void {
		this.state = { ...this.state, ...newState };
		const root = document.querySelector<HTMLDivElement>('#app') as HTMLElement;

		root.innerHTML = this.render();
	}
}

export default Page;
