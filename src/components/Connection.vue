<template>
  <div class="tab">
      <NewConection v-if="!SSHConnection" @ready="connectTerm"></NewConection>
      <Terminal v-else v-on:bell="$emit('bell')" v-bind:conn="SSHConnection" v-on:quit="closeTab"></Terminal>
      <SSHTunnel style="display:none;" v-for="(tunnel, key) in SSHTunnels" :key="key" :conn="SSHConnection" :tunnel="tunnel"></SSHTunnel>
  </div>
</template>

<script>
// import components
import Terminal from "@/components/Terminal";
import SSHTunnel from "@/components/SSHTunnel";
import NewConection from "@/components/NewConection";

export default {
  name: "Connection",
  data(){
    return {
      SSHConnection: null
    }
  },
  props: {
    index: Number,
    SSHTunnels: Array
  },
  methods: {
    closeTab() {
      this.SSHConnection = null;
      this.$emit('close', this.index);
    },
    connectTerm(SSHConnection) {
      this.SSHConnection = SSHConnection;
      this.$emit('connected', this.index);
      this.$emit('changeTitle', this.index, this.SSHConnection.config.username + '@' + this.SSHConnection.config.host);
    }
  },
  components: {
    Terminal,
    SSHTunnel,
    NewConection
  }
};
</script>
