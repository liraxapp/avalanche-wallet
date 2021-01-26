<template>
    <div class="hex_img">
        <img class="hex_img" src="@/assets/hex.svg" v-if="!isAva" />
        <img class="hex_img" src="@/assets/hex_ava.svg" v-else />
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class FungibleRow extends Vue {
    @Prop({ default: false }) isAva?: boolean
}
</script>
<style lang="scss" scoped>
.hex_img {
    display: flex;
    justify-content: center;
    align-items: center;
}

img.hex_img {
    width: 100% !important;
    object-position: center;
    object-fit: contain;
}
</style>
