<template>
    <div>
        <div v-if="!isEmpty">
            <CollectibleFamilyRow
                :family="fam"
                :key="fam.id"
                v-for="fam in nftFamsArray"
            ></CollectibleFamilyRow>
        </div>
        <div class="coming_soon" v-else>
            <img src="@/assets/nft_preview.png" v-if="$root.theme === 'day'" />
            <img src="@/assets/nft_preview_night.png" v-else />
            <p>{{ $t('portfolio.nobalance_nft') }}</p>
        </div>
    </div>
</template>
<script lang="ts">
import NFTCard from './NftCard.vue'
import CollectibleFamilyRow from '@/components/wallet/portfolio/CollectibleFamilyRow.vue'
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IWalletNftDict, IWalletNftMintDict } from '@/store/types'
import { AvaNftFamily } from '@/js/AvaNftFamily'
import { NftFamilyDict } from '@/store/modules/assets/types'

// const payloadTypes = PayloadTypes.getInstance();
@Component({
    components: {
        NFTCard,
        CollectibleFamilyRow,
    },
})
export default class Collectibles extends Vue {
    @Prop() search!: string

    get isEmpty(): boolean {
        let nftUtxos = this.$store.getters.walletNftUTXOs.length
        let mintUTxos = this.$store.getters.walletNftMintUTXOs.length
        return nftUtxos + mintUTxos === 0
    }

    get nftDict(): IWalletNftDict {
        return this.$store.getters.walletNftDict
    }

    get nftMintDict(): IWalletNftMintDict {
        return this.$store.getters.walletNftMintDict
    }

    get nftFamsArray() {
        let fams: AvaNftFamily[] = this.$store.state.Assets.nftFams

        // If search query
        if (this.search) {
            let query = this.search
            fams = fams.filter((fam) => {
                if (
                    fam.name.includes(query) ||
                    fam.id.includes(query) ||
                    fam.symbol.includes(query)
                ) {
                    return true
                }
                return false
            })
        }

        fams.sort((a, b) => {
            let symbolA = a.symbol
            let symbolB = b.symbol

            if (symbolA < symbolB) {
                return -1
            } else if (symbolA > symbolB) {
                return 1
            }
            return 0
        })

        return fams
    }

    get nftFamsDict(): NftFamilyDict {
        return this.$store.state.Assets.nftFamsDict
    }
}
</script>
<style lang="scss" scoped>
@use '../../../main';

$flip_dur: 0.6s;

.coming_soon {
    padding-top: 60px;
    text-align: center;

    img {
        width: 100%;
        max-width: 560px;
    }

    p {
        font-weight: lighter;
        font-size: 28px;
        color: var(--primary-color-light);
    }
}

.list {
    //display: grid;
    //padding: 30px 0;
    //grid-template-columns: repeat(4, 1fr);
    //grid-row-gap: 15px;
    //grid-column-gap: 15px;
    display: flex;
    flex-wrap: wrap;
}

.nft_card {
    transition-duration: 0.3s;
    width: 140px;
    height: 220px;
}

@include main.mobile-device {
    .list {
        grid-template-columns: repeat(2, 1fr);
    }
}

@include main.large-device {
    .list {
        grid-template-columns: repeat(4, 1fr);
    }
}

@include main.xl-device {
    .list {
        grid-template-columns: repeat(4, 1fr);
    }
}

@include main.largest-device {
    .list {
        grid-template-columns: repeat(6, 1fr);
    }
}
</style>
