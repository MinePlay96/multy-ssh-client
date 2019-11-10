<template>
    <div></div>
</template>

<script>
const net = require('net');

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
        var app = this

        app.conn.forwardOut('127.0.0.1', app.tunnel.localPort, app.tunnel.remoteIp, app.tunnel.remotePort, function(err, stream) {
            if (err) {
                return app.conn.end();
            }
            
            app.server = net.createServer(function(clientSocket) {
                stream.pipe(clientSocket).pipe(stream).on('close', function() {
                    app.server.close();
                });
            });
            
            app.server.listen(app.tunnel.localPort, '127.0.0.1');
        });
    },
    destroyed() {
        if (this.server) {
            this.server.close();
        }
    }
}
</script>