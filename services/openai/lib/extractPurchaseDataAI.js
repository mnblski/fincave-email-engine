const { openaiInstance } = require("../init");

const instructions = {
    'email_purchase_data': 'Based on this email, extract the following purchase data: store name, purchase date, total cost, cost breakdown, items. Return response in JSON format',
}

    // example orderJSON
    // {
    //     "store_trading_name": "Amazon",
    //     "store_legal_name": "Amazon Ltd",
    //     "store_website": "amazon.com",
    //     "order_date": "2021-08-01",
    //     "order_number": "123456789",
    //     "total_cost": 100.00,
    //     "payment_method": "Visa",
    //     "delivery_method": "UPS",
    //     "deliver_type": "Home Delivery",
    //     "delivery_date": "2021-08-01",
    //     "deliver_tracking_number": "123456789",
    //     "deliver_tracking_link": "https://www.ups.com/track?loc=en_US&tracknum=123456789",
    //     "billing_address": "123 Main St, New York, NY 10001",
    //     "guarantee_info": "30 day money back guarantee",
    //     "guarantee_effective_from": "2021-08-01",
    //     "shipping_address": "123 Main St, New York, NY 10001",
    //     "cost_breakdown": {
    //         "tax": 10.00,
    //         "shipping": 10.00,
    //         "discount": 10.00,
    //         "subtotal": 70.00
    //     },
    //     "items": [
    //         {
    //             "name": "item1",
    //             "price": 10.00,
    //             "sku": "123456789",
    //             "size": "small",
    //             "color": "red",
    //             "description": "this is a description of the item",
    //             "quantity": 1
    //         },
    //         {
    //             "name": "item1",
    //             "price": 10.00,
    //             "sku": "123456789",
    //             "size": "small",
    //             "color": "red",
    //             "description": "this is a description of the item",
    //             "quantity": 1
    //         }
    //     ]
    // }

    async function getProductFromDatabase(item) {

        // v0.1.0 - dont use external product api, just add using orderJSON


        // xxxxxxxxxx


        // product should have different type e.g. verified, unverified, etc.
        // check against only verified as the unverfied might be false
        // verified is only done manually by the user and user can select any name (as long as it is not taken by the verified product)
        // when creating asset manually you will have an option to search for product from db, (both verified and unverified) ??
        // there needs to be a mechanism to verify the product - MORE VERIFIED, less unverified is better
        // or should the search through external api ?? - when adding manually -> if selected form external create verified product in Fincave DB

        // every product ever used in an asset is stored in the database

        // 1. FIRST check Fincave database for product,
            // 2. split into arrays - 1. with found in fc database (uuids), 2. not found in fc database (names)
        // 2. not found in fc database - check Third Party Product API,
            // 4. split into arrays - 1. found in Third Party Product API, 2. not found in Third Party Product API or below match threshold
            // 5. BATCH add to db using either full data from Third Party Product API or from orderJSON
        // 3. once all adding to db is done concat all arrays of uuids and return


        // at this point we have an array of uuids of all products in the order



        // 1. look up by SKU first (if not found, look up by name)
        // 2. if multiple product with the same name, look up by properties like 128gb, red, etc.
        // 3. if match is e.g. less than 80% (or some other threshold), create new product using data from orderJSON (this would not be an offical verified)

        // what about looking up online on the store website? (e.g. amazon.com) - is this legal, is this quick etc?
        // what about the product image? - should I use one from the email or from the api res / offical image


        // Potential issues:
        // what if there are multiple products with the same name?
         // what if there are multiple products with the same SKU?
    }

    // returns array of uuids
    async function getProductFromOrderJSON(orderJSON) {
        return new Promise(async (resolve, reject) => {
            if (!orderJSON?.items || orderJSON.items.length === 0) {
                reject('There are no items in this order');
            }
    
            const allProductFromOrder = [];
    
            for (let i = 0; i < orderJSON.items.length; i++) {
                const item = orderJSON.items[i];
    
                const productFromDB = await getProductFromDB(item); // logic to look up items in database / API
    
                if (productFromDB) {
                    allProductFromOrder.push(productFromDB.uuid);

                } else {
                    const productFromProductAPI = await getProductFromProductAPI(item); // product api lookup

                    let newProduct;
    
                    if (productFromProductAPI) {
                        newProduct = await postProductFromProductAPI(productFromProductAPI); // add to fincave db

                    } else {
                        const res = await postProductFromOrderJSON(orderJSON); // add to fincave db

                        if (res.status === 'success') {
                            newProduct = res.data;
                        }
                    }

                    allProductFromOrder.push(newProduct.uuid);   // once added use uuid
                }
            }
    
            resolve(allProductFromOrder);
        });
    };
    

async function extractPurchaseDataAI(textFromEmail) {

    // console.log('t', textFromEmail);

    try {
        const response = await openaiInstance.createCompletion({
            model: 'text-davinci-003',
            prompt: `Based on this email, extract the following purchase data: Store Name, Date, Total, Items Purchased. Return response in JSON format: ${textFromEmail}`,
            max_tokens: 2000,
            temperature: 0.5
           })
          
          console.log('IS THIS RESULT???:', response.data.choices[0].text);

          if (!response.data.choices[0].text) {
            return 'No data found';
          }

          const orderJSON = response.data.choices[0].text

        //   1. POST ORDER 

        //   2. in paralell, get product from order
            const allProductFromOrder = await getProductFromOrderJSON(orderJSON);

        //   3. once product fetched post assets to db 

        //   4. return ids of all entities created

        // return data if following format}

        data = {
            meta: {},
            items: [ { meta: {}, product_uuid: 'uuid' } ],
            uuid: 'uuid',
    }


          return response;

    } catch (err) {
        console.log('open ai error', err.message);
    }
}

module.exports = { extractPurchaseDataAI };


// 1. receive notificaiton about mailbox changes 

// 2. check if this is a new message 

// 3. do partial sync

// 3. if new message, extract order and items data

// 4. run product logic and create order data

// 5. create asset data using order data -> update UI


