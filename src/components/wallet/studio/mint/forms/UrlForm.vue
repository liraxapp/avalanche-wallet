<template>
    <div>
        <label>URL</label>
        <input @input="onInput" placeholder="https://" v-model="urlIn" />
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UrlFormType } from '@/components/wallet/studio/mint/types'

@Component
export default class UrlForm extends Vue {
    urlIn = ''

    get isValid(): boolean {
        if (this.urlIn.length === 0) {
            return false
        }

        if (!this.isValidUrl(this.urlIn)) {
            return false
        }

        return true
    }

    isValidUrl(url: string) {
        try {
            new URL(url)
        } catch (_) {
            return false
        }
        return true
    }

    onInput() {
        let msg: null | UrlFormType = null

        if (this.isValid) {
            msg = {
                url: this.urlIn,
            }
        }

        if (this.urlIn === '') msg = null
        this.$emit('onInput', msg)
    }
}
</script>
<style lang="scss" scoped>
input {
    width: 100%;
    max-width: 100%;
}

.v-btn {
    margin-top: 14px;
}
</style>
