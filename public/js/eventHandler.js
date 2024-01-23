const companyName = document.getElementById('preview-company-name');
const userCompanyName = document.getElementById('company_name');
const subTotal = document.getElementById('preview-subtotal');
const amount1 = document.getElementById('preview-amount_line1');
const amount2 = document.getElementById('preview-amount_line2');
const deposit = document.getElementById('preview-deposit');
const discount = document.getElementById('preview-discount');
const total = document.getElementById('preview-total');
var fileReady = false;

const eventHandler = (e) => {
    
    // Log the event
    console.log(e);

    // Check if mouse click or key down
    document.getElementById(`preview-${e.target.id}`).innerHTML = e.target.value;

    if(!math()) {
        null;

    } else {
        subTotal.innerHTML=math();
    }

    if(!invoiceTotal()) {
        console.log(total);

    } else {
        total.innerHTML=invoiceTotal();

    };

};


const math = () => {
    let num = 0;

    return num = parseInt(amount1.textContent) + parseInt(amount2.textContent);

};

const invoiceTotal = () => {
    let num = 0;

    return num = parseInt(subTotal.textContent) - parseInt(discount.textContent) - parseInt(deposit.textContent);

};