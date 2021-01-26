<template>
    <modal :can_close="false" class="modal_main" ref="modal" title="Confirm Logout">
        <div class="confirm_body">
            <p style="text-align: center">
                {{ $t('logout.confirmation') }}
                <br />
                {{ $t('logout.confirmation_message') }}
            </p>
            <div
                style="display: flex; flex-direction: column; align-items: center; margin-top: 14px"
            >
                <v-btn :loading="isLoading" @click="submit" class="ava_button button_primary">
                    {{ $t('logout.button_conf') }}
                </v-btn>
                <button @click="close" class="ava_button_secondary">
                    {{ $t('logout.button_cancel') }}
                </button>
            </div>
        </div>
    </modal>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

import Modal from '@/components/modals/Modal.vue'
import MnemonicDisplay from '@/components/misc/MnemonicDisplay.vue'
import CopyText from '@/components/misc/CopyText.vue'

@Component({
    components: {
        Modal,
        MnemonicDisplay,
        CopyText,
    },
})
export default class ConfirmLogout extends Vue {
    isLoading = false
    @Prop({ default: '' }) phrase!: string

    open(): void {
        let modal = this.$refs.modal as Modal
        modal.open()
    }

    close(): void {
        let modal = this.$refs.modal as Modal
        modal.close()
    }

    async submit() {
        this.isLoading = true
        await this.$store.dispatch('logout')
        await this.$store.dispatch('Notifications/add', {
            title: 'Logout',
            message: 'You have successfully logged out of your wallet.',
        })
        this.isLoading = false
        this.close()
    }
}
</script>
<style lang="scss" scoped>
.confirm_body {
    /*width: 600px;*/
    width: 400px;
    max-width: 100%;
    padding: 30px;
    /*background-color: var(--bg-light);*/
}
</style>
