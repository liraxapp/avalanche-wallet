<template>
    <div class="avax_input">
        <div class="col1 hover_border">
            <button @click="maxOut" class="max_but">MAX</button>
            <BigNumInput
                :denomination="9"
                :max="max"
                @change="amount_in"
                class="amt_in"
                contenteditable="amt_in"
                ref="amt_in"
            ></BigNumInput>
            <p class="balance" v-if="balance">
                Balance:
                <span>{{ balance.toLocaleString() }}</span>
            </p>
        </div>
        <p class="ticker">LIRAX</p>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop, Model } from 'vue-property-decorator'

//@ts-ignore
import { BigNumInput } from '@avalabs/vue_components'
import { BN } from 'avalanche'
import Big from 'big.js'

@Component({
    components: {
        BigNumInput,
    },
})
export default class AvaxInput extends Vue {
    @Model('change', { type: Object }) readonly amount!: boolean

    @Prop() max?: BN | null
    @Prop() balance?: Big | null

    maxOut(ev: MouseEvent) {
        ev.preventDefault()
        ev.stopPropagation()
        //@ts-ignore
        this.$refs.amt_in.maxout()
    }

    amount_in(val: BN) {
        this.$emit('change', val)
    }
}
</script>
<style lang="scss" scoped>
.avax_input {
    display: grid;
    grid-template-columns: 1fr max-content;
    grid-gap: 10px;
    color: var(--primary-color);
    width: 100%;
    height: 40px;

    .amt_in {
        color: var(--primary-color);
        font-size: 15px;
        font-family: monospace;
        flex-grow: 1;
        flex-shrink: 1;
        display: block;
        box-sizing: content-box;
        outline: none !important;
        border: none !important;
        //padding: 0 12px !important;
    }

    .amt_in,
    p,
    .max_but {
        background-color: var(--bg-light);
        //border-radius: 3px;
    }
}

.col1 {
    border-radius: 3px;
    background-color: var(--bg-light);
    border: 1px solid transparent;
    //display: flex;
    display: grid;
    grid-template-columns: max-content 1fr;
    width: 100%;
    box-sizing: border-box;
    //overflow: auto;
    padding: 8px 14px;
    position: relative;

    //&:hover {
    //    border-color: var(--primary-color-light);
    //}
    //&:focus-within {
    //    border-color: var(--secondary-color);
    //}
}

.ticker {
    border-radius: 3px;
    padding: 8px 14px;
}

p {
    text-align: center;
}

.max_but {
    font-size: 13px;
    opacity: 0.4;

    &:hover {
        opacity: 1;
    }
}

.balance {
    position: absolute;
    font-size: 14px;
    right: 8px;
    color: var(--primary-color-light);
    background-color: transparent !important;
    top: 40px;
    padding: 2px 8px;

    span {
        font-family: monospace;
        padding-left: 14px;
    }
}
</style>
