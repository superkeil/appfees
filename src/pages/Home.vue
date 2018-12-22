<template>
    <v-container class="main-container" ref="mainContainer" v-show="isLoggedIn()">

        <v-layout class="column">
            <v-btn @click="onRepasClick()">Repas</v-btn>
            <v-btn @click="onGasoilClick()">Carburant</v-btn>
            <v-btn @click="onPeageClick()">Peage</v-btn>
            <v-btn @click="onTaxiClick()">Taxi</v-btn>
            <v-btn @click="onMetroClick()">Transports en commun</v-btn>
        </v-layout>

    </v-container>
</template>

<style scoped>

</style>

<script>
    import auth from './mixins/auth'

    export default {
        mixins: [auth],
        data () {
            return {
            }
        },
        computed: {},
        methods: {
            onRepasClick: function () {
                this.$router.push({name: 'repas', date: null})
            },
            onGasoilClick: function () {
                this.$router.push({name: 'gasoil', date: null})
            },
            onPeageClick: function () {
                this.$router.push({name: 'peage', date: null})
            },
            onTaxiClick: function () {
                this.$router.push({name: 'taxi', date: null})
            },
            onMetroClick: function () {
                this.$router.push({name: 'metro', date: null})
            },
        }
    }
</script>
