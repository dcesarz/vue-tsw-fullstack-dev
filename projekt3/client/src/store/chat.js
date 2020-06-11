//import axios from "axios";
// import router from "../router";
import axios from '../axios';
const state = {
        activeConvos: [{
        }]
};

const getters = {
    activeConvos: state => state.activeConvos,
};
//`${location.origin}/api/users/currentuser
const actions = {
    fetchMessages ({ commit }) {
        return new Promise((resolve, reject) => {
            //https://localhost:3000/api/users/currentuser
            //`${location.origin}/api/users/currentuser`
            axios.get(`${location.origin}/api/messages/all`)
                .then((resp) => {
                    console.dir(resp.data);
                    commit("authRefresh", resp.data);
                    resolve(resp);
                })
                .catch((err) => {
                    console.dir(err);
                    //i think this will inly happen if ur not logged in so 
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
