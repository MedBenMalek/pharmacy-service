const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const uniqid = require('uniqid');

const port = process.argv.slice(2)[0];
const app = express();
app.use(bodyParser.json());

let stock = [
    {
        id: "1",
        name: 'Abatacept',
        price: 250,
        indications: 'Abatacept is a drug used to treat autoimmune diseases like rheumatoid arthritis, by interfering with the immune activity of T cells.'
    },
    {
        id: "2",
        name: 'Abilify',
        price: 150,
        indications: 'Aripiprazole, sold under the brand name Abilify among others, is an atypical antipsychotic. It is primarily used in the treatment of schizophrenia and bipolar disorder.'
    },
    {
        id: "3",
        name: 'Paracetamol',
        price: 25,
        indications: 'Paracetamol, also known as acetaminophen and APAP, is a medication used to treat pain and fever.'
    },
    {
        id: "4",
        name: 'Fluconazole',
        price: 350,
        indications: 'Fluconazole is an antifungal medication used for a number of fungal infections.'
    }
];

//getStock
app.get('/stock', (req, res) => {
    console.log('Returning stock list');
    res.status(200).json(stock);
});

//getStockById
app.get('/stock/**', (req, res) => {
    const stockId = req.params[0];
    const foundStock = stock.find(subject => subject.id === stockId);

    if (foundStock) {
        for (let attribute in foundStock) {
            if (req.body[attribute]) {
                foundStock[attribute] = req.body[attribute];
                console.log(`Set ${attribute} to ${req.body[attribute]} in hero: ${stockId}`);
            }
        }
        console.log(`stock found.`);
        res.status(404).json(foundStock);
    } else {
        console.log(`stock not found.`);
        res.status(404).json({
            message: "not found",
            stock
        });
    }
});

//addStock
app.post('/stock', (req, res) => {

    const newStock = {
        id: uniqid(),
        name: req.body.name,
        price: req.body.price,
        indications: req.body.indications
    };

    if (!stock.find(subject => subject.name === req.body.name)) {
        stock.push(newStock);
        console.log(stock);
        res.status(200).header({Location: `http://localhost:${port}/stock/${newStock.id}`}).send(newStock);
    } else {
        console.log(`stock not added.`);
        res.status(404).json({
            message: "this medicine already exist"
        });
    }

});

//deleteStock
app.delete('/stock/**', (req, res) => {
    const stockId = req.params[0];
    const foundStock = stock.find(subject => subject.id !== stockId);
    if (foundStock) {
        stock = stock.filter(subject => subject.id !== stockId);
        console.log(stock.filter(subject => subject.id !== stockId));
        res.status(202).json({
            message: "deleted",
            stock
        });
    } else {
        console.log(`stock not found.`);
        res.status(404).send();
    }
});

app.use('/img', express.static(path.join(__dirname,'img')));

require('./eureka-helper/eureka-helper').registerWithEureka('pharmacy-service', port);
console.log(`Pharmacy service listening on port ${port}`);
app.listen(port);