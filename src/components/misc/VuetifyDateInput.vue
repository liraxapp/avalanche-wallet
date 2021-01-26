<template>
    <v-layout row wrap>
        <v-menu
            :close-on-content-click="false"
            offset-y
            transition="scale-transition"
            v-model="fromDateMenu"
        >
            <template v-slot:activator="{ on }">
                <v-text-field
                    :label="label"
                    :value="fromDateDisp"
                    hide-details
                    readonly
                    v-on="on"
                ></v-text-field>
            </template>
            <v-date-picker
                :max="maxDate"
                :min="minDate"
                @input="dateIn"
                locale="en-in"
                no-title
                v-model="dateVal"
            ></v-date-picker>
        </v-menu>
    </v-layout>
</template>
<script>
export default {
    props: {
        label: String,
        minDate: String,
        maxDate: String,
    },
    data() {
        return {
            fromDateMenu: false,
            dateVal: null,

            // minDate: "2019-07-04",
            // maxDate: "2019-08-30",
        }
    },
    computed: {
        fromDateDisp() {
            return this.dateVal
            // format date, apply validations, etc. Example below.
            // return this.fromDateVal ? this.formatDate(this.fromDateVal) : "";
        },
    },
    methods: {
        dateIn() {
            this.fromDateMenu = false
            // console.log(this.dateVal);
        },
    },
    watch: {
        dateVal(val) {
            // console.log(val);
            this.$emit('change', val)
        },
    },
}
</script>
<style lang="scss" scoped>
.layout {
    margin: 0;
}
</style>
