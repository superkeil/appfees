
const auth = {
    methods: {
        isLoggedIn: function () {
            return window.gapi && gapi.auth2 && gapi.auth2.getAuthInstance() && gapi.auth2.getAuthInstance().isSignedIn.get()
        },
    },
};

export default auth;
