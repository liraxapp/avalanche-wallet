<template>
    <div class="transfer_card">
        <h1>{{ $t('transfer.title') }}</h1>
        <div class="disconnected" v-if="networkStatus !== 'connected'">
            <p>{{ $t('transfer.disconnected') }}</p>
        </div>
        <div class="card_body" v-else>
            <FormC v-show="formType === 'C'">
                <!--
                <ChainInput v-model="formType"></ChainInput>
                //todo-lirax remove the ChainInput and the relevant other components
                -->
            </FormC>
            <div class="new_order_Form" v-show="formType === 'X'">
                <div class="lists">
                    <!--<ChainInput v-model="formType"></ChainInput>-->
                    <div v-show="!isConfirm">
                        <tx-list @change="updateTxList" class="tx_list" ref="txList"></tx-list>
                        <template v-if="hasNFT">
                            <NftList @change="updateNftList" ref="nftList"></NftList>
                        </template>
                    </div>
                    <div v-show="isConfirm">
                        <TxSummary
                            :nft-orders="formNftOrders"
                            :orders="formOrders"
                            class="lists"
                        ></TxSummary>
                    </div>
                </div>
                <div>
                    <div class="to_address">
                        <h4>{{ $t('transfer.to') }}</h4>
                        <qr-input
                            class="qrIn hover_border"
                            placeholder="xxx"
                            v-if="!isConfirm"
                            v-model="addressIn"
                        ></qr-input>
                        <p class="confirm_val" v-else>{{ removeXTag(formAddress) }}</p>

                        <template v-if="isConfirm && formMemo.length > 0">
                            <h4>Memo (Optional)</h4>
                            <p class="confirm_val">{{ formMemo }}</p>
                        </template>
                        <template v-else-if="!isConfirm">
                            <h4>{{ $t('transfer.memo') }}</h4>
                            <textarea
                                class="memo"
                                maxlength="256"
                                placeholder="Memo"
                                v-model="memo"
                            ></textarea>
                        </template>
                    </div>
                    <div class="fees">
                        <h4>{{ $t('transfer.fees') }}</h4>
                        <p>
                            {{ $t('transfer.fee_tx') }}
                            <span>{{ txFee.toLocaleString(9) }} {{ ASSET_ID }}</span>
                        </p>
                    </div>
                    <div class="checkout">
                        <ul class="err_list" v-if="formErrors.length > 0">
                            <li :key="err" v-for="err in formErrors">
                                {{ err }}
                            </li>
                        </ul>
                        <template v-if="!isConfirm">
                            <v-btn
                                :disabled="!canSend"
                                :ripple="false"
                                @click="confirm"
                                block
                                class="button_primary"
                                depressed
                            >
                                Confirm
                            </v-btn>
                        </template>
                        <template v-else-if="isConfirm && !isSuccess">
                            <p class="err">{{ err }}</p>
                            <v-btn
                                :disabled="!canSend"
                                :loading="isAjax"
                                :ripple="false"
                                @click="submit"
                                block
                                class="button_primary"
                                color="#4C2E56"
                                depressed
                            >
                                {{ $t('transfer.send') }}
                            </v-btn>
                            <v-btn
                                @click="cancelConfirm"
                                block
                                small
                                style="margin-top: 20px !important; color: var(--primary-color)"
                                text
                            >
                                Cancel
                            </v-btn>
                        </template>
                        <template v-else-if="isSuccess">
                            <p style="color: var(--success)">
                                <fa icon="check-circle"></fa>
                                Transaction Sent
                            </p>
                            <label style="word-break: break-all">
                                <b>ID:</b>
                                {{ txId }}
                            </label>
                            <v-btn
                                :disabled="!canSendAgain"
                                :ripple="false"
                                @click="startAgain"
                                block
                                class="button_primary"
                                color="#4C2E56"
                                depressed
                                style="margin-top: 14px"
                            >
                                Start Again
                            </v-btn>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Ref } from 'vue-property-decorator'

import TxList from '@/components/wallet/transfer/TxList.vue'
import RadioButtons from '@/components/misc/RadioButtons.vue'
import Big from 'big.js'

import NftList from '@/components/wallet/transfer/NftList.vue'

//@ts-ignore
import { QrInput } from '@avalabs/vue_components'
import { ava, avm, isValidAddress } from '@/AVA'
import FaucetLink from '@/components/misc/FaucetLink.vue'
import { ITransaction } from '@/components/wallet/transfer/types'
import { UTXO } from 'avalanche/dist/apis/avm'
import { Buffer, BN } from 'avalanche'
import TxSummary from '@/components/wallet/transfer/TxSummary.vue'
import { IssueBatchTxInput, WalletType } from '@/store/types'
import { bnToBig, addXTag, removeXTag } from '@/helpers/helper'
import * as bip39 from 'bip39'
import FormC from '@/components/wallet/transfer/FormC.vue'
import { ChainIdType, ASSET_ID, ASSET_NAME } from '@/constants'

