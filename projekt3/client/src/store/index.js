import Vue from "vue";
import Vuex from "vuex";

import auth from "./authorization";
import chat from "./chat";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        auth,
        chat
    }
});
