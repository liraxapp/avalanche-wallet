<template>
    <div>
        <div class="head">
            <h1>Cross Chain</h1>
            <p>
                Transfer tokens between
                <b>Exchange (X)</b>
                ,
                <b>Platform (P)</b>
                and
                <b>Contract (C)</b>
                chains.
            </p>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class CrossChain extends Vue {}
</script>
<style lang="scss" scoped>
h1 {
    font-weight: normal;
}

.head {
    margin-bottom: 14px;
    //display: flex;
    //align-items: center;
    //justify-content: space-between;
}
</style>
