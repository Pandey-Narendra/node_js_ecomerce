    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            //      Model && Files for products starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    const Product = require('../models/product');

    const fileHelper = require('../utils/file'); 

    const { validationResult } =  require('express-validator');

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            //      Model && Files for products ends
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                //      Admin Controller Starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    exports.getAddProduct = (req, res, next) => {
        
        res.render('admin/add-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true,
            hasError : false,
            errorMessage : null,
            validationErrors : []
            // isAuthenticated: req.session.isLoggedIn
        });

    };

    exports.postAddProduct = (req, res, next) => {
        
        const title = req.body.title;
        const price = req.body.price;
        const description = req.body.description;

        // const imageUrl = req.body.imageUrl;
        const image = req.file;
        if(!image){
            res.status(422).render('admin/edit-product', {
                pageTitle: 'Add Product',
                path: '/admin/add-product',
                hasError: true,
                product: {
                    title: title,
                    price: price,
                    description: description
                },
                errorMessage: 'Attached file is not an image.',
                validationErrors: []
            });      
        }

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).render('admin/edit-product', {
                pageTitle: 'Add Product',
                path: '/admin/add-product',
                hasError: true,
                product: {
                    title: title,
                    price: price,
                    description: description
                },
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            });
        }

        const imageUrl = image.path;

        // Mongoose
        const product = new Product({
            title: title,
            price: price,
            description: description,
            imageUrl: imageUrl,
            userId: req.user
        });

        product
            .save()
            .then(result => {
               res.redirect('/admin/products'); 
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
        ;

        // MongoDB
        // const product = new Product(null, title, description, price, imageUrl, req.user._id );

        // product.postProduct()
            
        //     .then( (product)  => { 
        //         return res.redirect('/admin/products');
        //     })
        //     .catch((err) => {
        //         console.log('postAddProduct admin.js controller', err);
        //     })

        // ;
        
        // Sequelize

        // Product.create({
        //     title: title,
        //     price: price,
        //     imageUrl: imageUrl,
        //     description: description
        // })

        // Accessing the user from session/middleware and create product for that user
        // req.user.createProduct({
        //     title: title,
        //     price: price,
        //     imageUrl: imageUrl,
        //     description: description
        // })
        // .then(result => {
        //     // console.log('Created Product');
        //     return res.redirect('/admin/products');
        // })
        // .catch(err => {
        //     console.log(err);
        // });


        // MySQL
        // const product = new Product(null, title, imageUrl, description, price);
        // product.postProduct()
        //     .then( () => { 
        //         res.redirect('/'); 
        //     } )
        //     .catch( (err) => {})
        // ;

    };

    exports.getProducts = (req, res, next) => {
        
        // MongoDB
        // Product.getProducts()

        // Mongoose
        Product.find({userId: req.user._id})
            // .select('title price -_id')
            // .populate('userId', 'name')
            .then( (products) => {
                
                res.render('admin/products', {
                    prods: products,
                    pageTitle: 'Admin Products',
                    path: '/admin/products',
                    // isAuthenticated: req.session.isLoggedIn
                });

            } )
            .catch( (err) => {
                console.log(err);
            } )

        ;

        // Sequelize
        // Product.findAll()

        // fetch the product which belongs to the user
        // req.user.getProducts()
        //     .then( (products) => {
        //         res.render('admin/products', {
        //             prods: products,
        //             pageTitle: 'Admin Products',
        //             path: '/admin/products'
        //         });
        //     } )
        //     .catch( (err) => {} )
        // ;

        // Product.getProducts()
            
        //     .then( ([products, productfield]) => {

        //         res.render('admin/products', {
        //             prods: products,
        //             pageTitle: 'Admin Products',
        //             path: '/admin/products'
        //         });

        //     } )
        //     .catch( (err) => {

        //     } )
        // ;
    };

    exports.getEditProduct = (req, res, next) => {
        
        const productId = req.params.productId;

        // MongoDB
        // Product.getProduct(productId)

        // Mongoose
        Product.findById(productId)

            .then( (product) => {
                
                if (!product) {
                    return res.redirect('/');
                }

                res.render('admin/edit-product', {
                    product: product, 
                    pageTitle: 'Update Product', 
                    path: '/admin/edit-product',
                    hasError: false,
                    errorMessage: null,
                    validationErrors: []
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

        // fetch the user product of matching id
        // req.user.getProducts( { where: { id: productId } } )
        //     .then( (products) => {
        //         const product = products[0];

        //         if(!product){
        //             res.redirect('/');
        //         }

        //         res.render('admin/edit-product', {
        //             product: product, 
        //             pageTitle: 'Update Product', 
        //             path: '/admin/edit-product'
        //         });
        //     } )
        //     .catch( (err) => {
        //         // console.log(err);
        //     } )
        // ;


        // MySQL
        // Product.getProduct(productId, product => {
            
        //     res.render('admin/edit-product', {
        //         pageTitle: 'Edit Product',
        //         path: '/admin/edit-product',
        //         product: product
        //     });

        // });

    };

    exports.postEditProduct = (req, res, next) => {
        
        const productId = req.body.productId;
        const title = req.body.title;
        const price = req.body.price;
        const description = req.body.description;
        
        // const imageUrl = req.body.imageUrl;
        const image = req.file;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                hasError: true,
                product: {
                    title: title,
                    price: price,
                    description: description,
                    _id: productId
                },
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            });
        }
 

        // Mongoose
        Product.findById(productId)
           
            .then(product => {
                
                if(product.userId.toString() !== req.user._id.toString()){
                    return res.redirect('/');
                }

                product.title = title;
                product.price = price;
                product.description = description;
                
                // product.imageUrl = imageUrl;
                if(image){
                    fileHelper.deleteFile(product.imageUrl);
                    product.imageUrl = image.path;
                }

                return product
                    .save()
                    .then(result => {
                        res.redirect('/admin/products');
                    })
                ;
            })
            // .then(result => {
            //     res.redirect('/admin/products');
            // })

            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
        ;

        // MongoDB
        // const product = new Product( productId, title, description, price, imageUrl, req.user._id );

        // product.updateProduct()
            
        //     .then( (result)  => { 
        //         return res.redirect('/admin/products');
        //     })
        //     .catch((err) => {
        //         console.log('postEditProduct admin.js controller', err);
        //     })

        // ;




        // Sequelize
        // Product.findByPk(productId)
        //     .then(  (product) => {
        //         product.title = title;
        //         product.price = price;
        //         product.imageUrl = imageUrl;
        //         product.description = description;
        //         return product.save();
        //     } )
        //     .then(() => {
        //         res.redirect('/admin/products');
        //     } )
        //     .catch( (err) => {} )
        // ;

        // MySql
        // initiated new project object and bind its all methods
        // const UpdateProduct = new Product(productId, title, imageUrl, price, description);
        // UpdateProduct.postProduct();

        // console.log(UpdateProduct, 'admin js controller postEditProduct');
        
    };

    exports.deleteProduct = (req, res, next) => {
        const productId = req.body.productId;
        
        // MongoDB
        // Product.deleteProduct(productId)

        // Mongoose

        // Product.findByIdAndDelete(productId)
        Product.findById(productId)
            .then(product => {
                
                if(!product){
                    return next(new Error('Product not found.'));
                }

                fileHelper.deleteFile(product.imageUrl);
                return Product.deleteOne({id : productId, userId: req.user._id})
            })
            .then( () => {
                // res.redirect('/admin/products');
                res.status(200).json({ message: 'Success!' });
            } )
            
            .catch( (err) => {
                res.status(500).json({ message: 'Deleting product failed.' });
            } )
        ;   

        // MySql
        // Product.findByPk(productId)
        //     .then(  (product) => {
        //         return product.destroy();
                
        //     } )
        //     .then(() => {
        //         res.redirect('/admin/products');
        //     } )
        //     .catch( (err) => {} )
        // ;

        // MySQL
        // const deleteProduct = new Product(productId);
        // deleteProduct.delete();

        // File System
        // Product.delete(productId)
        
        // res.redirect('/admin/products');
    }

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                //       Admin Controller Ends
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  

