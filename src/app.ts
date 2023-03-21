import Router from './lib/Router';
import About from './pages/About';
import Test from './pages/ll';

const app = document.getElementById('app') as HTMLElement;
const router = new Router(app);

router.addRoute({
	path: '/',
	component: Test,
});

router.addRoute({
	path: '/about',
	component: About,
});
