<template>
    <v-app>
        <div class="modal-loader" v-if="loading > 0">
            <v-progress-circular
                    :size="70"
                    :width="7"
                    color="green"
                    indeterminate
            ></v-progress-circular>
        </div>
        <v-toolbar class="no-print">
            <v-toolbar-title>{{officeName}}</v-toolbar-title>
        </v-toolbar>
        <v-content class="main-content" ref="mainContent">
            <router-view v-if="gapiSignedIn"></router-view>
            <v-container class="main-container" v-if="!gapiSignedIn">

                <v-layout class="column">
                    <v-btn @click="onLoginClick()">Se connecter</v-btn>
                </v-layout>

            </v-container>
        </v-content>
    </v-app>
</template>

<style scoped>
    @media print {
        body, .main-content {
            margin: 0 !important;
            padding: 0 !important;;
        }
    }
    .modal-loader {
        position: absolute;
        display: flex;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        background-color: #fff;
        opacity: 0.5;
        justify-content: center;
        align-items: center;
    }
</style>

<script>
    import EventBus from './EventBus'
    export default {
        data () {
            return {
                officeName: 'Notes de frais',
                loading: 0,
                gapiSignedIn: false,
            }
        },
        mounted: function () {
            EventBus.$on('loading', loading => {
                this.loading += loading ? 1 : -1
                if (this.loading < 0) {
                    this.loading = 0
                }
            })
            const waitFor = function (condition, action, timeout) {
                if (!timeout) {
                    timeout = 300;
                }
                if (condition()) {
                    action();
                } else {
                    setTimeout(() => {
                        waitFor(condition, action, timeout);
                    }, timeout);
                }
            };
            waitFor(() => !!window.gapi, () => gapi.load('client:auth2', this.initClient));
        },
        computed: {
        },
        methods: {
            initClient: function () {
                const SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets';
                const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest", "https://sheets.googleapis.com/$discovery/rest?version=v4"];
                const CLIENT_ID = '...';
                const API_KEY = '...';

                gapi.client.init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    discoveryDocs: DISCOVERY_DOCS,
                    scope: SCOPES
                }).then(() => {
                    // Listen for sign-in state changes.
                    gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

                    // Handle the initial sign-in state.
                    this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                }, function(error) {
                    alert(JSON.stringify(error, null, 2));
                });
            },
            updateSigninStatus: function (isSignedIn) {
                this.gapiSignedIn = isSignedIn
            },
            onLoginClick: function () {
                gapi.auth2.getAuthInstance().signIn();
            },
        },
    }
</script>
