class Page {
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	state: Record<string, any> = {};

	constructor() {
		this.state = {};
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
		this.onMount();
	}
}

export default Page;
