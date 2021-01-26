<template>
    <modal :can_close="false" :title="$t('modal.keystore.title')" class="modal_main" ref="modal">
        <div class="update_keystore_modal_body">
            <p>{{ $t('modal.keystore.desc') }}</p>
            <ExportWallet
                :is-desc="false"
                :wallets="allWallets"
                @success="success"
                class="export_wallet"
                v-if="!isSuccess"
            ></ExportWallet>
            <v-btn @click="logout" class="ava_button button_primary" v-else>
                {{ $t('modal.keystore.logout') }}
            </v-btn>
        </div>
    </modal>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

import Modal from '@/components/modals/Modal.vue'
import MnemonicDisplay from '@/components/misc/MnemonicDisplay.vue'
import CopyText from '@/components/misc/CopyText.vue'
import ExportWallet from '@/components/wallet/manage/ExportWallet.vue'
import AvaHdWallet from '@/js/wallets/AvaHdWallet'

@Component({
    components: {
        Modal,
        MnemonicDisplay,
        CopyText,
        ExportWallet,
    },
})
export default class MnemonicPhrase extends Vue {
    isSuccess: boolean = false

    @Prop({ default: '' }) phrase!: string

    get allWallets(): AvaHdWallet[] {
        return this.$store.state.wallets
    }

    open(): void {
        let modal = this.$refs.modal as Modal
        modal.open()
    }

    mounted() {
        this.open()
    }

    success() {
        this.isSuccess = true
    }

    logout() {
        this.$store.dispatch('logout')
    }
}
</script>
<style lang="scss" scoped>
.update_keystore_modal_body {
    /*width: 600px;*/
    width: 400px;
    max-width: 100%;
    padding: 30px;
    /*background-color: var(--bg-light);*/
}

.export_wallet {
    margin: 30px 0;
}

.ava_button {
    display: block;
    margin: 10px auto !important;
}
</style>
