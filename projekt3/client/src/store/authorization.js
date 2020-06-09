import axios from "axios";
// import router from "../router";

const state = {
    currentUser: {
        username: null,
        isAuth: false
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
                    console.log(resp.data);
                    commit("authRefresh", resp.data);
                    resolve(resp);
                })
                .catch((err) => {
                    console.log(err);
                    console.log("2 JUST AS I THOUGHT!!! > : 0 ")
                    commit("authNotLoggedIn");
                    reject(err);
                });
        });
    }
};

const mutations = {
    authRefresh (state, data) {
        state.currentUser.username = data.username;
        state.currentUser.isAuth = data.isAuth;
    },
    authNotLoggedIn (state) {
        state.currentUser.username = null;
        state.currentUser.isAuth = false;
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};
