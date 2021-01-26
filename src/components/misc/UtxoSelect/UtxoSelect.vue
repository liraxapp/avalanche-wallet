<template>
    <div class="utxo_select">
        <div class="buts">
            <button :selected="selected === 'all'" @click="select('all')">All</button>
            <button :selected="selected === 'unlocked'" @click="select('unlocked')">
                Unlocked
            </button>
            <button :selected="selected === 'locked'" @click="select('locked')">Locked</button>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { UTXOSet } from 'avalanche/dist/apis/platformvm'
import { UnixNow } from 'avalanche/dist/utils'

type Selection = 'all' | 'unlocked' | 'locked'
@Component
export default class UTXOSelect extends Vue {
    @Prop() utxos!: UTXOSet
    selected: Selection = 'all'

    get selectedSet() {
        switch (this.selected) {
            case 'all':
                return this.utxos
            case 'unlocked':
                return this.unlocked
            case 'locked':
                return this.locked
        }
        return this.utxos
    }

    get unlocked(): UTXOSet {
        let utxos = this.utxos.getAllUTXOs()
        let res = new UTXOSet()
        let now = UnixNow()
        for (var i = 0; i < utxos.length; i++) {
            let utxo = utxos[i]
            let out = utxo.getOutput()
            let type = out.getOutputID()
            if (type !== 22) {
                let locktime = out.getLocktime()
                if (locktime.lt(now)) {
                    res.add(utxo)
                }
            }
        }
        return res
    }

    get locked(): UTXOSet {
        return this.utxos.difference(this.unlocked)
    }

    select(type: Selection) {
        this.selected = type
        this.$emit('change', this.selectedSet)
    }
}
</script>
<style lang="scss" scoped>
.utxo_select {
    display: flex;
    margin: 4px 0;

    button {
        font-size: 13px;
        padding: 4px 8px;
        background-color: var(--bg-light);

        &[selected] {
            background-color: var(--primary-color);
            color: var(--bg);
        }
    }
}

.buts {
    border-radius: 4px;
    overflow: hidden;
}
</style>
