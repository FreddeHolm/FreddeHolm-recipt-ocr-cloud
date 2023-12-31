const firebaseConfig = require('./firebaseConfig.js');
const firestore = firebaseConfig.firestore;


/* 
firebase deploy --only functions
*/
function addDocument(data) {
	const fileId = data.object.name.replace('files/', '');
  
	// Query "fileDetails" collection to find entry with matching ID
	return firestore.collection('fileDetails')
	  .where('id', '==', fileId)
	  .limit(1)
	  .get()
	  .then(fileDetailsQuery => {
		const fileDetailsDoc = fileDetailsQuery.docs[0];
  
		// Initialize ultimateLink to a default value or placeholder
		let ultimateLinker = 'default-placeholder-link';
		let ultimateFileNamer = 'default-placeholder-filename';
  
		// Check if a matching fileDetails entry is found
		if (fileDetailsDoc) {
		  const fileDetailsData = fileDetailsDoc.data();
  
		  // Use the URL from fileDetails if available
		  ultimateLinker = fileDetailsData.url;
		  ultimateFileNamer = fileDetailsData.fileName;

		} else {
		  console.error(`No matching entry found in fileDetails for ID: ${fileId}`);
		  ultimateLinker = "No matching entry found in fileDetails";
		  ultimateFileNamer = "No matching filename found in fileDetails ";
		}
  
		// Continue with the document creation
		return firestore.collection(data.collectionName).add({
		  activity: "Income",
		  storageFileName: data.object.name,
		  fileType: data.object.contentType,
		  dateUploaded: new Date(),
		  ocr: data.ocr,
		  taxrate: "25%",
  
		  ...(data.total && {
			taxtotal: parseFloat((data.total * 0.2).toFixed(2)),
			
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

		  
		  ...(data.total && data.taxtotal && {
			taxlesstotal: parseFloat((data.total *0.8).toFixed(2)),
			
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
		  ...(data.category ? {
			category: data.category,
		  }
		 : {
			category: '',
		  }),
		  ...(data.date && {
			date: firebaseConfig.admin.firestore.Timestamp.fromDate(data.date),
		  }),
		  ...(data.total && {
			total: data.total,
		  }),
  
		  ultimateLink: ultimateLinker,

		  ultimateFileName: ultimateFileNamer
  
		  //id: data.object,
		});
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
			if (data.total || !data.total === null) temp.taxlesstotal = data.total*0.8;

			document.ref.update(temp);
		});
}

module.exports = { addDocument, matchAndUpdateDocument };


/*

Inga nya märken - kommer bli en långsammare försäljning

Märken med väldigt höga kvantiteter, tar långt tid att sälja slut på
En del svårsålda märken, typ skåne, jämtland gottland etc flaggorna 


20 000 nu
15 000 om 18 månader

*/