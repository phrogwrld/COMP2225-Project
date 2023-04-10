import NotFoundPage from '../../pages/404';

describe('NotFoundPage', () => {
	let notFoundPage: NotFoundPage;

	beforeEach(() => {
		notFoundPage = new NotFoundPage();
		document.body.innerHTML = notFoundPage.render();
	});

	test('renders correctly', () => {
		expect(document.body.querySelector('.text-5xl')!.textContent).toBe('404');
		expect(document.body.querySelector('.text-2xl')!.textContent).toBe('Page not found');
	});
});
