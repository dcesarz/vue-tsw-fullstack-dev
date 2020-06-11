<template>
    <div>
       Connected to {{contact}}, enjoy your convo!
        <input id="name-input" type="text" v-model="usrSearch" placeholder="Username..." />
        <input type="button" @click="newMessage" value="Send message.." />
        <div v-for="message in filteredMessages" :key="message._id">
        <SingleMessage :message="message" />
        </div>
    </div>
</template>

<script>
import SingleMessage from "./SingleMessage";

export default {
    name: "Conversation",
    props:
      ["filteredMessages", "contact"],
    components: {
        SingleMessage,
    },
    methods: {
        newMessage(){
            console.log(this.contact);
        }
    }
};
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
