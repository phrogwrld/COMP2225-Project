class Page {
	constructor() {}

	public render(): string {
		throw new Error(
			`The render method must be implemented in the child class.${this} does not implement it.`
		);
	}

	public getRoot(): HTMLElement {
		const root = document.createElement('div');
		root.innerHTML = this.render();
		return root;
	}
}

export default Page;