import ChainInput from '@/components/wallet/transfer/ChainInput.vue'

@Component({
    components: {
        FaucetLink,
        TxList,
        RadioButtons,
        QrInput,
        NftList,
        TxSummary,
        FormC,
        ChainInput,
    },
})
export default class Transfer extends Vue {
    removeXTag = removeXTag
    formType: ChainIdType = 'X'
    showAdvaaanced: boolean = false
    isAjax: boolean = false
    addressIn: string = ''
    memo: string = ''
    orders: ITransaction[] = []
    nftOrders: UTXO[] = []
    formErrors: string[] = []
    err = ''

    formAddress: string = ''
    formOrders: ITransaction[] = []
    formNftOrders: UTXO[] = []
    formMemo = ''

    isConfirm = false
    isSuccess = false
    txId = ''

    canSendAgain = false

    ASSET_ID = ASSET_ID
    ASSET_NAME = ASSET_NAME

    get networkStatus(): string {
        let stat = this.$store.state.Network.status
        return stat
    }

    get hasNFT(): boolean {
        return this.$store.getters.walletNftUTXOs.length > 0
    }

    get faucetLink() {
        let link = process.env.VUE_APP_FAUCET_LINK
        if (link) return link
        return null
    }

    get canSend() {
        if (!this.addressIn) return false

        if (
            this.orders.length > 0 &&
            this.totalTxSize.eq(new BN(0)) &&
            this.nftOrders.length === 0
        ) {
            return false
        }

        if (this.orders.length === 0 && this.nftOrders.length === 0) return false

        return true
    }

    get totalTxSize() {
        let res = new BN(0)
        for (var i = 0; i < this.orders.length; i++) {
            let order = this.orders[i]
            if (order.amount) {
                res = res.add(this.orders[i].amount)
            }
        }
        return res
    }

    get wallet(): WalletType {
        return this.$store.state.activeWallet
    }

    // TODO: Remove after ledger support
    get isLedger() {
        return this.wallet.type === 'ledger'
    }

    get txFee(): Big {
        let fee = avm.getTxFee()
        return bnToBig(fee, 9)
    }

    get addresses() {
        return this.$store.state.addresses
    }

    confirm() {
        let isValid = this.formCheck()
        if (!isValid) return

        this.formOrders = [...this.orders]
        this.formNftOrders = [...this.nftOrders]
        this.formAddress = this.addressIn
        this.formMemo = this.memo

        this.isConfirm = true
    }

    cancelConfirm() {
        this.err = ''
        this.formMemo = ''
        this.formOrders = []
        this.formNftOrders = []
        this.formAddress = ''
        this.isConfirm = false
    }

    updateTxList(data: ITransaction[]) {
        this.orders = data
    }

    updateNftList(val: UTXO[]) {
        this.nftOrders = val
    }

    formCheck() {
        this.formErrors = []
        let err = []

        let addr = this.addressIn

        let chain = addr.split('-')

        if (addXTag(chain[0]) !== 'X') {
            // todo-lirax
            err.push('Invalid address. You can only send to other X addresses.')
        }

        if (!isValidAddress(addr)) {
            err.push('Invalid address.')
        }

        let memo = this.memo
        if (this.memo) {
            let buff = Buffer.from(memo)
            let size = buff.length
            if (size > 256) {
                err.push('You can have a maximum of 256 characters in your memo.')
            }

            // Make sure memo isnt mnemonic
            let isMnemonic = bip39.validateMnemonic(memo)
            if (isMnemonic) {
                err.push('You should not put a mnemonic phrase into the Memo field.')
            }
        }

        // Make sure to address matches the bech32 network hrp
        let hrp = ava.getHRP()
        if (!addr.includes('lirax')) {
            // todo-lirax
            err.push('Not a valid address for this network.')
        }

        this.formErrors = err
        if (err.length === 0) {
            // this.send();
            return true
        } else {
            return false
        }
    }

    startAgain() {
        this.txId = ''
        this.isSuccess = false
        this.cancelConfirm()

        this.orders = []
        this.nftOrders = []
        this.formOrders = []
        this.formNftOrders = []
    }

    clearForm() {
        this.addressIn = ''
        this.memo = ''

        // Clear transactions list
        // @ts-ignore
        this.$refs.txList.reset()

        // Clear NFT list
        if (this.hasNFT) {
            // @ts-ignore
            this.$refs.nftList.clear()
        }
    }

    onsuccess() {
        this.isAjax = false
        this.isSuccess = true
        this.clearForm()

        this.$store.dispatch('Notifications/add', {
            title: this.$t('transfer.success_title'),
            message: this.$t('transfer.success_msg'),
            type: 'success',
        })

        // Update the user's balance
        this.canSendAgain = false
        setTimeout(() => {
            this.$store.dispatch('Assets/updateUTXOs')
            this.canSendAgain = true
        }, 3000)
    }

