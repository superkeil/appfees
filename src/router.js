import VueRouter from 'vue-router'
import Home from './pages/Home'
import Repas from './pages/Repas'
import Metro from './pages/Metro'
import Taxi from './pages/Taxi'
import Peage from './pages/Peage'
import Gasoil from './pages/Gasoil'

const routes = [
	{ name: 'home', path: '/', component: Home },
    { name: 'repas', path: '/repas', component: Repas },
    { name: 'gasoil', path: '/carburant', component: Gasoil },
    { name: 'peage', path: '/peage', component: Peage },
    { name: 'taxi', path: '/taxi', component: Taxi },
    { name: 'metro', path: '/transports-en-commun', component: Metro },
]

const router = new VueRouter({
	routes
})

export default router

