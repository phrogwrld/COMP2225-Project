import Page from '../lib/Page';
import '../styles/tailwind.css';
import '../styles/main.css';

class About extends Page {
	constructor() {
		super();
	}

	render() {
		return /* HTML */ `<div class="text-sm">About Page</div>
			<img src="../../public/up_arrow.svg" class="w-96 h-96" />`;
	}
}

export default About;
