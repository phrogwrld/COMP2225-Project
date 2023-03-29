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

	public getRoot(): HTMLElement {
		const root = document.createElement('div');
		root.innerHTML = this.render();
		return root;
	}

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	public setState(newState: Record<string, any>): void {
		this.state = { ...this.state, ...newState };
		this.render();
	}
}

export default Page;
