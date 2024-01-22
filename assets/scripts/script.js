
const form = document.getElementById('form');
const getInvoice = document.getElementById('get-invoice');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    const urlencoded = new URLSearchParams(fd).toString();

    fetch('https://free-pdf-invoice-generator-yra5.vercel.app:3000/invoice', {
        method: "POST",
        body: urlencoded,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',

        }
    });

    alert("Invoice has been generated.")

});

let invoiceName = "Hello";

getInvoice.addEventListener('click', (e) => {
    
    e.preventDefault();

    fetch('https://free-pdf-invoice-generator-yra5.vercel.app:1234', {
        method: "GET"

    }).then(response => {

        // Check response code
        if(response.status === 404) {
            alert('File does not exist');
            throw new Error('File does not exist');

        }
        // Access the custom header
        invoiceName = response.headers.get('X-Invoice-Name');
    
        // Proceed to get the blob for the PDF
        return response.blob();

    }).then(blob => {
        // Create a link element, use it to download the blob, and remove it
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // Use the invoiceName for the download filename if it was successfully retrieved
        a.download = invoiceName ? `Invoice-${invoiceName}.pdf` : 'Your Invoice.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a); // Clean up
        
    }).catch(error => {
        console.error('Fetch error:', error);
    });
    


})