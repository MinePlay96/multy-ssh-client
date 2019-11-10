<template>
  <b-container class="d-flex">
    <b-form v-show="loading == false" @submit="submit" class="mx-auto my-auto">
      <b-alert v-show="error" show variant="danger">{{ this.error }}</b-alert>
      <b-form-group>
        <b-input-group>
          <b-form-input placeholder="Server" v-model="host" required></b-form-input>
          <b-input-group-text>:</b-input-group-text>
          <b-form-input
            placeholder="Port"
            type="number"
            v-model="port"
            default="22"
            required
          ></b-form-input>
        </b-input-group>
      </b-form-group>
      <b-form-group>
        <b-form-input placeholder="Username" v-model="username" required></b-form-input>
        <b-form-input placeholder="Password" type="password" v-model="password"></b-form-input>
      </b-form-group>
      <b-form-file v-model="privatKey" placeholder="Privat Key auswählen" accept=".key"></b-form-file>
      <b-button type="submit" variant="primary">Verbinden</b-button>
    </b-form>
    <div v-show="loading" class="mx-auto my-auto loader"></div>
  </b-container>
</template>

<script>
import { Client } from "ssh2";

export default {
  name: "NewConection",
  data() {
    return {
      host: null,
      port: 22,
      username: null,
      password: null,
      privatKey: null,
      error: null,
      SSHConnection: new Client(),
      loading: false
    };
  },
  methods: {
    submit(event) {
      event.preventDefault();
      this.loading = true;
      this.SSHConnection.connect({
        host: this.host,
        port: this.port,
        username: this.username,
        password: this.password,
        privatKey: this.privatKey
      });
    },
  },
  mounted() {
    let app = this

    app.SSHConnection.on('ready', function() { 
      app.$emit("ready", app.SSHConnection);
    });

    app.SSHConnection.on('error', function(error) {
      app.loading = false;
      app.error = error;
    });

  }
};
</script>

<style>
.d-flex {
  overflow: hidden;
}

.loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px !important;
  height: 120px !important;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>