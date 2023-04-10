import Page from '../../lib/Page';

describe('Page', () => {
	describe('constructor', () => {
		it('initializes state and params properties', () => {
			const page = new Page({ id: '123' });
			expect(page.state).toEqual({});
			expect(page.params).toEqual({ id: '123' });
		});
	});

	describe('render', () => {
		it('throws an error if not implemented in child class', () => {
			const page = new Page();
			expect(() => page.render()).toThrowError(/The render method must be implemented/);
		});
	});

	describe('setState', () => {
		it('merges newState with existing state and updates DOM', () => {
			const root = document.createElement('div');
			root.id = 'app';
			document.body.appendChild(root);

			const page = new Page();
			page.render = jest.fn().mockReturnValue('<div>test</div>');

			page.setState({ message: 'Hello' });
			expect(page.state).toEqual({ message: 'Hello' });
			expect(page.render).toHaveBeenCalled();
			expect(root.innerHTML).toBe('<div>test</div>');

			page.setState({ name: 'John' });
			expect(page.state).toEqual({ message: 'Hello', name: 'John' });
			expect(page.render).toHaveBeenCalled();
			expect(root.innerHTML).toBe('<div>test</div>');

			document.body.removeChild(root);
		});
	});
});
