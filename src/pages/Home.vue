<template>
    <v-container class="main-container" ref="mainContainer" v-show="isLoggedIn()">

        <v-layout class="column" v-show="!driveService.error">
          <v-btn @click="onRepasClick()">Repas</v-btn>
          <v-btn @click="onGasoilClick()">Carburant</v-btn>
          <v-btn @click="onPeageClick()">Peage</v-btn>
          <v-btn @click="onTaxiClick()">Taxi</v-btn>
          <v-btn @click="onParkingClick()">Parking</v-btn>
          <v-btn @click="onMetroClick()">Transports en commun</v-btn>
        </v-layout>

      <div v-show="driveService.error">
        <p>Une action manuelle est requise.</p>
        <p>{{ driveService.error }}</p>
      </div>
    </v-container>
</template>

<style scoped>

</style>

<script>
    import auth from './mixins/auth'
    import { default as driveService } from '../DriveService';

    export default {
        mixins: [auth],
        data () {
            return {
              driveService: driveService
            }
        },
      mounted: function () {
        driveService._ready().then(() => {
          this.$forceUpdate();
        });
      },
        computed: {
        },
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
            onParkingClick: function () {
                this.$router.push({name: 'parking', date: null})
            },
            onMetroClick: function () {
                this.$router.push({name: 'metro', date: null})
            },
        }
    }
</script>
