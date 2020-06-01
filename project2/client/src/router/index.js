import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Register from '@/components/Register';
import Login from '@/components/Login';
import store from "../store";

Vue.use(Router);

const routes = [
  {
    path: '/Home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/Register',
    name: 'Register',
    component: Register,
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

// TODO register should not be reachable by logged user
router.beforeEach((to, from, next) => {
  store.dispatch("fetchCurrentUser");
  // console.log("Route " + to.path + " is " + isInRoutes(to.name));
  if (to.name === "Error404") {
      // next({ name: "Error404" }); DONT (Infinite recursion)
  } else if (!isInRoutes(to.name)) {
      console.log("Error 404");
      next({ name: "Error404" });
  } else if (to.name === "Register" || to.name === "Home") {
      next();
  } else if (to.name !== "Login" && !store.getters.currentUser.isAuth) {
      console.log("Not logged in. Redirecting to login page");
      next({ name: "Login" });
  } else if (to.name === "Login" && store.getters.currentUser.isAuth) {
      console.log("Logged in. Redirecting to home page");
      next({ name: "Home" });
  } else {
      // console.log("Other");
      next();
  }
});

export default router;
