const express = require('express');
const app = express();

var subTotal = addition(newRequest[1].invoiceLines);
var totalDue = subTotal - newRequest[0].deposit - newRequest[0].discount;

function addition (calc) {

    let x = 0
    calc.forEach((e) => x += e.amount)
    return x;
};



const newRequest = [
    {
        date: "05/89/65",
        invoiceNo: 123456789,
        summary: "BLABLABLABL",
        billTo: "Me",
        billEmail: "YoYo@ghj.com",
        bankName: "TLloyds",
        accountName: "Rob",
        sortCode: "50-45-00",
        accountNumber: "1234567",
        deposit: 25,
        discount: 25, 
        subTotal: 1300,
        totalDue: 1800,
    },
    {
        invoiceLines: [
            {
                description: "Higgedlfy",
                amount: 75
            },
            {
                description: "Higgedlfy",
                amount: 75
            },
            {
                description: "Higgedlfy",
                amount: 75
            },
            {
                description: "Higgedlfy",
                amount: 75
            },
        ],
    },
]


// const newRequest = [
    //     {
    //         date: "",
    //         invoiceNo: 0,
    //         summary: "",
    //         billTo: "",
    //         billEmail: "",
    //         bankName: "",
    //         accountName: "",
    //         sortCode: "",
    //         accountNumber: "",
    //         deposit: 0,
    //         discount: 0, 
    //         subTotal: 0,
    //         totalDue: 0,
    //     },
    //     {
    //         invoiceLines: [
    //             {
    //                 description: "",
    //                 amount: 0
    //             },
    //             {
    //                 description: "",
    //                 amount: 0
    //             },
    //         ],
    //     },
    // ];
    
    // // 3) Math