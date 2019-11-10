<template>
    <b-modal v-model="showLocal" title="SSHTunnels" @hidden="$emit('update:show', false)" ok-only>
        <form inline @submit="addTunnel" ref="SSHTunnelForm">
            <b-input-group>
                <b-input v-model="tmp.localPort"></b-input>
                <b-input v-model="tmp.remoteIp"></b-input>
                <b-input v-model="tmp.remotePort"></b-input>
            <b-button type="submit" variant="success">+</b-button>
            </b-input-group>
        </form>
        <b-table :items="tab.SSHTunnels" :fields="['localPort','remoteIp','remotePort']" @row-dblclicked="removeTunnel"></b-table>
    </b-modal>
</template>

<script>
export default {
    name: "SettingsModal",
    data() {
        return {
            tmp: {
                localPort: null,
                remotePort: null,
                remoteIp: null
            },
            showLocal: this.show
        }
    },
    model: {
        prop: 'tab',
        event: 'change',
    },
    props: {
        show: Boolean,
        tab: Object,
    },
    watch: {
        show() {
            this.showLocal = this.show;
        }
    },
    methods: {
        addTunnel(event) {
            event.preventDefault()
            this.tab.SSHTunnels.push(Object.assign({}, this.tmp));
            this.tmp = {
                localPort: null,
                remotePort: null,
                remoteIp: null
            }            
        },
        removeTunnel(data, key) {
            this.tab.SSHTunnels.splice(key, 1);
        }
    }
}
</script>