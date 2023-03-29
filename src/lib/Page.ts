class Page {
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	state: Record<string, any> = {};
	$root: HTMLElement;

	constructor($root: HTMLElement) {
		this.state = {};
		this.$root = $root;
	}

	public render(): string {
		throw new Error(
			`The render method must be implemented in the child class.${this} does not implement it.`
		);
	}

	onMount() {}

	beforeRender() {}

	public getRoot(): HTMLElement {
		return this.$root;
	}

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	public setState(newState: Record<string, any>): void {
		this.state = { ...this.state, ...newState };
		const root = this.getRoot();

		root.innerHTML = this.render();
		this.onMount();
	}
}

export default Page;
