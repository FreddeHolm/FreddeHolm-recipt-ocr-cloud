

function findStrings(str) {
	const matchStrings = [ //TODO: ADD more companies here
		{ matchString: 'walmart', name: 'Walmart', category: 'Supplies' },
		{ matchString: 'more doing', name: 'Home Depot', category: 'Maintenance' },
		{ matchString: 'sandbox company', name: 'Sandbox Company', category: 'Maintenance' },
		{ matchString: 'costco', name: 'Costco', category: 'Supplies' },
		{ matchString: 'main street', name: 'Main street restaurant', category: 'Meals' },

	];

	const searchString = str.toLowerCase();
	const matchObject = matchStrings.filter(obj => {
		return searchString.includes(obj.matchString);
	});

	return matchObject.length > 0 ? matchObject[0] : { matchString: null };
}

function findDate(str) {
	//  9/12/22 25/8/2022 9-18-2022
	const reg = /[0-3]?[0-9][\/\-][0-3]?[0-9][\/\-][0-9]?[0-9]?[0-9][0-9]/g; // amerikanskt cp datum system

	const matches = str.match(reg);

	if (matches) {
		const dateObj = extractDate(matches[0]);
		return dateObj;
	} else {
		return '';
	}
}

function extractDate(dateStr) { // kollar vilket datumformat det är , tex om det är format 8/25/22 25/8/2022 
	const firstReg = /(?<![\/\-])[0-9]?[0-9](?=[\/\-])/;
	const secondReg = /(?<=[\/\-])[0-9]?[0-9](?=[\/\-])/;
	const thirdReg = /(?<=[\/\-])[0-9]?[0-9]?[0-9][0-9](?![\/\-])/;

	const firstDigit = parseInt(dateStr.match(firstReg)[0]);
	const secondDigit = parseInt(dateStr.match(secondReg)[0]);
	const thirdDigit = parseInt(dateStr.match(thirdReg)[0]);

	let yearNum = -1;
	let monthNum = -1;
	let dayNum = -1;

	if (thirdDigit < 50) {
		yearNum = 2000 + thirdDigit;
	} else if (thirdDigit > 2000) {
		yearNum = thirdDigit;
	}

	if (firstDigit < 13 && secondDigit < 32) {
		monthNum = firstDigit - 1;
		dayNum = secondDigit;
	} else if (secondDigit < 13 && firstDigit < 32) {
		dayNum = firstDigit - 1;
		monthNum = secondDigit;
	}

	if (yearNum > -1 && monthNum > -1 && dayNum > -1) {
		return new Date(yearNum, monthNum, dayNum, 12);
	}
}

/* old
function findTotal(str) { //bör hitta totala summan, kanske måste anpassas bort från dollar till sek
	const reg = /\d{0,3}?[,]?\d{0,3}?[,]?\d{0,3}?[,]?\d{0,3}?[,]?\d{0,3}[.]\d{2}/g;

	const extractedTotal = str.match(reg);

	if (extractedTotal?.length > 0) {
		return extractedTotal[extractedTotal.length - 1];
	}
}
*/

function findTotal(str) {
    const reg = /\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g;

    const extractedTotal = str.match(reg);

    if (extractedTotal?.length > 0) {
        return extractedTotal[extractedTotal.length - 1].replace(',', '');
    }
}


async function parseAll(str) {
	const [date, matchedString, total] = await Promise.all([
		findDate(str),
		findStrings(str),
		findTotal(str),
	]);

	return {
		...(date && {
			date: date,
		}),
		...(matchedString && {
			matchedString: matchedString,
		}),
		...(total && {
			total: total,
			taxtotal: total*0.2,
			taxlesstotal: total*0.8,
		}),
	};
}

module.exports = { parseAll };