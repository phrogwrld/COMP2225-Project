import Router from './lib/Router';
import Home from './pages/Home';
import Login from './pages/Login';
import Members from './pages/Members';
import Dashboard from './pages/Dashboard';
import NotFoundPage from './pages/404';

import './styles/main.css';
import './styles/tailwind.css';

const router = new Router(document.querySelector<HTMLDivElement>('#app') as HTMLElement);

router.addRoute({
	path: '/',
	component: Home,
	title: 'SET Leaderboard | Home',
	description: 'The official SET Leaderboard',
});

router.addRoute({ path: '/404', component: NotFoundPage, title: 'SET Leaderboard | 404' });

router.addRoute({ path: '/login', component: Login, title: 'SET Leaderboard | Login' });

router.addRoute({ path: '/dashboard', component: Dashboard, auth: true, title: 'SET Leaderboard | Dashboard' });

router.addRoute({ path: '/members/:id', component: Members, title: 'SET Leaderboard | Members' });
