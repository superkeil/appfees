import EventBus from '../../EventBus'
import { default as driveService } from '../../DriveService'

const upload = {
    methods: {
        onBackClick: function () {
            this.$router.go(-1)
        },
        calculateTva10: function () {
            //this.tva10 = ((this.ttc - 6*this.tva20) / 11).toFixed(2);
            this.tva10 = ((this.ttc - (1.2 * this.tva20) / 0.2 - (1.055 * this.tva5_5) / 0.055) / 11).toFixed(2);
            if (Number(this.tva10) === 0) {
                this.tva10 = 0;
            }
        },
        calculateTva20: function () {
            this.tva20 = (this.ttc / 6).toFixed(2)
        },
        pickFile () {
            this.$refs.image.click()
        },
        onFilePicked (e) {
            const files = e.target.files
            if(files[0] !== undefined) {
                this.imageName = files[0].name
                if(this.imageName.lastIndexOf('.') <= 0) {
                    return
                }
                const fr = new FileReader ()
                fr.addEventListener('load', () => {
                    this.imageUrl = fr.result
                    this.imageFile = files[0] // this is an image file that can be sent to server...
                })
                fr.readAsDataURL(files[0])
            } else {
                this.imageName = ''
                this.imageFile = ''
                this.imageUrl = ''
            }
        },
        submit: function (data) {
            EventBus.$emit('loading', true);
            this.snackbarText = "Enregistrement en cours";
            this.snackbar = true;
            const file = this.imageFile;
            const yearMonth = this.$moment(this.date).format('YYYY-MM').toString();
            const yearMonthDay = this.$moment(this.date).format('YYYY-MM-DD').toString();
            const typeForFilename = this.type.replace(/ /g, '_');
            driveService.getFolder(yearMonth, driveService.rootFolder)
                .then(folder => {
                    if (!folder) {
                        return driveService.createFolder(yearMonth, driveService.rootFolder)
                            .then(folder => {
                                return driveService.uploadImage(`${yearMonthDay}_${typeForFilename}_${file.name}`, file, folder);
                            })
                    } else {
                        return driveService.uploadImage(`${yearMonthDay}_${typeForFilename}_${file.name}`, file, folder);
                    }
                })
                .then(imageData => {
                    data.image = imageData;
                    return driveService
                        .append(data)
                        .then(() => {
                            EventBus.$emit('loading', false);
                            this.snackbarText = 'Enregistré';
                            this.snackbar = true;
                        })
                });
        }
    },
};

export default upload;
