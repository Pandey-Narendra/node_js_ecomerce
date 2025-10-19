// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//      Users Model Using Mongoose Starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Import mongoose to work with MongoDB using schemas and models
const mongoose = require('mongoose');

// Extract Schema constructor for defining MongoDB document structure
const Schema = mongoose.Schema;

const userSchema = new Schema({

    // name: {
    //     type: String,
    //     required: true
    // },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    
    resetToken: String,
  
    resetTokenExpiration: Date,

    cart: {
  
        items: [    
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product', // tells Mongoose to populate from the Product mode
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
      

        // Default value is an empty array of items
        default: { items: [] }
    }
});


// ----------------------
// Method: addToCart()
// ----------------------
// Adds a product to the user's cart. If it already exists, increases quantity.
userSchema.methods.addToCart = function(product) {

    // Clone the current cart items to avoid mutating directly
    const cartProducts = [...this.cart.items];

    // Find if product is already in the cart
    const existingProductIndex = cartProducts.findIndex((cartProduct) => {
        return cartProduct.productId.toString() === product._id.toString();
    });

    // If product exists, increase quantity
    if (existingProductIndex >= 0) {
        cartProducts[existingProductIndex].quantity =
            cartProducts[existingProductIndex].quantity + 1;
    }
    // If product does not exist, add it with quantity 1
    else {
        cartProducts.push({
            productId: product._id,
            quantity: 1
        });
    }

    // Update the cart with the new items array
    const updatedCart = {
        items: cartProducts
    };

    this.cart = updatedCart; // assign updated cart to user

    // Save the updated user document
    return this.save();
};


// ----------------------
// Method: removeFromCart()
// ----------------------
// Removes a specific product from the cart based on productId.
userSchema.methods.removeFromCart = function(productId) {

    // Keep only the items whose productId is NOT the one being removed
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });

    // Update cart items
    this.cart.items = updatedCartItems;

    // Save changes to DB
    return this.save();
};


// ----------------------
// Method: clearCart()
// ----------------------
// Empties the entire cart for the user.
userSchema.methods.clearCart = function() {
    this.cart = { items: [] }; // reset cart to empty
    return this.save();        // save changes
};


// Export the model so it can be used in controllers
module.exports = mongoose.model('User', userSchema);

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//      Users Model Using Mongoose Ends
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------







// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            //      Users Model Using MongoDB Starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // const mongodb = require('mongodb');
    // const { deleteCartItem } = require('../controllers/shop');
    // const objectId = mongodb.ObjectId;

    // const getDB = require('../utils/db/database-mongodb').getDB;

    // class User 
    // {
    //     constructor(name, email, cart = { items: [] }, id)
    //     {
    //         this.name = name;
    //         this.email = email;
    //         this.cart = cart; // { items : [ {product1 : some product, id : some id}, {product2 : some product, id : some id} ] }
    //         this._id= id;
    //     }

    //     // Add product to the cart of the user or increase/decrease the quantity 
    //     postToCart(product) 
    //     {
    //         const db = getDB();

    //         // existing products in the  cart
    //         const cartProducts = [ ...this.cart.items ];

    //         // this.cart.item --> its an array containing product and its quantity in the card
    //         // product --> its a product to add to the cart

    //         const existingProductIndex = cartProducts.findIndex( (cartProduct) => {
    //             return cartProduct.productId.toString() === product._id.toString();
    //         } );


    //         if(existingProductIndex >= 0) // array index can be 0 as it starts with it 
    //         {
    //             // increment the quantity by 1 as the product already exists
    //             cartProducts[existingProductIndex].quantity =  cartProducts[existingProductIndex].quantity + 1;
    //         }else{
    //             cartProducts.push( {
    //                 productId: new objectId(String(product._id)),
    //                 quantity: 1
    //             } )
    //         }   


    //         // const updatedCart = {
    //         //     items: [
    //         //         {
    //         //             productId: new objectId(String(product._id)),
    //         //             quantity: 1
    //         //         }
    //         //     ]
    //         // };

    //         return db.collection('users')
    //             .updateOne(
    //                 { _id: new objectId(String(this._id)) },
    //                 { $set: { cart: { items: cartProducts } } }
    //             )
    //             .then(result => {
    //                 // console.log('Product added to cart:', result);
    //             })
    //             .catch(err => {
    //                 console.log('Error adding to cart:', err);
    //             });
    //     }

    //     // get the cart items for the user
    //     getCart()
    //     {
            
    //         const db = getDB();

    //         // these ids are extracted from the user collection not from product collection
    //         const productIds = this.cart.items.map( (p) => {
    //             return p.productId;
    //         } );

    //         // these products are extracted from products collection for that user, then mapped with the quantity from user collection
    //         return db.collection('products')
    //             .find( {_id : { $in : productIds } })
    //             .toArray()
    //                 .then( (products) => {
                        
    //                     return products.map( (product) => {
                           
    //                         return {
    //                             ...product,

    //                             quantity: this.cart.items.find( (cartProduct) => {
    //                                 return cartProduct.productId.toString === product._id.toString;
    //                             } ).quantity
    //                         }

    //                     } )
    //                 } )
    //                 .catch((err) => {})

    //     }

    //     // delete the product from cart items of the user
    //     deleteCartItem(productId)
    //     {
    //         const updatedCart = this.cart.items.filter( (cp) => {
    //             return cp.productId.toString() !== productId.toString();
    //         })

    //         const db = getDB();
    //         return db.collection('users')
    //             .updateOne(
    //                 { _id : new objectId(String(this._id))},

    //                 { 
    //                     $set : 
                        
    //                     { cart : 
    //                         {items : updatedCart}
    //                     } 

    //                 }
              
    //         )
    //     }

    //     // add order of the user from the cart
    //     postOrder()
    //     {
    //         const db = getDB();

    //         return this.getCart()
               
    //             .then((products) => {
                    
    //                 const orders = {
                        
    //                     items: products,
                        
    //                     user : {
    //                         _id : new objectId(String(this._id)),
    //                         name : this.name
    //                     }
    //                 }

    //                 return db.collection('orders')
    //                     .insertOne(orders)
    //                 ;
    //             })
    //             .then(() => {
                    
    //                 this.cart = { items: [] };
                    
    //                 return db.collection('users')
    //                     .updateOne( 
    //                         {_id : new objectId(String(this._id)) },
    //                         {$set : { cart : { items : [] } } } 
    //                     );
    //                 ;
    //             })
    //             .catch((err) => {})
    //         ;

    
    //     }

    //     // get all the orders of the user
    //     getOrders() {
    //         const db = getDB();
    //         return db.collection('orders')
    //             .find( { 'user._id' : new objectId(String(this._id)) } )
    //             .toArray()
    //         ;
    //     }


    //     // create new user
    //     postUser()
    //     {
    //         const db = getDB();
    //         return db.collection('users')
    //             .insertOne(this)
    //                 .then( (result) => {} )
    //                 .catch( (err) => {} )
    //     }

    //     // fetch all users
    //     static getUsers()
    //     {
    //         const db = getDB();
    //         return db.collection('users')
    //             .find()
    //             .toArray()
	// 				.then( (users) => {
	// 					return users;
	// 				} )
	// 				.catch( (err) => {} )
    //     }

    //     // fetch individual users
    //     static getUser(id)
    //     {
    //         const db = getDB();
    //         return db.collection('users')
    //             .findOne( {_id : new objectId(String(id))} )
	// 				.then( (user) => {
	// 					return user;
	// 				} )
	// 				.catch( (err) => {} )
    //     }
    // }


// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            //      Users Model Using MongoDB Ends
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------




// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            //      Users Model Using Sequelize Starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    // const Sequelize = require('sequelize');

    // const sequelize = require('../utils/db/database');

    // const User = sequelize.define('user', {
    
    //     id: {
    //         type: Sequelize.INTEGER,
    //         autoIncrement: true,
    //         allowNull: false,
    //         primaryKey: true
    //     },

    //     name: Sequelize.STRING,

    //     email: Sequelize.STRING

    // });

    
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            //      Users Model Using Sequelize Ends
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// module.exports = User;
