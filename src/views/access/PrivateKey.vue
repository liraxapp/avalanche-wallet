<template>
    <div class="access_card">
        <div class="content">
            <h1>Private Key</h1>
            <form @submit.prevent="access">
                <v-text-field
                    class="pass"
                    dense
                    flat
                    hide-details
                    label="Private Key"
                    solo
                    type="password"
                    v-model="privatekey"
                ></v-text-field>
                <p class="err">{{ error }}</p>
                <v-btn
                    :disabled="!canSubmit"
                    :loading="isLoading"
                    @click="access"
                    class="ava_button button_primary"
                    color="#4C2E56"
                    depressed
                >
                    Access Wallet
                </v-btn>
            </form>
            <router-link class="link" to="/access">Cancel</router-link>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { ImportKeyfileInput } from '@/store/types'
import { KeyFile } from '@/js/IKeystore'
import { SingletonWallet } from '@/js/wallets/SingletonWallet'
import { privateToAddress } from 'ethereumjs-util'
import { bintools } from '@/AVA'
import { Buffer } from 'avalanche'

@Component
export default class PrivateKey extends Vue {
    privatekey: string = ''
    isLoading: boolean = false
    error: string = ''

    get canSubmit(): boolean {
        if (!this.privatekey) {
            return false
        }
        return true
    }

    async access() {
        if (!this.canSubmit || this.isLoading) return
        let parent = this
        this.error = ''
        this.isLoading = true
        let key = this.privatekey

        // if ethereum private key

        try {
            let keyBuf = Buffer.from(key, 'hex')
            // @ts-ignore
            privateToAddress(keyBuf)
            key = `PrivateKey-${bintools.cb58Encode(keyBuf)}`
        } catch (e) {
            //
        }

        try {
            let wallet = new SingletonWallet(key)
            let res = await this.$store.dispatch('accessWalletSingleton', wallet)
            this.onsuccess()
        } catch (e) {
            this.onerror('Invalid Private Key.')
        }
    }

    onsuccess() {
        this.isLoading = false
        this.privatekey = ''
    }

    onerror(e: any) {
        this.error = e
        this.privatekey = ''
        this.isLoading = false
    }
}
</script>
<style lang="scss" scoped>
@use '../../main';

.pass {
    background-color: var(--bg) !important;
}

.ava_button {
    width: 100%;
    margin-bottom: 22px;
}

.access_card {
    /*max-width: 80vw;*/
    background-color: var(--bg-light);
    padding: main.$container-padding;
    width: 100%;
    /*max-width: 240px;*/
    /*max-width: 1000px;*/
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
}

.content {
    width: 340px;
    max-width: 100%;
    margin: 0px auto;
}

h1 {
    font-size: main.$m-size;
    font-weight: 400;
    margin-bottom: 30px;
}

.file_in {
    margin: 30px auto 10px;
    font-size: 13px;
    border: none !important;
    background-color: var(--bg) !important;
    /*min-width: 200px*/
}

a {
    color: main.$primary-color-light !important;
    text-decoration: underline !important;
    margin: 10px 0 20px;
}

.link {
    color: var(--secondary-color);
}

.remember {
    margin: 12px 0;
}

.err {
    font-size: 13px;
    color: var(--error);
    margin: 14px 0px !important;
}

@media only screen and (max-width: main.$mobile_width) {
    h1 {
        font-size: main.$m-size-mobile;
    }
    .but_primary {
        width: 100%;
    }
}
</style>
