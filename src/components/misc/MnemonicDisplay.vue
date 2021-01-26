<template>
    <div :style="{ gridTemplateColumns: `repeat(${rowSize}, 1fr)` }" class="mnemonic_display">
        <div :key="i" class="word" v-for="i in wordNum">
            <p class="index">{{ i }}.</p>
            <p class="phrase_word">{{ phraseArray[i - 1] }}</p>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class MnemonicDisplay extends Vue {
    @Prop({ default: '#FFFFFF' }) bgColor?: string
    @Prop({ default: 4 }) rowSize!: number
    wordNum: number = 24
    @Prop() phrase!: string

    get phraseArray(): string[] {
        let words = this.phrase.split(' ')
        let res: string[] = []

        for (let i = 0; i < Math.max(words.length, this.wordNum); i++) {
            let val = words[i] ? words[i] : ''
            res.push(val)
        }
        return res
    }
}
</script>
<style lang="scss" scoped>
@use "../../main";

.mnemonic_display {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 6px;
    row-gap: 6px;
    font-size: 12px;
}

.word {
    display: flex;
    overflow: hidden;
    font-weight: 700;

    background-color: var(--bg);

    > * {
        padding: 16px 6px;
    }
}

.index {
    width: 22px;
    box-sizing: content-box;
    text-align: center;
    user-select: none;
    color: var(--primary-color);
    font-weight: 400;
}

.phrase_word {
    text-align: center;
    /*overflow: scroll;*/
    white-space: nowrap;
    flex-grow: 1;
}

p {
    text-align: left;
}

span {
    text-align: center;
}

@include main.mobile-device {
    .word {
        * {
            padding: 4px 2px;
        }
    }

    .mnemonic_display {
        grid-template-columns: 1fr 1fr 1fr !important;
    }

    .phrase_word {
    }
}
</style>
