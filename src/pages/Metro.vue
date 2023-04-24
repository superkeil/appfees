<template>
    <v-container class="main-container" ref="mainContainer" v-show="isLoggedIn()">
        <v-btn @click="onBackClick()" color="orange darken-2" dark>
            <v-icon dark left>arrow_back</v-icon>Retour
        </v-btn>

        <h1>{{ this.type }}</h1>
        <v-form>
            <v-text-field
                    label="date"
                    v-model="date"
                    type="date"
            ></v-text-field>
            <v-text-field
                    label="TTC"
                    v-model="ttc"
                    type="text"
                    @keyup="calculateTva20()"
            ></v-text-field>
            <v-text-field
                    label="TVA 20%"
                    v-model="tva20"
                    type="text"
            ></v-text-field>
            <v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
                <img :src="imageUrl" height="150" v-if="imageUrl"/>
                <v-text-field label="Image" @click="pickFile()" v-model="imageName" prepend-icon="attach_file"></v-text-field>
                <input
                        type="file"
                        style="display: none"
                        ref="image"
                        accept="image/jpeg;capture=camera"
                        @change="onFilePicked($event)"
                >
            </v-flex>

            <v-container class="text-xs-right">
                <v-btn color="primary" type="button" @click="onValidClick">
                    Valider<v-icon dark right>check_circle</v-icon>
                </v-btn>
            </v-container>
        </v-form>


        <v-snackbar :timeout="10000" :top="true" v-model="snackbar">
            {{ snackbarText }}
            <v-btn flat color="pink" @click.native="snackbar = false">Fermer</v-btn>
        </v-snackbar>
    </v-container>
</template>

<style scoped>

</style>

<script>
    import upload from './mixins/upload'
    import auth from './mixins/auth'

    export default {
        mixins: [upload, auth],
        data () {
            return {
                type: 'Transport en commun',
                tva20: null,
                ttc: null,
                date: this.$moment().format('YYYY-MM-DD').toString(),

                imageName: '',
                imageUrl: '',
                imageFile: '',

                snackbar: false,
                snackbarText: '',
            }
        },
        computed: {},
        methods: {
            onValidClick: function () {
                this.submit({
                    type: this.type,
                    date: this.$moment(this.date).format('DD/MM/YYYY').toString(),
                    ttc: Number(this.ttc),
                    tva20: Number(this.tva20),
                    tva10: 0,
                    tva5_5: 0,
                    client: '',
                });
            },
        }
    }
</script>
