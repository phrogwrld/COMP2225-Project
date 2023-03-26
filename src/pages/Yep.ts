import Login from '../lib/LoginAPI';
import Page from '../lib/Page';

class Yep extends Page {
	constructor() {
		super();
	}

	render() {
		return /* HTML */ `<div>Yep Page</div>
			<button id="logout">Logout</button>`;
	}

	onMount() {
		const log = new Login();

		const logoutButton = document.querySelector('#logout') as HTMLButtonElement;
		logoutButton.addEventListener('click', () => {
			log.logout();
		});
	}
}

export default Yep;
