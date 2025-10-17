// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            //      Model for products starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    require('dotenv').config();
    const Product = require('../models/product');
    const Order = require('../models/order');

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const PDFDocument = require('pdfkit');

    const fs = require('fs');
    const path = require('path');

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            //      Model for products ends
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                //      shop Controller Starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    const ITEMS_PER_PAGE = 2;

    // fetch all the products
    exports.getProducts = (req, res, next) => {
        
        // MongoDB
        // Product.getProducts()
        
        const page = +req.query.page || 1;
        let totalItems;

        // Mongoose
        Product.find()
            .countDocuments()
            .then(numProducts => {
                totalItems = numProducts;
                return Product.find()
                    .skip((page - 1) * ITEMS_PER_PAGE)
                    .limit(ITEMS_PER_PAGE);
                })  
            .then( (products) => {
                
                res.render('shop/product-list', {
                    prods: products,
                    pageTitle: 'Products',
                    path: '/products',
                    currentPage: page,
                    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                    hasPreviousPage: page > 1,
                    nextPage: page + 1,
                    previousPage: page - 1,
                    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
                });

            } )
            .catch( (err) => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            } )

        ;


        // Sequelize
        // Product.findAll()
        //     .then((products) => {
        //         res.render('shop/product-list', {
        //             prods: products,
        //             pageTitle: 'All Products',
        //             path: '/products'
        //         });
        //     })
        //     .catch((err) => { console.log(err); })
        // ;

        // MySql
        // Product.getProducts()
            
        //     .then( ([products, productsfield]) => {

        //         res.render('shop/product-list', {
        //             prods: products,
        //             pageTitle: 'All Products',
        //             path: '/products'
        //         });

        //     } )
        //     .catch( (err) => {

        //     } )
        // ;
    };

    // get individual products
    exports.getProduct = (req, res, next) => {
        const productId = req.params.id;
    
        // MongoDB
        // Product.getProduct(productId)

        // Mongoose
        Product.findById(productId)
            
            .then( (product) => {
                
                res.render('shop/product-detail', {
                    product: product, 
                    pageTitle: product.title, 
                    path: '/products',
                    // isAuthenticated: req.session.isLoggedIn     
                });
                
            } )
            .catch( (err) => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            } )
        ;


        // Sequelize
        // Product.findByPk(productId)
        //     .then( (product) => {
        //         res.render('shop/product-detail', {
        //             product: product, 
        //             pageTitle: product.title, 
        //             path: '/products'
        //         });
        //     } )
        //     .catch( (err) => {
        //         // console.log(err);
        //     } )
        // ;


        // MySQL
        // Product.getProduct(productId)
        //     .then( ([product, field]) => {
        //         res.render('shop/product-detail', {
        //             product: product[0], 
        //             pageTitle: product[0].title, 
        //             path: '/products'
        //         });
        //     } )
        //     .catch( (err) => {console.log(err, 'shop.js controller err');} )
        // ;
       
    }

    // fetch all the products for index/home page
    exports.getIndex = (req, res, next) => {

        // MongoDB
        // Product.getProducts()
        
        const page = +req.query.page || 1;
        let totalItems;

        // Mongoose
        Product.find()
            
            .countDocuments()
            .then(numProducts => {
                totalItems = numProducts;
                return Product.find()
                    .skip((page - 1) * ITEMS_PER_PAGE)
                    .limit(ITEMS_PER_PAGE);
                })
            .then(products => {
                res.render('shop/index', {
                    prods: products,
                    pageTitle: 'Shop',
                    path: '/',
                    currentPage: page,
                    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                    hasPreviousPage: page > 1,
                    nextPage: page + 1,
                    previousPage: page - 1,
                    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
                });
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })

        ;

        
        // Sequelize
        // Product.findAll()
        //     .then((products) => {
        //         res.render('shop/index', {
        //             prods: products,
        //             pageTitle: 'Shop',
        //             path: '/'
        //         });
        //     })
        //     .catch((err) => { console.log(err); })
        // ;

        // MySql
        // Product.getProducts()
            
        //     .then( ([products, productsfield]) => {

        //         res.render('shop/index', {
        //             prods: products,
        //             pageTitle: 'Shop',
        //             path: '/'
        //         });

        //     } )
        //     .catch( (err) => {

        //     } )
        // ;
    };

    console.log('getCart controller');
    // get user cart
    // exports.getCart = (req, res, next) => {

    //     // mongoDB
    //     // req.user.getCart()
           
    //     //     .then((products) => {
                
    //     //         res.render('shop/cart', {
    //     //             path: '/cart',
    //     //             pageTitle: 'Your Cart',
    //     //             products : products
    //     //         });

    //     //     })
    //     //     .catch()
    //     // ;

    //     console.log('req.user', req.user);
    //     //Mongoose
    //     req.user
    //         .populate('cart.items.productId')
    //         // .execPopulate()
    //         .then(user => {
                
    //             const products = user.cart.items;
    //             co
    //             res.render('shop/cart', {
    //                 path: '/cart',
    //                 pageTitle: 'Your Cart',
    //                 products: products,
    //                 // isAuthenticated: req.session.isLoggedIn
    //             });

    //         })
    //         .catch(err => {
    //             const error = new Error(err);
    //             error.httpStatusCode = 500;
    //             return next(error);
    //         });

    //     // Sequelize
    //     // fetch the cart which belongs to the user using middleware and Sequelize
    //     // req.user.getCart()
    //     //     .then( (cart) => {

    //     //         // fetch all the products which belongs to the cart using relationship
    //     //         return cart.getProducts()
    //     //             .then( (products) => {
    //     //                 res.render('shop/cart', {
    //     //                     path: '/cart',
    //     //                     pageTitle: 'Your Cart',
    //     //                     products : products
    //     //                 });
    //     //             } )
    //     //             .catch( (err) => {} );
    //     //         ;
    //     //     } )
    //     //     .catch( (err) => {} )
    //     // ;


    //     // res.render('shop/cart', {
    //     //     path: '/cart',
    //     //     pageTitle: 'Your Cart'
    //     // });
    // };

    exports.getCart = async (req, res, next) => {
        try {
            const populatedUser = await req.user.populate('cart.items.productId')
            const products = populatedUser.cart.items || [];
            console.log('getCart controller products', products);

            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products,
            });
        } catch (err) {
            console.log('getCart controller error', err);
            next(err);
        }
    };


    // add product to cart
    exports.postCart = (req, res, next) => {
        const productId = req.body.productId;
        
        // MongoDB
        // Product.getProduct(productId)

        // Mongoose
        Product.findById(productId)
            
            .then( (product) => {
                // console.log(product, 'shop.js postCart product', req.user );
                return req.user.addToCart(product);
            } )
            .then((result) => {
                // console.log(result, 'shop.js postCart result' );
                res.redirect('/cart');
            })
            .catch( (err) => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
        ;



        // let userCart;
        // let newQuantity = 1;
        
        // Sequelize
        // fetch the cart which belongs to the user using middleware and Sequelize
        // req.user.getCart()
        //     .then( (cart) => {
        //         userCart = cart;

        //         // fetch the product if exists in the cart
        //         return cart.getProducts( { where : { id : productId } } );
        //     } )
        //     .then( (products) => {
                
        //         let product;
        //         if ( products.length > 0 ) {
        //             product = products[0];
        //         }

        //         // if product already exists in the cart then just increment the quantity of that product in Cart
        //         if(product){
        //             const currentQuantity = product.cartItem.quantity;
        //             newQuantity = currentQuantity + 1;
        //             return product;

        //             // return  userCart.addProduct(product, {
        //             //     through : {quantity : newQuantity}
        //             // });
        //         }
                
        //         return Product.findByPk(productId);
        //         // res.redirect('/cart');
        //     } )
            
        //         // Add the new product to the cart using Sequelize function addProduct() and set the quantity of product
        //         //  as 1 through relationship 
        //     .then( (product) => {
                
        //         return userCart.addProduct(product, {
        //             through : {quantity : newQuantity}
        //         });

        //     } )
        //     .then( () => {
        //         res.redirect('/cart');
        //     } ) 
        //     .catch( (err) => {} );
        // ;

        // Product.getProduct(productId, product => {
        //     Cart.addProduct(productId, product.price);
        // });
        
    };

    // delete product from the cart items for the user
    exports.deleteCartItem = (req, res, next) => {
        const productId = req.body.productId;

        // console.log('deleteCartItem', productId);
        // MongoDB
        // req.user.deleteCartItem(productId)
        
        //Mongoose 
        req.user
            .removeFromCart(productId)
            .then( (result) => {
                // console.log('result', result);
                res.redirect('/cart');
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
        ; 


        // Sequelize
        // req.user.getCart()
        //     .then( (cart) => {
        //         return cart.getProducts( { where : { id : productId }  } );
        //     } ) 
        //     .then( (products) => { 
        //         const product = products[0];
        //         return product.cartItem.destroy();
        //     } )
        //     .then( (result) => {
        //         res.redirect('/cart');
        //     } )
        //     .catch( (err) => { } )

        // ;
            
        // const productPrice = req.body.productPrice;
        // Cart.deleteProduct(productId, productPrice);
    };

    exports.getCheckout = (req, res, next) => {
        let products;
        let total = 0;
        req.user
            .populate('cart.items.productId')
            // .execPopulate()
            .then(user => {
                products = user.cart.items;
                total = 0;
                products.forEach(p => {
                    total += p.quantity * p.productId.price;
                });

                const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

                return stripe.checkout.sessions.create({
                    payment_method_types: ['card'],

                    line_items: products.map(p => {
                        return {
                            name: p.productId.title,
                            description: p.productId.description,
                            amount: p.productId.price * 100,
                            currency: 'usd',
                            quantity: p.quantity
                        };
                    }),

                    success_url: `${baseUrl}/checkout/success`,
                    cancel_url: `${baseUrl}/checkout/cancel`
                });
            })
        .then(session => {
            res.render('shop/checkout', {
                path: '/checkout',
                pageTitle: 'Checkout',
                products: products,
                totalSum: total,
                sessionId: session.id,
                stripePublicKey: process.env.STRIPE_PUBLIC_KEY
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    };

    exports.getCheckoutSuccess = (req, res, next) => {
        req.user
            .populate('cart.items.productId')
            // .execPopulate()
            .then(user => {
                const products = user.cart.items.map(i => {
                    return { quantity: i.quantity, product: { ...i.productId._doc } };
                });
                const order = new Order({
                    user: {
                    email: req.user.email,
                    userId: req.user
                    },
                    products: products
                });
                    return order.save();
            })
            .then(result => {
                return req.user.clearCart();
            })
            .then(() => {
                res.redirect('/orders');
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
        ;
    };



    // add order to the users cart
    exports.postOrder = (req, res, next) => {
        // MongoDB
        // req.user.postOrder()

        // MOngoose
        // req.user.addOrder()

        req.user
            .populate('cart.items.productId')
            // .execPopulate()
                
                .then(user => {
                    
                    const products = user.cart.items.map(i => {
                        return {
                            quantity: i.quantity,
                            
                            product: {
                                ...i.productId._doc
                            }
                        }
                    });

                    const order = new Order({

                        user : {
                            // name: req.user.name,
                            email: req.user.email,
                            userId: req.user
                        },

                        products: products 
                    });

                    return order.save();
                })
               
                .then(result => {
                    return req.user
                        .clearCart();
                })
              
                .then((result) => {
                    res.redirect('/orders');
                } )
                .catch((err) => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                })
        ;
    };


    exports.getOrders = (req, res, next) => {

        // MongoDB
        // req.user.getOrders()
           
        // Mongoose
        Order.find({ 'user.userId': req.user._id })
            .then((orders) => {
               
                res.render('shop/orders', {
                    path: '/orders',
                    pageTitle: 'Your Orders',
                    orders : orders,
                    // isAuthenticated: req.session.isLoggedIn
                });

            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
        ;


        // res.render('shop/orders', {
        //     path: '/orders',
        //     pageTitle: 'Your Orders'
        // });
    };

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;

    Order.findById(orderId)
    .then(order => {
       
        if (!order) {
            return next(new Error('No order found.'));
        }

        if (order.user.userId.toString() !== req.user._id.toString()) {
            return next(new Error('Unauthorized'));
        }
        
        const invoiceName = 'invoice-' + orderId + '.pdf';
        const invoicePath = path.join('data', 'invoices', invoiceName);

        const pdfDoc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            'inline; filename="' + invoiceName + '"'
        );
        
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);

        pdfDoc.fontSize(26).text('Invoice', {
            underline: true
        });

        pdfDoc.text('-----------------------');
        let totalPrice = 0;
        order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
            .fontSize(14)
            .text(
            prod.product.title +
                ' - ' +
                prod.quantity +
                ' x ' +
                '$' +
                prod.product.price
            );
        });
        pdfDoc.text('---');
        pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

        pdfDoc.end();
        // fs.readFile(invoicePath, (err, data) => {
        //   if (err) {
        //     return next(err);
        //   }
        //   res.setHeader('Content-Type', 'application/pdf');
        //   res.setHeader(
        //     'Content-Disposition',
        //     'inline; filename="' + invoiceName + '"'
        //   );
        //   res.send(data);
        // });
        // const file = fs.createReadStream(invoicePath);

        // file.pipe(res);
    })
    .catch(err => next(err));
};


// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                //       Shop Controller Ends
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
