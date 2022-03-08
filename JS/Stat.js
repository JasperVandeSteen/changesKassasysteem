let prodquan;
function DrawTotals(){
	let T_HTML = '<h2>Order Lines</h2>';
	prodquan.forEach(element => {
		if(element.Quantity !=  null) {
			T_HTML +=`
          <p><b>${element.Description}:</b> ${element.Quantity}</p>
          `;
		}
		else{
			T_HTML +=`
      <p><b>${element.Description}:</b> 0</p>
      `;
		}
	});
	document.getElementById('TotCheck').innerHTML = T_HTML;  
}
async function GetOrderQuan(){
	const resp = await fetch('https://etentje-server.herokuapp.com/GetProductTotQuan');
	prodquan = await resp.json();
	console.log(prodquan);
	DrawTotals();
}
GetOrderQuan();
