const searchFamilieBtn = document.querySelector('#search-Familie-btn');
let returnMessage;
let famillies;

searchFamilieBtn.onclick = async function() {
	let FamilieID = document.getElementById('search-Familie').value;
	let Capacity = document.getElementById('capacity').value;
	console.log(FamilieID);
	const resp = await fetch('https://etentje-server.herokuapp.com/searchFamillie/' + FamilieID);
	famillies = await resp.json();
	console.log('famillies');
	console.log(famillies);
	if(famillies.length == 0){
		await fetch('https://etentje-server.herokuapp.com/newFam/' + FamilieID + '/'+ Capacity);
		returnMessage = 'Famillie succesvol toegevoegd';
		console.log(returnMessage);
	}
	else{
		returnMessage = 'Famillie bestond al en is dus niet toegevoegd. Kies een andere naam!';
		console.log(returnMessage);
	}
	returnMessageOnHTML();
	document.getElementById('OptionBTN').style.display = 'flex';
};
function returnMessageOnHTML(){
	let tempHTML = `<p>${returnMessage}</p>`;
	AfterSentMessage.innerHTML = tempHTML;
}