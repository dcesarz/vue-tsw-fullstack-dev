<template>
    <div>
        
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import io from '@/../node_modules/socket.io-client';

export default {
    computed: 
    data()
    return {
        message: "",
        socket: io(),
        sid: ""        
    },
    beforeRouteLeave(to, from, next){

    },

}
</script>