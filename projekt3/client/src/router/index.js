import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Register from '@/components/Register';
import Login from '@/components/Login';
// import MyBids from '@/components/Login';
// import MyAuctions from '@/components/Login';
import AuctionForm from '@/components/AuctionForm';
// import Convos from '@/components/Convos';
import Error from '@/components/Error';
import store from "../store";
Vue.use(Router);

const routes = [
  {
      path: "/",
      name: "Home",
      component: Home,
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
//   {
//       path: "/my-bids/page/:page(\\d+)",
//       name: "MyBids",
//       component: MyBids
//   },
//   {
//       path: "/my-auctions/page/:page(\\d+)",
//       name: "MyAuctions",
//       component: MyAuctions
//   },
//   {
//       path: "/my-history/page/:page(\\d+)",
//       name: "MyHistory",
//       component: function () {
//           return import("../components/MyHistory.vue");
//       }
//   },
  {
      path: "/new",
      name: "AuctionForm",
      component: AuctionForm,
      meta: {
        requiresAuth: true
      }
  },
//   {
//       path: "/convos",
//       name: "Convos",
//       component: Convos
//   }
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
  

// TODO register should not be reachable by logged user
// router.beforeEach((to, from, next) => {
//   store.dispatch("fetchCurrentUser");
//   // console.log("Route " + to.path + " is " + isInRoutes(to.name));
//   if (to.name === "Error") {
//       // next({ name: "Error404" }); DONT (Infinite recursion)
//   } else if (!isInRoutes(to.name)) {
//       console.log("Error 404");
//       next({ name: "Error" });
//   } else if (to.name === "Register" || to.name === "Home") {
//       next();
//   } else if (to.name !== "Login" && !store.getters.currentUser.isAuth) {
//       console.log("Not logged in. Redirecting to login page");
//       next({ name: "Login" });
//   } else if (to.name === "Login" && store.getters.currentUser.isAuth) {
//       console.log("Logged in. Redirecting to home page");
//       next({ name: "Home" });
//   } else {
//       // console.log("Other");
//       next();
//   }
// });

export default router;
