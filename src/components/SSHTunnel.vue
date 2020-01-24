<template>
    <div></div>
</template>

<script>
//const net = require('net');
const tunnel = require('tunnel-ssh');

export default {
    name: 'SSHTunnel',
    props: {
        conn: Object,
        tunnel: Object
    },
    data() {
        return {
            server: null
        }
    },
    mounted() {

        let app = this;
        let term = console;

        let tunnelConfig = {
            ...app.conn.config,
            dstHost: app.tunnel.remoteIp,
            dstPort: app.tunnel.remotePort,
            localHost: '127.0.0.1',
            localPort: app.tunnel.localPort,
        }

        this.server = tunnel(tunnelConfig, function (error) {
            term.log('connected', error);
        });
    
        // Use a listener to handle errors outside the callback
        this.server.on('error', function(err){
            term.error(err);
        });
    },
    destroyed() {
        if (this.server) {
            this.server.close();
        }
    }
}
</script>