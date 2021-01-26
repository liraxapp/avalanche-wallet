<template>
    <div :active="isPopup" class="dropdown hover_border">
        <button @click="showPopup">
            {{ symbol }}
            <fa icon="caret-down" style="float: right"></fa>
        </button>
        <BalancePopup
            :assets="assetArray"
            :disabled-ids="disabledIds"
            @close="onclose"
            @select="onselect"
            class="popup"
            ref="popup"
        ></BalancePopup>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop, Ref, Model } from 'vue-property-decorator'

import BalancePopup from '@/components/misc/BalancePopup/BalancePopup.vue'
import AvaAsset from '@/js/AvaAsset'

@Component({
    components: {
        BalancePopup,
    },
})
export default class BalanceDropdown extends Vue {
    isPopup: boolean = false

    @Prop({ default: () => [] }) disabled_assets!: AvaAsset[]
    @Model('change', { type: AvaAsset }) readonly asset!: AvaAsset
    @Ref('popup') readonly balancePopup!: BalancePopup

    get assetArray(): AvaAsset[] {
        return this.$store.getters.walletAssetsArray
    }

    get disabledIds(): string[] {
        let disabledIds = this.disabled_assets.map((a) => a.id)
        return disabledIds
    }

    get symbol() {
        let sym = this.asset.symbol
        return sym
    }

    // get isPopup(){
    //     if(this.balancePopup){
    //         return this.balancePopup.isActive;
    //     }
    //     return false;
    // }

    showPopup() {
        this.balancePopup.isActive = true
        this.isPopup = true
    }

    onclose() {
        this.isPopup = false
    }

    onselect(asset: AvaAsset) {
        // this.selected = asset;
        this.balancePopup.isActive = false
        this.isPopup = false

        this.$emit('change', asset)
    }
}
</script>
<style lang="scss" scoped>
button {
    padding: 4px 12px;
    width: 100%;
    height: 100%;
    text-align: left;

    svg {
        transition-duration: 0.2s;
    }
}

.dropdown {
    position: relative;

    &:focus-within {
        outline: 1px solid var(--secondary-color);
    }
}

.dropdown[active] {
    button {
        svg {
            transform: rotateZ(180deg);
        }
    }
}

.popup {
    position: absolute;
}
</style>
