//import axios from "axios";
// import router from "../router";
import axios from '../axios';
const state = {
        user: {},
        isAuthenticated: false
};

const getters = {
    currentUser: state => state.user,
    isAuthenticated: state => state.isAuthenticated
};
//`${location.origin}/api/users/currentuser
const actions = {
    fetchCurrentUser ({ commit }) {
        return new Promise((resolve, reject) => {
            axios.get(`https://localhost:3000/api/users/currentuser`)
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
        state.user = data.user;
        state.isAuthenticated = data.isAuthenticated;
    },
    authNotLoggedIn (state) {
        state.user = null;
        state.isAuthenticated = false;
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};
