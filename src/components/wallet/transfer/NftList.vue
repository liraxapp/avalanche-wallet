<template>
    <div v-if="!isEmpty">
        <div class="added_list">
            <NftListItem
                :key="utxo.getUTXOID()"
                :sample="utxo"
                @change="setGroupUtxos"
                @remove="remove"
                class="nft_icon"
                v-for="utxo in addedNfts"
            ></NftListItem>
            <div class="nft_icon card nft_add">
                <button @click="showPopup" class="add_but">
                    +
                    <br />
                    Add Collectible
                </button>
                <BalancePopup
                    :disabled-ids="usedNftIds"
                    :is-nft="true"
                    @select="addNft"
                    class="bal_popup"
                    ref="popup"
                ></BalancePopup>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { IWalletNftDict } from '../../../store/types'
import { NftFamilyDict } from '../../../store/modules/assets/types'
import BalancePopup from '@/components/misc/BalancePopup/BalancePopup.vue'

import 'reflect-metadata'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { NFTTransferOutput, UTXO } from 'avalanche/dist/apis/avm'
import { getPayloadFromUTXO } from '@/helpers/helper'
import NftListItem from '@/components/wallet/transfer/NftListItem.vue'
import { IGroupDict, IGroupQuantity } from '@/components/wallet/studio/mint/types'
import { bintools } from '@/AVA'

@Component({
    components: {
        BalancePopup,
        NftListItem,
    },
})
export default class NftList extends Vue {
    addedNfts: UTXO[] = []

    groupUtxos: IGroupDict = {}

    $refs!: {
        popup: BalancePopup
    }

    // @Watch('addedNfts')
    // onlistchange(val: UTXO[]) {
    //     this.$emit('change', val)
    // }

    get payloads() {
        return this.addedNfts.map((utxo) => {
            return getPayloadFromUTXO(utxo)
        })
    }

    get isEmpty(): boolean {
        return this.nftUTXOs.length === 0
    }

    // @Watch('groupUtxos')
    // onGroupUtxosChange(val: IGroupDict) {
    //     console.log(this.groupUtxos)
    // }

    get nftUTXOs(): UTXO[] {
        return this.$store.getters.walletNftUTXOs
    }

    get nftDict(): IWalletNftDict {
        return this.$store.getters.walletNftDict
    }

    get nftFamsDict(): NftFamilyDict {
        return this.$store.state.Assets.nftFamsDict
    }

    get usedNftIds() {
        return this.addedNfts.map((utxo: UTXO) => {
            return utxo.getUTXOID()
        })
    }

    setGroupUtxos(val: IGroupQuantity) {
        this.groupUtxos[val.id] = val.utxos
        this.emit()
    }

    emit() {
        let utxos = []

        for (var id in this.groupUtxos) {
            let gUtxos = this.groupUtxos[id]
            utxos.push(...gUtxos)
        }

        this.$emit('change', utxos)
    }

    clear() {
        if (!this.$route.query.nft) {
            this.addedNfts = []
            this.groupUtxos = {}
            this.emit()
        }
    }

    addNft(utxo: UTXO) {
        this.addedNfts.push(utxo)
    }

    remove(utxo: UTXO) {
        let famId = bintools.cb58Encode(utxo.getAssetID())
        let groupId = (utxo.getOutput() as NFTTransferOutput).getGroupID()

        // Clear from selected utxos list
        let dictId = `${famId}_${groupId}`
        delete this.groupUtxos[dictId]

        let utxos = this.addedNfts
        for (var i = 0; i < utxos.length; i++) {
            if (utxos[i].getUTXOID() === utxo.getUTXOID()) {
                this.addedNfts.splice(i, 1)
            }
        }

        this.emit()
    }

    showPopup() {
        this.$refs.popup.isActive = true
    }

    deactivated() {
        this.clear()
    }

    activated() {
        if (this.$route.query.nft) {
            let utxoId = this.$route.query.nft as string
            let target = this.nftUTXOs.find((el) => {
                return el.getUTXOID() === utxoId
            })

            if (target) {
                this.addNft(target)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
$nft_w: 90px;

.added_list {
    display: flex;
    flex-wrap: wrap;
}

.nft_icon {
    flex-shrink: 0;
    flex-grow: 0;
    position: relative;
    width: $nft_w;
    height: $nft_w;
    background-color: var(--bg-light);
    border-radius: 3px;
    margin: 4px;
    margin-bottom: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.1);

    &:first-of-type {
        margin-left: 0;
    }
}

.nft_add {
    background-color: transparent;
}

.add_but {
    box-shadow: none;
    height: 100%;
    width: 100%;
    padding: 14px;
    border: 1px dashed var(--primary-color-light);
    cursor: pointer;
    font-size: 12px;
    opacity: 0.5;
    text-align: center;
    transition-duration: 0.2s;

    &:hover {
        opacity: 1;
    }
}
</style>
