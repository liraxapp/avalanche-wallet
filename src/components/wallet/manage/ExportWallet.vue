<template>
    <div class="export_wallet">
        <p class="explain" v-if="isDesc">{{ $t('keys.export_key_desc') }}</p>
        <form @submit.prevent="download">
            <label>Password (min 9 characters)</label>
            <v-text-field
                class="formIn"
                dense
                height="40"
                hide-details
                outlined
                placeholder="Password"
                type="password"
                v-model="pass"
            ></v-text-field>
            <label>Confirm Password</label>
            <v-text-field
                class="formIn"
                dense
                height="40"
                hide-details
                outlined
                placeholder="Confirm Password"
                type="password"
                v-model="passConfirm"
            ></v-text-field>
            <p class="err">{{ err }}</p>
            <v-btn
                :disabled="!isValid"
                :loading="isLoading"
                block
                class="button_primary"
                depressed
                type="submit"
            >
                Export Wallet
            </v-btn>
        </form>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import AvaHdWallet from '@/js/wallets/AvaHdWallet'
import { ExportWalletsInput } from '@/store/types'

@Component
export default class ExportWallet extends Vue {
    isLoading: boolean = false
    pass: string = ''
    passConfirm: string = ''
    err: string = ''

    @Prop() wallets!: AvaHdWallet[]
    @Prop({ default: true }) isDesc!: boolean

    get isValid(): boolean {
        return this.pass.length >= 9 && this.pass === this.passConfirm ? true : false
    }

    async download() {
        this.isLoading = true
        this.err = ''

        if (!this.wallets) {
            this.isLoading = false
            this.err = 'No wallet selected.'
            return
        }

        let input: ExportWalletsInput = {
            password: this.pass,
            wallets: this.wallets,
        }
        setTimeout(() => {
            this.$store.dispatch('exportWallets', input).then((res) => {
                this.isLoading = false
                this.pass = ''
                this.passConfirm = ''
                this.$store.dispatch('Notifications/add', {
                    title: 'Key File Export',
                    message: 'Your keys are downloaded.',
                })
                // @ts-ignore
                this.$emit('success')
            })
        }, 200)
    }
}
</script>
<style lang="scss">
.export_wallet {
    .formIn {
        .v-input__slot {
            background-color: var(--bg-light) !important;
        }

        .v-text-field__details {
            padding: 0;
        }

        fieldset {
            border: none;
        }
    }
}
</style>
<style lang="scss">
.export_wallet {
    fieldset {
        border: none !important;
    }
}
</style>
<style lang="scss" scoped>
@use '../../../main';
@use '../../../light_theme';

.export_wallet {
    font-size: 12px;
}

.explain {
    color: var(--primary-color-light);
    margin-bottom: 20px !important;
}

label {
    color: var(--primary-color-light);
}

.formIn {
    background-color: var(--bg-light);
    font-size: 12px;
    border-radius: 2px;
}

.button_primary {
    margin-top: 10px;
}

.err {
    margin: 4px 0 !important;
    color: var(--error);
}
</style>
