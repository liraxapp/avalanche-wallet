<template>
    <div>
        <div class="networks_list">
            <network-row
                :key="net.id"
                :network="net"
                class="network_row"
                data-cy="network-item"
                v-for="net in networks"
            ></network-row>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

import NetworkRow from './NetworkRow.vue'
import { AvaNetwork } from '@/js/AvaNetwork'

@Component({
    components: {
        NetworkRow,
    },
})
export default class ListPage extends Vue {
    get networks(): AvaNetwork[] {
        return this.$store.getters['Network/allNetworks']
    }
}
</script>
<style lang="scss" scoped>
.networks_list {
    padding: 0px 15px;
}
</style>
