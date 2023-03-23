import Router from './lib/Router';
import About from './pages/About';
import Test from './pages/ll';
import Login from './pages/Login';
import TestEmptyRender from './pages/TestEmptyRender';

const app = document.querySelector<HTMLDivElement>('#app') as HTMLElement;
const router = new Router(app);

router.addRoute({
	path: '/',
	component: Test,
	title: 'Test',
	description: 'Test description',
});

router.addRoute({ path: '/about', component: About });

router.addRoute({ path: '/test', component: TestEmptyRender, title: 'About' });

router.addRoute({ path: '/login', component: Login });
