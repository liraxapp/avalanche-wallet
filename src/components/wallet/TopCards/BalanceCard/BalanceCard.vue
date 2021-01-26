<template>
    <div class="balance_card">
        <div class="fungible_card">
            <div class="header">
                <div class="refresh">
                    <Spinner class="spinner" v-if="isUpdateBalance"></Spinner>
                    <button @click="updateBalance" v-else>
                        <fa icon="sync"></fa>
                    </button>
                </div>
                <h4>{{ $t('top.title2') }}</h4>
            </div>
            <div class="balance_row">
                <p class="balance" data-cy="wallet_balance" v-if="!balanceTextRight">
                    {{ balanceTextLeft }} {{ ASSET_ID }}
                </p>
                <p class="balance" data-cy="wallet_balance" v-else>
                    {{ balanceTextLeft }}
                    <span>.{{ balanceTextRight }}</span>
                    {{ ASSET_ID }}
                </p>
                <p class="balance_usd">
                    <b>$ {{ totalBalanceUSD.toLocaleString(2) }}</b>
                    USD
                </p>
            </div>
            <!--            <button class="expand_but">Show Breakdown<fa icon="list-ol"></fa></button>-->
            <div class="alt_info">
                <div class="alt_breakdown">
                    <div>
                        <label>{{ $t('top.balance.available') }} (X)</label>
                        <p>{{ avmUnlocked | cleanAvaxBN }} {{ ASSET_ID }}</p>
                    </div>
                </div>
            </div>
        </div>
        <NftCol class="nft_card"></NftCol>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Component, Vue } from 'vue-property-decorator'
import AvaAsset from '@/js/AvaAsset'
import AvaHdWallet from '@/js/wallets/AvaHdWallet'
import Spinner from '@/components/misc/Spinner.vue'
import NftCol from './NftCol.vue'
import Tooltip from '@/components/misc/Tooltip.vue'

import Big from 'big.js'
import { BN } from 'avalanche/dist'
import { ONEAVAX } from 'avalanche/dist/utils'
import { bnToBig } from '@/helpers/helper'
import { priceDict } from '@/store/types'
import { ASSET_ID, ASSET_NAME } from '@/constants'

@Component({
    components: {
        Spinner,
        NftCol,
        Tooltip,
    },
    filters: {
        cleanAvaxBN(val: BN) {
            let big = Big(val.toString()).div(Big(ONEAVAX.toString()))
            return big.toLocaleString()
        },
    },
})
export default class BalanceCard extends Vue {
    ASSET_ID = ASSET_ID
    ASSET_NAME = ASSET_NAME

    get ava_asset(): AvaAsset | null {
        return this.$store.getters['Assets/AssetAVA']
    }

    get avmUnlocked(): BN {
        if (!this.ava_asset) return new BN(0)
        return this.ava_asset.amount
    }

    get avmLocked(): BN {
        if (!this.ava_asset) return new BN(0)
        return this.ava_asset.amountLocked
    }

    get evmUnlocked(): BN {
        // convert from ^18 to ^9
        let bal = this.wallet.ethBalance
        return bal.divRound(new BN(Math.pow(10, 9).toString()))
    }

    get totalBalance(): BN {
        if (!this.ava_asset) return new BN(0)

        let tot = this.ava_asset.getTotalAmount()
        // add EVM balance
        tot = tot.add(this.evmUnlocked)
        return tot
    }

    get totalBalanceBig(): Big {
        if (this.ava_asset) {
            let denom = this.ava_asset.denomination
            let bigTot = bnToBig(this.totalBalance, denom)
            return bigTot
        }
        return Big(0)
    }

    get totalBalanceUSD(): Big {
        let usdPrice = this.priceDict.usd
        let usdBig = this.totalBalanceBig.times(Big(usdPrice))
        return usdBig
    }

    // should be unlocked (X+P), locked (X+P) and staked and lockedStakeable
    get balanceText(): string {
        if (this.ava_asset !== null) {
            let denom = this.ava_asset.denomination
            return this.totalBalanceBig.toLocaleString(denom)
        } else {
            return '?'
        }
    }

    get balanceTextLeft(): string {
        let text = this.balanceText
        if (text.includes('.')) {
            let left = text.split('.')[0]
            return left
        }
        return text
    }

    get balanceTextRight(): string {
        let text = this.balanceText
        if (text.includes('.')) {
            let right = text.split('.')[1]
            return right
        }
        return ''
    }

