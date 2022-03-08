//const { arrayBuffer } = require("stream/consumers");
const searchWaiterBtn = document.querySelector('#search-Waiter-btn');
const searchFamilieBtn = document.querySelector('#search-Familie-btn');
const btnDranken = document.getElementById('Dranken');
const btnGerechten = document.getElementById('Gerechten');
const btnDesserten = document.getElementById('Desserten');
const btnCTF = document.getElementById('ClearTillFamillie');

let WaiterNames;
let FamilieNames;
let Products;

let tempHTML;
let TempProdHTML;

let WaiterID;

let LastOrderID;
async function SeeLastOrder(){
	const resp = await fetch('https://etentje-server.herokuapp.com/LastOrder/' + WaiterID);
	LastOrderID = await resp.json();
	tempHTML =`
      <p>${LastOrderID[0].id}</p>
      `;
	document.getElementById('PrevOrder').innerHTML = tempHTML;
}

function GetFormattedDate(date) {
	let month = ('0' + (date.getMonth() + 1)).slice(-2);
	let day  = ('0' + (date.getDate())).slice(-2);
	let year = date.getFullYear();
	let hour =  ('0' + (date.getHours())).slice(-2);
	let min =  ('0' + (date.getMinutes())).slice(-2);
	let seg = ('0' + (date.getSeconds())).slice(-2);
	return year + '-' + month + '-' + day + ' ' + hour + ':' +  min + ':' + seg;
}

function WaiterOnHTML(){
	WaiterNames.forEach(element => {
		tempHTML =`
          <p>Ober Naam: ${element.FirstName}</p>
          `;
	});
	document.getElementById('WaiterName').innerHTML = tempHTML;
}
searchWaiterBtn.onclick = async function() {
	WaiterID = document.getElementById('search-Waiter').value;
	const resp = await fetch('https://etentje-server.herokuapp.com/searchWaiter/' + WaiterID);
	WaiterNames = await resp.json();
	WaiterOnHTML();
	SeeLastOrder();
	document.getElementById('FamilyRegion').style.display = 'block';
};

function FamillieOnHTML(){
	if(FamilieNames.length != 0){
		  FamilieNames.forEach(element => {
			tempHTML =`<p>Famillie Naam: ${element.Name}</p>`;
		});
		document.getElementById('FamilyName').innerHTML = tempHTML;
		document.getElementById('OptionBTN').style.display = 'flex';
	}
	else{
		console.log('else');
		tempHTML ='<p>Famillie ID/Naam bestaat niet in het systeem!</p>';
		document.getElementById('FamilyName').innerHTML = tempHTML;
	}
}
searchFamilieBtn.onclick = async function() {
	let FamilieName = document.getElementById('search-Familie').value;
	const resp = await fetch('https://etentje-server.herokuapp.com/searchFamillie/' + FamilieName);
	FamilieNames = await resp.json();
	FamillieOnHTML();
};

function ProductsOnHTML(){
	TempProdHTML = '';
	Products.forEach(element => {
		if(element.Description != 'Hapje'){
			TempProdHTML +=`
      <div class="p">
      <p>${element.Description}</p>
      <input name="IN" type="number" placeholder="0" id="${element.ID}">
      </div>
      `;
		}
   
	});
	document.getElementById('OrderForm').style.display = 'block';
	document.getElementById('BESTELFORM').innerHTML = TempProdHTML;
}

function ClearForm(){
	document.getElementById('BESTELFORM').innerHTML = '';
	document.getElementById('OrderForm').style.display = 'none';
}
function ClearFamillie(){
	document.getElementById('search-Familie').value = '';
	document.getElementById('FamilyName').innerHTML = '';
}
function HideOptionBTN(){
	document.getElementById('OptionBTN').style.display = 'none';
}

btnCTF.onclick = function(){
	ClearFamillie();
	ClearForm();
	HideOptionBTN();
};

btnDranken.onclick = async function(){
	const resp = await fetch('https://etentje-server.herokuapp.com/BestelFormDrank');
	Products = await resp.json();
	ProductsOnHTML();
};
btnGerechten.onclick = async function(){
	const resp = await fetch('https://etentje-server.herokuapp.com/BestelFormGerechten');
	Products = await resp.json();
	ProductsOnHTML();
};
btnDesserten.onclick = async function(){
	const resp = await fetch('https://etentje-server.herokuapp.com/BestelFormDessert');
	Products = await resp.json();
	ProductsOnHTML();
};
const SubmitForm = document.getElementById('Submit');

SubmitForm.onclick = async function(){
	let opmerking = document.getElementById('Opmerking').value;
	let oInputs = new Array();
	oInputs = document.getElementById('BESTELFORM').getElementsByTagName( 'input' ); // store collection of all <input/> elements
	let FamilieName = document.getElementById('search-Familie').value;
	let r = await fetch('https://etentje-server.herokuapp.com/GetFamID/'+FamilieName); // creates new order
	let r_ = await r.json();
	let FamilieID = r_[0].ID;
	let TableID = document.getElementById('search-Table').value;
  
	if(TableID!=''){
		let date = new Date();
		console.log(WaiterID);
		console.log(FamilieID);
		console.log(GetFormattedDate(date));
		console.log(opmerking);
		if(opmerking == ''){
			opmerking = 'NULL';
		}
		await fetch('https://etentje-server.herokuapp.com/NewOrder/'+WaiterID+'/'+FamilieID+'/'+TableID+'/'+GetFormattedDate(date) + '/' + opmerking); // creates new order
		let OrderNumber = await fetch('https://etentje-server.herokuapp.com/NewOrder/'+FamilieID);
		console.log('OrderNumber__');
		OrderNumber = await OrderNumber.json();
		console.log(OrderNumber[0].Capacity);
		console.log(OrderNumber[0].Count);
		const resp = await fetch('https://etentje-server.herokuapp.com/LastOrder/'+WaiterID);//gets last order ID
		let ordID = await resp.json();
		console.log('Waiter ID:');
		console.log(WaiterID);
		console.log('Order ID:');
		console.log(ordID);
		if(OrderNumber[0].Count == 1){
			fetch('https://etentje-server.herokuapp.com/NewOrderLine/'+ordID[0].id+'/'+ 0 +'/'+OrderNumber[0].Capacity);
			console.log('Gratis Hapje');
		}
		for (let i = 0; i < oInputs.length; i++ )
		{ 
			if ( oInputs[i].type == 'number' )
			{
				oInputs[i].value;
				if(oInputs[i].value!=''){
					fetch('https://etentje-server.herokuapp.com/NewOrderLine/'+ordID[0].id+'/'+oInputs[i].id+'/'+oInputs[i].value);
				}
			}
		}
		document.getElementById('SendMessage').innerHTML = '';
		ClearFamillie();
		ClearForm();
		HideOptionBTN();
		SeeLastOrder();
	}
	else{
		document.getElementById('SendMessage').innerHTML = 'Ongeldig tafel nummer';
	}
};