    onerror(err: any) {
        this.err = err
        this.isAjax = false
        this.$store.dispatch('Notifications/add', {
            title: this.$t('transfer.error_title'),
            message: this.$t('transfer.error_msg'),
            type: 'error',
        })
    }

    submit() {
        this.isAjax = true
        this.err = ''

        let sumArray: (ITransaction | UTXO)[] = [...this.formOrders, ...this.formNftOrders]

        let txList: IssueBatchTxInput = {
            toAddress: addXTag(this.formAddress),
            memo: Buffer.from(this.formMemo),
            orders: sumArray,
        }

        this.$store
            .dispatch('issueBatchTx', txList)
            .then((res) => {
                this.onsuccess()
                this.txId = res
            })
            .catch((err) => {
                this.onerror(err)
            })
    }

    activated() {
        this.clearForm()
    }
}
</script>

<style lang="scss">
.advanced_panel {
    .v-expansion-panel-header {
        padding: 0;
        font-size: 12px;
        font-weight: normal;
        color: #2c3e50;
        min-height: auto !important;
        margin-bottom: 10px;
    }

    .v-expansion-panel-content__wrap {
        padding: 0 !important;
    }

    .v-icon {
        font-size: 12px;
    }
}
</style>
<style lang="scss" scoped>
@use '../../main';

$padLeft: 24px;
$padTop: 8px;

.disconnected {
    padding: 30px;
    text-align: center;
    background-color: var(--bg-light);
}

.explain {
    font-size: 12px;
    color: var(--primary-color-light);
}

h1 {
    font-weight: normal;
}

h4 {
    display: block;
    text-align: left;
    font-size: 12px;
    font-weight: bold;
    margin: 12px 0;
}

.send_to {
    display: flex;
    margin-bottom: 10px;
}

.addressIn > input {
    color: var(--bg) !important;
    padding: 5px 6px !important;
    text-align: center;
    letter-spacing: 2px;
    font-size: 12px;
}

.addressIn > input::-webkit-input-placeholder {
    color: var(--primary-color-light) !important;
}

.addressIn .v-input__slot:before {
    display: none;
}

.readerBut {
    margin-top: 4px;
    display: flex;
    background-color: #404040;
    /*cursor: pointer;*/
}

.readerBut button {
    opacity: 0.6;
    outline: none;
    padding: 6px 12px;
    margin: 0px auto;
}

.readerBut:hover button {
    opacity: 1;
}

.memo {
    font-size: 14px;
    background-color: var(--bg-light);
    resize: none;
    width: 100%;
    height: 80px;
    border-radius: 2px;
    padding: 4px 12px;
}

.radio_buttons {
    margin-top: 15px;
}

.tx_info {
    text-align: left;
    font-size: 14px;
}

.new_order_Form {
    display: grid;
    grid-template-columns: 1fr 1fr 300px;
    column-gap: 45px;
    padding-top: 15px;
}

.new_order_Form > div {
    /*padding: 10px 0;*/
    margin-bottom: 15px;
}

.lists {
    /*padding-right: 45px;*/
    border-right: 1px solid var(--bg-light);
    grid-column: 1/3;

    /*> div{*/
    /*    margin: 14px 0;*/
    /*}*/
}

.tx_list {
    margin-bottom: 14px;
}

.fees {
    margin: 14px 0;
    border-top: 1px solid var(--bg-light);
    padding-top: 14px;
}

.fees p {
    text-align: left;
    font-size: 13px;
    color: var(--primary-color-light);
}

.fees span {
    float: right;
}

.to_address {
}

label {
    color: var(--primary-color-light);
    font-size: 12px;
    font-weight: bold;
    margin: 2px 0 !important;
}

.faucet {
    margin-top: 20px;
}

.advanced {
    padding: 20px 0px !important;
    margin-bottom: 20px;
}

.advanced .advancedBody {
    transition-duration: 0.2s;
}

.err_list {
    font-size: 12px;
    color: var(--error);
    margin: 6px 0;
}

.checkout {
    margin-top: 14px;
}

.confirm_val {
    background-color: var(--bg-light);
    word-break: break-all;
    padding: 8px 16px;
}

@media only screen and (max-width: 600px) {
    .order_form {
        display: block;
    }
    .asset_select button {
        flex-grow: 1;
        word-break: break-word;
    }
}

@media only screen and (max-width: main.$mobile_width) {
    .transfer_card {
        display: block;
        grid-template-columns: none;
    }

    .but_primary {
        width: 100%;
    }

    .new_order_Form {
        display: block;
        grid-template-columns: none;
    }

    .tx_list {
        padding: 0;
        border: none;
    }
}
</style>
