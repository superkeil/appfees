const Utils = {
    waitFor: function (condition, action, timeout) {
        if (!timeout) {
            timeout = 300;
        }
        if (condition()) {
            action();
        } else {
            setTimeout(() => {
                Utils.waitFor(condition, action, timeout);
            }, timeout);
        }
    }
};

const DriveService = function () {
    this.init();
};
DriveService.prototype = {
    rootFolder: null,
    rootFile: null,
    error: '',
    _ready: function () {
        return new Promise(resolve => {
            Utils.waitFor(() => !!this.rootFile, () => {
                resolve();
            });
        });
    },
    init: function () {
        return new Promise(
            resolve => {
                Utils.waitFor(() => !!window.gapi && !!gapi.client && !!gapi.client.drive && !!gapi.client.sheets && !!gapi.auth2 && gapi.auth2.getAuthInstance().isSignedIn.get(), () => {
                    gapi.load('client:auth2', () => {
                        return this.getFolder('AppFees')
                            .then(result => {
                                if (result) {
                                    this.rootFolder = result
                                    this.initRootFile()
                                        .then(() => resolve());
                                } else {
                                    return this.createFolder('AppFees', null)
                                        .then(folder => {
                                            this.rootFolder = folder;
                                            this.initRootFile()
                                                .then(() => resolve());
                                        })
                                }
                            })
                    })
                });
            }
        );
    },
    initRootFile: function () {
        return this.getRootFile('AppFees', this.rootFolder)
            .then(result => {
                if (!!result) {
                    return this.getValueAt('F1', result)
                        .then(value => {
                            if (value !== 'TVA 5.5%') {
                                this.error = 'Insérez manuellement une nouvelle colonne en F du fichier AppFees de votre Google Drive, et intitulez "TVA 5.5%"';
                                console.log(this.error)
                                this.rootFile = result;
                            } else {
                                this.rootFile = result;
                            }
                        });
                } else {
                    return this.createRootFile('AppFees', this.rootFolder)
                        .then(result => {
                            this.rootFile = result;
                            return this.append({
                                type: 'Type',
                                date: 'Date',
                                ttc: 'TTC',
                                tva20: 'TVA 20%',
                                tva10: 'TVA 10%',
                                tva5_5: 'TVA 5.5%',
                                client: 'Client',
                                image: {webViewLink: 'Reçu'},
                            });
                        });
                }
            });
    },
    getValueAt: function (cell, rootFile) {
        const request = {
            spreadsheetId: rootFile.id,
            range: cell + ':' + cell,
            majorDimension: 'COLUMNS',
            valueRenderOption: 'UNFORMATTED_VALUE',
        };
        return gapi.client.sheets.spreadsheets.values.get(request)
            .then(response => {
                return !!response.result.values && response.result.values.length > 0 && response.result.values[0].length > 0 ? response.result.values[0][0] : null;
            });
    },
    getRootFile: function (name, parentFolder) {
        let q = `mimeType='application/vnd.google-apps.spreadsheet' and name='${name}' and trashed=false`;
        if (!!parentFolder) {
            q += ` and '${parentFolder.id}' in parents`
        }
        return gapi.client.drive.files.list({
            q,
            fields: "files(id, name)"
        }).then(response => {
            const files = response.result.files;
            return files && files.length > 0 ? files[0] : null;
        });
    },
    createRootFile: function (name, parentFolder) {
        const fileMetadata = {
            name: name,
            properties: {
                title: name,
            },
            sheets: [
                {
                    properties: {
                        title: 'Feuille 1'
                    }
                }
            ],
            mimeType: 'application/vnd.google-apps.spreadsheet'
        };
        if (!!parentFolder) {
            fileMetadata.parents = [parentFolder.id];
        }
        return gapi.client.drive.files
            .create({
                resource: fileMetadata,
                fields: 'id'
            })
            .then(response => {
                return {id: response.result.id, name}
            })
    },
    getFolder: function (name, parentFolder) {
        let q = `mimeType='application/vnd.google-apps.folder' and name='${name}' and trashed=false`;
        if (!!parentFolder) {
            q += ` and '${parentFolder.id}' in parents`
        }
        return gapi.client.drive.files.list({
            q,
            fields: "files(id, name)"
        }).then(response => {
            const files = response.result.files;
            return files && files.length > 0 ? files[0] : null;
        });
    },
    createFolder: function (name, parentFolder) {
        const fileMetadata = {
            name: name,
            mimeType: 'application/vnd.google-apps.folder'
        };
        if (!!parentFolder) {
            fileMetadata.parents = [parentFolder.id];
        }
        return gapi.client.drive.files
            .create({
                resource: fileMetadata,
                fields: 'id'
            })
            .then(response => {
                return {id: response.result.id, name}
            })
    },
    getFileById: function (fileId) {
        return gapi.client.drive.files.get({
            fileId,
            fields: "id, name, webViewLink"
        }).then(response => {
            console.log(response)
            return !!response.result ? response.result : null;
        });
    },
    uploadImage: function (filename, file, folder) {
        console.log(file);
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64 = reader.result;
                const metadata = {
                    'name': `${filename}.pdf`,
                    'mimeType': 'application/pdf',
                    'parents': [folder.id],
                };

                const doc = new window.PDFDocument();
                doc.image(base64, undefined, undefined, {width: 450});
                const stream = doc.pipe(window.blobStream());
                doc.end();
                stream.on('finish', () => {
                    const blob = stream.toBlob('application/pdf');
                    const form = new FormData();
                    form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
                    form.append('file', blob);

                    const accessToken = gapi.auth.getToken().access_token;
                    const xhr = new XMLHttpRequest();
                    xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
                    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
                    xhr.responseType = 'json';
                    xhr.onload = () => {
                        return this.getFileById(xhr.response.id)
                            .then(image => resolve(image));
                    };
                    xhr.send(form);
                });
            };
        });
    },
    append: function (data) {
        return this._ready()
            .then(() => {
                const request = {
                    spreadsheetId: this.rootFile.id,
                    range: 'Feuille 1',
                    valueInputOption: 'USER_ENTERED',
                    resource: {
                        values: [[
                            data.type,
                            data.date,
                            data.ttc,
                            data.tva20,
                            data.tva10,
                            data.tva5_5,
                            data.client,
                            data.image.webViewLink,
                        ]],
                    },
                };
                return gapi.client.sheets.spreadsheets.values.append(request);
            });
    },
    getAllClients: function (data) {
        return this._ready()
            .then(() => {
                const request = {
                    spreadsheetId: this.rootFile.id,
                    range: 'G2:G',
                    majorDimension: 'COLUMNS',
                    valueRenderOption: 'UNFORMATTED_VALUE',
                };
                return gapi.client.sheets.spreadsheets.values.get(request)
                    .then(response => {
                        return !!response.result.values && response.result.values.length > 0 ? response.result.values[0] : [];
                    });
            });
    }
};

export default new DriveService();
