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
      <b-form-file v-model="privateKey" placeholder="Privat Key auswählen" accept=".ppk,.pem,.key;id_*"></b-form-file>
      <b-button type="submit" variant="primary">Verbinden</b-button>
    </b-form>
    <div v-show="loading" class="mx-auto my-auto loader"></div>
  </b-container>
</template>

<script>
// TODO: move NewConnection to App and change the new tab method (rework this)
import {ipcRenderer} from "electron";
import { Client } from "ssh2";
import fs from "fs";

export default {
  name: "NewConection",
  data() {
    return {
      host: null,
      port: 22,
      username: null,
      password: null,
      privateKey: null,
      error: null,
      SSHConnection: new Client(),
      loading: false,
      NewConnectionEvent: null,
      title: ''
    };
  },
  methods: {
    submit(event) {

      if (event) {
        event.preventDefault();
      }
      
      this.loading = true;

      var credentials = {
        host: this.host,
        port: this.port,
        username: this.username,
        password: this.password,
        privateKey: this.privateKey ? fs.readFileSync(this.privateKey.path) : null
      };

      this.SSHConnection.connect(credentials);
    },
  },
  mounted() {

    let app = this

    let ipcEvent = ipcRenderer.once('NewConnection', function(sender, data) {
      app.host = data.HostName;
      app.port = data.PortNumber;
      app.username = data.UserName;
      app.password = data.PassWord;
      app.title = data.WinTitle;
      if (data.PublicKeyFile) {
        app.privateKey = {path: data.PublicKeyFile};
      }
      app.submit();
    })

    app.SSHConnection.on('ready', function() { 
      ipcRenderer.removeAllListeners('NewConnection');
      app.$emit("ready", app.SSHConnection);
      if (!app.title) {
        app.title = app.username + '@' + app.host
      }
      app.$emit("changeTitle", app.title);
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