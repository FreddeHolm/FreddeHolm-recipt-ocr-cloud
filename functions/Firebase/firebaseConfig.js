const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const STORAGE_BUCKET_NAME = 'recipt-scanner-ocr.appspot.com'; // Find name here: https://console.firebase.google.com/u/5/project/recipt-scanner-ocr/settings/general/web:ZDk5NTIzYjEtOTllZi00ZWM4LWIwZDEtYmY3YjJiNWJmMTRh
const firestore = admin.firestore();
const storageBucket = admin.storage().bucket(STORAGE_BUCKET_NAME);

module.exports = { functions, firestore, STORAGE_BUCKET_NAME, storageBucket, admin };
