//import axios from "axios";
// import router from "../router";
import axios from '../axios';
const state = {
    currentUser: {
        user: {},
        isAuthenticated: false
    }
};

const getters = {
    currentUser: state => state.currentUser
};
//`${location.origin}/api/users/currentuser
const actions = {
    fetchCurrentUser ({ commit }) {
        return new Promise((resolve, reject) => {
            axios.get(`https://localhost:3000/api/users/currentuser`)
                .then((resp) => {
                    console.log("LOOK HERE SMARTASS")
                    console.dir(resp.data);
                    commit("authRefresh", resp.data);
                    resolve(resp);
                })
                .catch((err) => {
                    console.dir(err);
                    console.log("2 JUST AS I THOUGHT!!! > : 0 ")
                    commit("authNotLoggedIn");
                    reject(err);
                });
        });
    }
};

const mutations = {
    authRefresh (state, data) {
        state.currentUser.user = data.user;
        state.currentUser.isAuthenticated = data.isAuthenticated;
    },
    authNotLoggedIn (state) {
        state.currentUser.user = null;
        state.currentUser.isAuthenticated = false;
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};
