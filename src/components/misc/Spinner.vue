<template>
    <p
        :style="{
            color: color,
        }"
        class="spinner"
    >
        <fa icon="spinner"></fa>
    </p>
</template>
<script>
export default {
    props: {
        color: {
            type: String,
            default: '#fff',
        },
    },
}
</script>
<style lang="scss" scoped>
.spinner {
    width: 20px;
    height: 20px;
    animation-name: spin;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    transform-origin: center;
    display: flex;
    justify-content: center;
    align-items: center;
}

@keyframes spin {
    from {
        transform: rotateZ(0deg);
    }
    to {
        transform: rotateZ(360deg);
    }
}
</style>
