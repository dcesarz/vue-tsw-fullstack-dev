//import axios from "axios";
// import router from "../router";
import axios from '../axios';
const state = {
        activeConvos: [{
        }],
};

const getters = {
    activeConvos: state => state.activeConvos,
};
const actions = {
    fetchMessages ({ commit }) {
        return new Promise((resolve, reject) => {
            axios.get(`${location.origin}/api/messages/all`)
                .then((resp) => {
                    console.dir(resp.data);
                    commit("authRefresh", resp.data);
                    resolve(resp);
                })
                .catch((err) => {
                    console.dir(err);
                    commit("authNotLoggedIn");
                    reject(err);
                });
        });
    }

};

const mutations = {
    authRefresh (state, data) {
        state.activeConvos = data.user;
    },
    authNotLoggedIn (state) {
        state.activeConvos = null;
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};
