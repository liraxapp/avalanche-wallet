<template>
    <div>
        <div v-if="!mintUtxo">
            <p>Select a family to issue collectibles to.</p>
            <SelectMintUTXO @change="setUtxo" class="select_mint_utxo"></SelectMintUTXO>
        </div>
        <MintForm :mint-utxo="mintUtxo" @cancel="cancel" @clearUtxo="clearUtxo" v-else></MintForm>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { pChain } from '@/AVA'
import { bnToBig } from '@/helpers/helper'
import Big from 'big.js'

import SelectMintUTXO from '@/components/wallet/studio/mint/SelectMintUtxo/SelectMintUTXO.vue'
import MintForm from '@/components/wallet/studio/mint/MintForm.vue'
import { UTXO } from 'avalanche/dist/apis/avm'

@Component({
    components: {
        SelectMintUTXO,
        MintForm,
    },
})
export default class MintNft extends Vue {
    isLoading = false
    mintUtxo: null | UTXO = null

    get txFee(): Big {
        return bnToBig(pChain.getTxFee(), 9)
    }

    get mintUtxos() {
        return this.$store.getters.walletNftMintUTXOs
    }

    async submit() {
        let wallet = this.$store.state.activeWallet
        if (!wallet) return

        this.isLoading = true
        this.isLoading = false
    }

    setUtxo(utxo: UTXO) {
        this.mintUtxo = utxo
    }

    clearUtxo() {
        this.mintUtxo = null
    }

    cancel() {
        this.$emit('cancel')
    }

    mounted() {
        let utxoId = this.$route.query.utxo

        // Select the utxo in the query if possible
        if (utxoId) {
            let utxos: UTXO[] = this.mintUtxos

            for (var i = 0; i < utxos.length; i++) {
                let utxo = utxos[i]
                let id = utxo.getUTXOID()

                if (id === utxoId) {
                    this.setUtxo(utxo)
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped></style>
