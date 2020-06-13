import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import MyAuctions from '@/components/MyAuctions';
import MyBids from '@/components/MyBids';
import MyHistory from '@/components/MyHistory';
import Register from '@/components/Register';
import Login from '@/components/Login';
import Inbox from '@/components/Inbox';
import AuctionForm from '@/components/AuctionForm';
import Error from '@/components/Error';
import store from "../store";
Vue.use(Router);

const routes = [
  { 
    path: '/', 
    redirect: '/page/1' 
  },
  {
      path: "/page/:page(\\d+)",
      name: "Home",
      component: Home,
      meta: {
        requiresAuth: false
      }
  },
  {
    path: "/my-auctions/page/:page(\\d+)",
    name: "MyAuctions",
    component: MyAuctions,
    meta: {
      requiresAuth: true
    }
},
{
  path: "/my-bids/page/:page(\\d+)",
  name: "MyBids",
  component: MyBids,
  meta: {
    requiresAuth: true
  }
},
{
  path: "/my-history/page/:page(\\d+)",
  name: "MyHistory",
  component: MyHistory,
  meta: {
    requiresAuth: true
  }
},
{
  path: "/inbox",
  name: "Inbox",
  component: Inbox,
  meta: {
    requiresAuth: true
  }
},
  {
    path: "/404",
    name: "Error",
    component: Error,
    meta: {
        requiresAuth: false
      }
  },
  {
      path: "/login",
      name: "Login",
      component: Login,
      meta: {
        requiresAuth: false
      }
  },
  {
      path: "/register",
      name: "Register",
      component: Register,
      meta: {
        requiresAuth: false
      }
  },
  {
      path: "/new",
      name: "AuctionForm",
      component: AuctionForm,
      meta: {
        requiresAuth: true
      }
  },
];

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

const isInRoutes = (name) => {
  const routeNames = [];
  router.options.routes.forEach(route => {
      routeNames.push(route.name);
  });
  return routeNames.includes(name);
};

router.beforeEach((to, from, next) => {
  store.dispatch("fetchCurrentUser").then(res =>{
  if (!isInRoutes(to.name)) {
    next({ name: "Error" });
    return;
  }
  if (to.matched.some(record => record.meta.requiresAuth)){
    console.log(res);
    if(!store.getters.isAuthenticated){
      next('/login');
    } else {
      next();
    }
  }
  else{
    next();
  }
})});
  
export default router;
