const firebaseConfig = require('./firebaseConfig.js');
const firestore = firebaseConfig.firestore;


// firebase deploy --only functions
function addDocument(data) {
	firestore.collection(data.collectionName).add({
		activity: "Income",
		storageFileName: data.object.name,
		fileType: data.object.contentType,
		dateUploaded: new Date(),
		ocr: data.ocr,
		taxrate:"25%", 

		...(data.total && {
			taxtotal:parseFloat((data.total * 0.2).toFixed(2)),
			
				/*
				data.taxrate === "25%"
				? parseFloat((data.total * 0.2).toFixed(2)) // 25 / (100 + 25)
				: data.taxrate === "0%"
				? parseFloat((data.total * 0.0).toFixed(2))
				: data.taxrate === "12%"
				? parseFloat((data.total * 0.1071).toFixed(2)) // 12 / (100 + 12)
				: data.taxrate === "6%"
				? parseFloat((data.total * (6 / (100 + 6))).toFixed(2)) // 6 / (100 + 6)
				: parseFloat((data.total * 0.2).toFixed(2)),
				*/
		  }),

		documentType: '',
		exported: false,
		reviewed: false,
		ref: '',
		...(data.name && {
			name: data.name,
		}),
		...(data.category && {
			category: data.category,
		}),
		...(data.date && {
			date: firebaseConfig.admin.firestore.Timestamp.fromDate(data.date),
		}),
		...(data.total && {
			total: data.total,
		}),

	});
}

function matchAndUpdateDocument(data) {
	return firestore
		.collection(data.collectionName)
		.where(data.searchField, '==', `files/${data.searchName}`)
		.limit(1)
		.get()
		.then(query => {
			const document = query.docs[0];
			let temp = document.data();
			if (data.ocr) temp.ocr = data.ocr;
			if (data.name) temp.name = data.name;
			if (data.category) temp.category = data.category;
			if (data.date) temp.date = firebaseConfig.admin.firestore.Timestamp.fromDate(data.date);

			if (data.total || !data.total === null) temp.total = data.total;
			if (data.total || !data.total === null) temp.taxtotal = data.total*0.2;

			document.ref.update(temp);
		});
}

module.exports = { addDocument, matchAndUpdateDocument };
