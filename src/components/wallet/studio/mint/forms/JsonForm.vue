<template>
    <div>
        <label>JSON Payload (MAX 1024 characters)</label>
        <div class="input_cont">
            <!--            <div ref="editor" class="editor"></div>-->
            <textarea @input="onInput" maxlength="1024" type="text" v-model="data" />
            <p class="counter">{{ data.length }} / 1024</p>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { JsonFormType } from '@/components/wallet/studio/mint/types'

// const JSONEditor = require('jsoneditor')

@Component
export default class JsonForm extends Vue {
    data = '{\n\n}'

    get isValid(): boolean {
        let data = this.data

        if (data.length === 0) return false
        try {
            JSON.parse(data)
        } catch (e) {
            return false
        }
        return true
    }

    mounted() {
        // const container = this.$refs.editor
        // const options = {
        //     mode: 'text',
        // }
        // const editor = new JSONEditor(container, options)
        //
        // console.log(editor)
    }

    onInput() {
        let msg: null | JsonFormType = null

        if (this.isValid) {
            msg = {
                data: this.data,
            }
        } else {
            msg = null
        }

        this.$emit('onInput', msg)
    }
}
</script>
<style lang="scss" scoped>
textarea,
.editor {
    width: 100%;
    height: 180px;
    max-width: 100%;
}

.editor {
    position: relative;
    //overflow: scroll;
    background-color: var(--bg-light);
}

.input_cont {
    width: 100%;
}

.v-btn {
    margin-top: 14px;
}

.counter {
    text-align: right;
    font-size: 13px;
    color: var(--primary-color-light);
    padding: 2px;
}
</style>
