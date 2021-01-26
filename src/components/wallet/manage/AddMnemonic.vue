<template>
    <div class="add_mnemonic">
        <textarea placeholder="web  jar  rack  cereal  inherit ...." v-model="phrase"></textarea>
        <p class="err">{{ err }}</p>
        <v-btn
            :disabled="!canSubmit"
            :loading="isLoading"
            @click="access"
            block
            class="but_submit"
            depressed
        >
            {{ $t('keys.import_key_button') }}
        </v-btn>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import MnemonicDisplay from '../../misc/MnemonicDisplay.vue'
import * as bip39 from 'bip39'
import { Buffer } from 'buffer/'
import { keyChain } from '@/AVA'

@Component({
    components: { MnemonicDisplay },
})
export default class AddMnemonic extends Vue {
    phrase: string = ''
    err: string = ''
    isLoading: boolean = false

    get wordCount(): number {
        return this.phrase.trim().split(' ').length
    }

    get canSubmit() {
        if (this.wordCount < 24) {
            return false
        }
        return true
    }

    errCheck() {
        let phrase = this.phrase
        let words = phrase.split(' ')

        // not a valid key phrase
        if (words.length !== 24) {
            this.err =
                'Invalid key phrase. Your phrase must be 24 words separated by a single space.'
            return false
        }

        return true
    }

    async access() {
        let phrase = this.phrase.trim()
        this.err = ''
        this.isLoading = true

        if (!this.errCheck()) {
            this.isLoading = false
            return
        }

        setTimeout(async () => {
            try {
                await this.$store.dispatch('addWallet', phrase)
                this.isLoading = false
                this.handleImportSuccess()
            } catch (e) {
                this.isLoading = false
                this.err = 'Invalid key phrase.'
            }
        }, 500)
    }

    handleImportSuccess() {
        this.phrase = ''
        this.$emit('success')
    }
}
</script>
<style lang="scss" scoped>
.add_mnemonic {
    /*background-color: #e7e7ea;*/
    padding: 14px 0;
}

textarea {
    padding: 12px;
    font-size: 0.8rem;
    background-color: var(--bg-wallet);
    resize: none;
    width: 100%;
    height: 120px;
    margin-top: 14px;
}

.but_submit {
    margin-top: 12px;
}

.err {
    color: var(--error);
    font-size: 14px;
}
</style>
