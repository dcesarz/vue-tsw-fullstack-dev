import Vue from "vue";
import Vuelidate from 'vuelidate'
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

Vue.use(Vuelidate);

//const { required, minValue } = window.validators

new Vue({
    router,
    store,
    render: function (h) {
        return h(App);
    },
    }).$mount("#app");

