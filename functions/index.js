/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */




/* FIX JAVA  https://www.youtube.com/watch?v=Tz0dj-DpxDo
*/
/* Video https://www.youtube.com/watch?v=_AoQOzh1CCE
*/

/* start code: (Se till att java är avstängt)
firebase emulators:start
http://127.0.0.1:4000/firestore/data

Deploy function: 
firebase deploy --only functions


*/

//const {onRequest} = require("firebase-functions/v2/https");
const functions = require('firebase-functions');
const processors = require('./processors');

//const logger = require("firebase-functions/logger");

exports.uploadFile = functions.storage.object().onFinalize(async object => {
	if (object.name.indexOf('files/') === 0) { //avgör om filen är en pdf eller något annat (tex jpeg eller png)
		if (object.contentType === 'application/pdf') {
			processors.processPdf(object);
		} else if (object.contentType === 'image/jpeg' || object.contentType === 'image/png') {
			processors.processImage(object);
		}
	} else if (object.name.indexOf('pdfFiles/') === 0) {
		processors.processJson(object);
	}
});
    /*if (object.name.indexOf('files/') === 0) {
		if (object.contentType === 'application/pdf') {
			processors.processPdf(object);
		} else if (object.contentType === 'image/jpeg' || object.contentType === 'image/png') {
			processors.processImage(object);
		}
	} else if (object.name.indexOf('pdfFiles/') === 0) {
		processors.processJson(object);
	}
    */