    get stakingAmount(): BN {
        return this.$store.getters.walletStakingBalance
    }

    // avaxBnToBigAmt(val: BN): Big{
    //     return Big(val.toString()).div(Math.pow(10,9));
    // }

    get wallet(): AvaHdWallet {
        return this.$store.state.activeWallet
    }

    get isUpdateBalance(): boolean {
        return this.$store.state.Assets.isUpdateBalance
    }

    get priceDict(): priceDict {
        return this.$store.state.prices
    }

    updateBalance(): void {
        this.$store.dispatch('Assets/updateUTXOs')
        this.$store.dispatch('History/updateTransactionHistory')
    }
}
</script>
<style lang="scss" scoped>
@use '../../../../main';

.balance_card {
    display: grid;
    grid-template-columns: 1fr 230px;
    column-gap: 20px;
}

.nft_card {
    border-left: 2px solid var(--bg-light);
}

.fungible_card {
    height: 100%;
    display: grid !important;
    grid-template-rows: max-content 1fr max-content;
    flex-direction: column;
}

.where_info {
    grid-row: 2;
    grid-column: 1/3;
    margin-top: 8px;
    /*max-width: 460px;*/
}

.header {
    display: flex;

    h4 {
        margin-left: 12px;
        flex-grow: 1;
    }
}

h4 {
    font-weight: normal;
}

.alert_cont {
    margin: 0;
}

.balance_row {
    align-self: center;
}

.balance {
    font-size: 2.4em;
    white-space: normal;
    /*font-weight: bold;*/
    font-family: Rubik !important;

    span {
        font-size: 0.8em;
        /*color: var(--primary-color-light);*/
    }
}

.balance_usd {
    width: max-content;
    background: var(--bg-light);
    color: var(--primary-color-light);
    font-size: 13px;
    padding: 1px 6px;
    border-radius: 3px;
}

.refresh {
    width: 20px;
    height: 20px;
    color: var(--primary-color);

    button {
        outline: none !important;
    }

    img {
        object-fit: contain;
        width: 100%;
    }

    .spinner {
        color: var(--primary-color) !important;
    }
}

.buts {
    width: 100%;
    text-align: right;
}

.buts button {
    font-size: 18px;
    margin: 0px 18px;
    margin-right: 0px;
    position: relative;
    outline: none !important;
}

.buts img {
    height: 20px;
    width: 20px;
    object-fit: contain;
    outline: none !important;
}

.buts button[tooltip]:hover:before {
    border-radius: 4px;
    /*left: 0;*/
    left: 0;
    transform: translateX(-50%);
    content: attr(tooltip);
    position: absolute;
    background-color: #303030;
    bottom: 100%;
    color: #ddd;
    width: max-content;
    max-width: 100px;
    font-size: 14px;
    padding: 4px 8px;
}

.alt_info > div {
    display: grid;
    grid-template-columns: repeat(3, max-content);
    column-gap: 0px;
    margin-top: 12px;

    > div {
        position: relative;
        padding: 0 24px;
        border-right: 2px solid var(--bg-light);

        &:first-of-type {
            padding-left: 0;
        }

        &:last-of-type {
            border: none;
        }
    }

    label {
        font-size: 13px;
        color: var(--primary-color-light);
    }
}

.nft_card {
    padding-left: 20px;
}

.breakdown_toggle {
    color: var(--primary-color-light);
    font-size: 13px;
    outline: none !important;
}

@include main.medium-device {
    .balance_card {
        display: block;
        //grid-template-columns: 1fr 120px;
    }

    .balance {
        font-size: 1.8rem !important;
    }

    .nft_col {
        display: none;
    }

    .alt_info {
        font-size: 13px;
    }
}

@include main.mobile-device {
    .balance_card {
        grid-template-columns: none;
        display: block !important;
    }

    .nft_col {
        display: none;
    }

    .nft_card {
        padding: 0;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid var(--primary-color-light);
        border-left: none;
    }

    .balance {
        font-size: 2em !important;
    }

    .where_info {
    }

    .alt_info {
        > div {
            text-align: left;
            grid-template-columns: none;
            column-gap: 0;
        }

        .alt_non_breakdown,
        .alt_breakdown {
            > div {
                padding: 8px 0;
                border-right: none;
                border-bottom: 1px solid var(--bg-light);

                &:last-of-type {
                    border: none;
                }
            }
        }
    }

    .alt_non_breakdown {
        display: none !important;
    }
}
</style>
