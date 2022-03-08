const searchFamilieBtn = document.querySelector('#search-Familie-btn');
let PayOrder = document.querySelector('#PayOrder');
let PayAllOrder = document.querySelector('#PayAllOrder');
let AllOrders;
let OrdersLines;
let OrdersTotal;
let Reciept;


function OrdersLinesOnHTML(){
	let T_HTML = '<h2>Order Lines</h2>';
	//console.log(OrdersLines);
	OrdersLines.forEach(element => {
		T_HTML +=`
      <div class="Order">
          <p><b>Order ID: ${element.ID}</b> <br> Quantity: ${element.Quantity} <br> Description: ${element.Description} <br> Price: <b>${Math.round((element.Price + Number.EPSILON) * 100) / 100}€</b> <br> Total: <b>${Math.round((element.Price + Number.EPSILON) * 100) / 100}€</b></p>
      </div>
          `;
	});
	document.getElementById('F_AllLines').innerHTML = T_HTML;
	
}
  
function RecieptOnHTML(FID){
	let T_HTML = `<h2>Reciept</h2>
    <div id="PrintableReciept" class="Order">
    <p>Familie ID: ${FID}</p>
    `;
	let TOTALONRECIEPT = 0;
	//console.log(Reciept);
	Reciept.forEach(element => {

		TOTALONRECIEPT += element.Totaal;
		T_HTML +=`
        <p>${element.Quantity} ${element.Description} €${Math.round((element.Totaal + Number.EPSILON) * 100) / 100}</p>
        `;
	});
	T_HTML += `
    <p>Totaal: €${Math.round((TOTALONRECIEPT + Number.EPSILON) * 100) / 100}
    </div>
    `;
	document.getElementById('F_Reciept').innerHTML = T_HTML;
}
function AllTotalOnHTML(){
	let T_HTML = '';
	//console.log(OrdersTotal);
	OrdersTotal.forEach(element => {
		T_HTML +=`
          <p>Familie: ${element.Name} <br>Totaal: <b>€${Math.round((element.Totaal + Number.EPSILON) * 100) / 100}</b></p>
          `;
	});
	document.getElementById('F_total').innerHTML = T_HTML;
}
function OrdersAndTotalOnHTML(){
	let T_HTML = '<h2>Orders Totals</h2>';
	//console.log(AllOrders);
	AllOrders.forEach(element => {
		T_HTML +=`
      <div class="Order">
        <p class="r"><b>Order ID: ${element.ID}</b> </p><p class="r"> Total: <b>€${Math.round((element.OrderTotal + Number.EPSILON) * 100) / 100}</b></p><input type="checkbox" value="${element.ID}">
      </div>
      `;
	});
	document.getElementById('F_AllOrder').innerHTML = T_HTML;
}
async function OrderLines(){
	let FamilieName = document.getElementById('search-Familie').value;
	//console.log(FamilieName);
	const resp = await fetch('https://etentje-server.herokuapp.com/OrderLines/' + FamilieName);
	OrdersLines = await resp.json();
	//console.log(OrdersLines);
	OrdersLinesOnHTML();
}
async function OrderAndTotal(){
	let FamilieName = document.getElementById('search-Familie').value;
	//console.log(FamilieName);
	const resp = await fetch('https://etentje-server.herokuapp.com/OrderAndTotal/' + FamilieName);
	AllOrders = await resp.json();
	//console.log(OrdersLines);
	OrdersAndTotalOnHTML();
}
async function GetReciept(){
	let FamilieName = document.getElementById('search-Familie').value;
	//console.log(FamilieName);
	const resp = await fetch('https://etentje-server.herokuapp.com/Reciept/' + FamilieName);
	Reciept = await resp.json();
	//console.log(`Reciept: ${Reciept}`);
	RecieptOnHTML(FamilieName);
}
async function AllTotal(){
	let FamilieName = document.getElementById('search-Familie').value;
	//console.log(FamilieName);
	const resp = await fetch('https://etentje-server.herokuapp.com/AllTotal/' + FamilieName);
	OrdersTotal = await resp.json();
	//console.log(OrdersTotal);
	AllTotalOnHTML();
}
PayAllOrder.onclick = async function() {
	let checkbox = document.querySelectorAll('input[type="checkbox"]');
	let paymethod = document.getElementById('PaymentWay').value;
	//console.log(paymethod)
	//console.log(checkbox.length);
	for (let i = 0; i < checkbox.length; i++) { 
		console.log(checkbox[i].value);
		console.log('paymethod');
		console.log(paymethod);

		if(paymethod!=''){
			await fetch('https://etentje-server.herokuapp.com/PayOrder/' + checkbox[i].value + '/' + paymethod);
			document.getElementById('PayMelding').innerHTML = `Betaald Met ${paymethod}`;
		}
		else
		{
			document.getElementById('PayMelding').innerHTML = 'Error: Selecteer een betaal methode';
		}
	}
	AllTotal();
	OrderAndTotal();
	OrderLines();
	GetReciept();
};

PayOrder.onclick = async function() {
	let checkbox = document.querySelectorAll('input[type="checkbox"]:checked');
	let paymethod = document.getElementById('PaymentWay').value;
	//console.log(paymethod)
	//console.log(checkbox.length);
	for (let i = 0; i < checkbox.length; i++) { 
		console.log(checkbox[i].value);
		console.log('paymethod');
		console.log(paymethod);

		if(paymethod!=''){
			await fetch('https://etentje-server.herokuapp.com/PayOrder/' + checkbox[i].value + '/' + paymethod);
			document.getElementById('PayMelding').innerHTML = `Betaald Met ${paymethod}`;
		}
		else
		{
			document.getElementById('PayMelding').innerHTML = 'Error: Selecteer een betaal methode';
		}
	}
	AllTotal();
	OrderAndTotal();
	OrderLines();
	GetReciept();
};
searchFamilieBtn.onclick = function() {
	document.getElementById('PayOrder').style.display = 'block';
	AllTotal();
	OrderAndTotal();
	OrderLines();
	GetReciept();
};