import Router from './lib/Router';
import About from './pages/About';
import Home from './pages/Home';
import Login from './pages/Login';
import Members from './pages/Members';
import TestEmptyRender from './pages/TestEmptyRender';
import Yep from './pages/Yep';

const router = new Router(
	document.querySelector<HTMLDivElement>('#app') as HTMLElement
);

router.addRoute({
	path: '/',
	component: Home,
	title: 'Test',
	description: 'Test description',
});

router.addRoute({ path: '/about', component: About });

router.addRoute({ path: '/test', component: TestEmptyRender, title: 'About' });

router.addRoute({ path: '/login', component: Login });

router.addRoute({ path: '/dashboard', component: Yep, auth: true });

router.addRoute({ path: '/members/:id', component: Members });
