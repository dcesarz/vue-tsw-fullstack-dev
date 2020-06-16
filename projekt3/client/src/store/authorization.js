import axios from '../axios';
import io from "socket.io-client";

const state = {
        user: {},
        isAuthenticated: false,
        socket: null
};

const getters = {
    currentUser: state => state.user,
    isAuthenticated: state => state.isAuthenticated
};

const actions = {
    fetchCurrentUser ({ commit }) {
        return new Promise((resolve, reject) => {
            axios.get(`${location.origin}/api/users/currentuser`)
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
    },
    commitConnectSocket({commit})
    {
        commit("connectSocket");
        console.log("Socket for user was created!");
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
    },
    connectSocket () {
        state.socket = io({ transports: ["websocket"] });
    },
    disconnectSocket () {
        state.socket = null;
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};
