<template>
    <div class="access_view">
        <b-container>
            <b-row align-h="center">
                <b-col lg="10" md="12">
                    <transition mode="out-in" name="fade">
                        <router-view class="access_card"></router-view>
                    </transition>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>
<style lang="scss" scoped>
@use "../../main";

.access_view {
    display: flex;
    justify-content: center;
    align-items: center;
}

.access_card {
    text-align: center;
}
</style>
