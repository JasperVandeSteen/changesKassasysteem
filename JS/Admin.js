var OrderForDetails;
var tenOrders;
/*
window.setTimeout(function () {
    window.location.reload();
  }, 10000);*/
  LastTenOrder();
async function LastTenOrder(){
    const resp = await fetch('https://etentje-server.herokuapp.com/LastTenOrders');
    tenOrders = await resp.json();
    console.log(tenOrders);
    AllTotalOnHTML()
}
async function OrderDetails(){
    const resp = await fetch('https://etentje-server.herokuapp.com/DetailsOrder/' + OrderForDetails);
    OrdersTotal = await resp.json();
    //console.log(Orders);
    AllTotalOnHTML()
}

document.querySelector('#print-btn').onclick = async function() {
    var from = document.getElementById('from_O_ID').value;
    var to = document.getElementById('to_O_ID').value;
    for(var i = from; i<=to; i++){
        if(document.getElementById('Bar').checked==true){
            await fetch('https://etentje-server.herokuapp.com/ReprintStatusUpdateBar/' + i);
            console.log(`updating bar ${i}`)
        }
        if(document.getElementById('Keuken').checked==true){
            await fetch('https://etentje-server.herokuapp.com/ReprintStatusUpdateKeuken/' + i);
            console.log(`updating keuken ${i}`)
        }
    }
}

function AllTotalOnHTML(){
    var T_HTML;
    tenOrders.forEach(element => {
        T_HTML+=`
        <p>${element.ID} - ${element.Waiter_ID} - ${element.TimeWeb.substring(11,element.TimeWeb.length-5)}<p>
        `;  
        LastTenOrders.innerHTML = T_HTML;
    });
}