const express = require('express');
const router = express.Router();
const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require('path');
const pdfTemplate = path.join(__dirname, '..', 'public', 'pdf', 'pdf-template.html');
const htmlPDF = fs.readFileSync(pdfTemplate, "utf8");
const cors = require('cors')

router.use(cors({
    exposedHeaders: ['X-Invoice-Name'], // add this line
}));

router.use(express.urlencoded({ 
    extended: false,
    limit: 10000,
    parameterLimit: 16,

}));

router.post('/', (req, res) => {
    console.log("Form Receiver code loaded router works");
    console.log(req.body);
    writeCredentials(req.body)


});

const footerText = `<footer style="position: absolute; bottom: 0;">
// <div>Invoice generated using Rob Saunders' free Invoice Generator: <a href="https://www.quickinvoicegenerator.co.uk">www.quickinvoicegenerator.co.uk</a></div>
// </footer>`;

const writeCredentials = (data) => {
    console.log(data);
    invoiceName = data.invoice_number;
    console.log(invoiceName);

    const options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        footer: {
            height: "28mm",
            contents: {
                first: footerText ,
                2: 'Second page', // Any page number is working. 1-based index
                default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                last: 'Last Page'
            }
        }
    };

    // 1) Invoice Credentials

    const credentials = {
        name: data.company_name,
        date: data.invoice_date,
        invoiceNo: data.invoice_number,
        summary: data.invoice_summary,
        billTo: data.invoice_bill_to,
        billEmail: data.invoice_bill_to_email
    }

    // 2) Invoice Description

    const description = [
        {
            invoiceLines: [
                {
                    description: data.desc_line1,
                    amount: data.amount_line1
                },
                {
                    description: data.desc_line2,
                    amount: data.amount_line2
                },
            ],
        },
        {
            deposit: data.deposit,
            discount: data.discount, 
        },
    ];

    // 3) Math

    var subTotal = addition(description[0].invoiceLines);
    var totalDue = subTotal - parseInt(description[1].deposit) - parseInt(description[1].discount);

    function addition (calc) {

        let x = 0
        calc.forEach((e) => x += parseInt(e.amount))
        return x;
    };

    // 4) Bank Details

    const bankDetails = 
        {
            bankName: data.bankName,
            accountName: data.accountName,
            sortCode: data.sortCode,
            accountNumber: data.accountNumber,
        };

    var document = {
        html: htmlPDF,
        data: {
            credentials: credentials,
            lines: description[0].invoiceLines,
            description: description[1],
            subTotal: subTotal,
            total: totalDue,
            bank: bankDetails,
        },
        path: path.join(__dirname, '..', 'public', 'pdf', "invoice-123.pdf"),
        type: "",
    };

    
    // By default a file is created but you could switch between Buffer and Streams by using "buffer" or "stream" respectively.

    function create () {

        pdf
        .create(document, options)
        .then((res) => {
            console.log(res);

        })

        .catch((error) => {
            console.error(error);
        });
    
    };

    create()

}

module.exports = router;
