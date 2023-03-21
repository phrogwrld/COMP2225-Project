import Page from '../lib/Page';
import '../styles/tailwind.css';
import '../styles/main.css';

class About extends Page {
	constructor() {
		super();
	}

	render() {
		// rome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
		return `<div>About Page</div>`;
	}
}

export default About;
