// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//      Products Model Using Mongoose Starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Import the mongoose library (used to interact with MongoDB in a structured way)
const mongoose = require('mongoose');

// Extract the Schema constructor from mongoose
const Schema = mongoose.Schema;

// Define the schema (blueprint) for the Product collection
// A schema tells MongoDB how the data should be structured
const productSchema = new Schema({
    
    title: {
        type: String,          
		required: true         
    },
    
    price: {
        type: Number,         
        required: true
    },
    
    
    description: {
        type: String,         
        required: true
    },
    
    
    imageUrl: {
        type: String,          
        required: true
    },
    
    // Reference to the user who created/owns the product
    // This stores the user's _id from the 'User' collection
    userId: {
        type: Schema.Types.ObjectId, // Special type used to store MongoDB document IDs
        ref: 'User',                 // Reference to the User model (for population)
        required: true
    }
});

// Create and export the Product model
// The first argument ('Product') will be the collection name in MongoDB (pluralized as 'products')
module.exports = mongoose.model('Product', productSchema);

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//      Products Model Using Mongoose Ends
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            //      Products Model Using MongoDB Starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	// const mongodb = require('mongodb');
	// const objectId = mongodb.ObjectId;

	// const getDB = require('../utils/db/database-mongodb').getDB;

	// class Product
	// {
	// 	//   this._id = id ? new mongodb.ObjectId(String(id)) : null;
	// 	constructor(id, title, description, price, imageUrl, userId)
	// 	{
	// 		this._id = id;
	// 		this.title = title;
	// 		this.description = description;
	// 		this.price = price;
	// 		this.imageUrl = imageUrl;
	// 		this.userId = userId;
	// 	}

	// 	// save new product
	// 	postProduct()
	// 	{
	// 		const db = getDB();
	// 		return db.collection('products')
	// 			.insertOne(this)
	// 				.then( (result) => {
	// 				} )
	// 				.catch( (err) => {
	// 					console.log("product.js postProduct model/product", err);
	// 				} )
	// 	}

	// 	// get all products
	// 	static getProducts()
	// 	{
	// 		const db = getDB();
	// 		return db.collection('products')
	// 			.find()
	// 			.toArray()
	// 				.then( (products) => {
	// 					return products;
	// 				} )
	// 				.catch( (err) => {
	// 					console.log('product.js get all model/product', err);
	// 				} )
	// 	}

	// 	// get individual product
	// 	static getProduct(productId)
	// 	{
	// 		const db = getDB();
	// 		return db.collection('products')
	// 			.find( { _id: new objectId(String(productId))} )
	// 			.next()
	// 				.then( (product) => { 
	// 					return product;
	// 				} )
	// 				.catch( (err) => { } )
	// 	}

	// 	// update product
	// 	updateProduct()
	// 	{
	// 		const { _id, ...productData } = this;

	// 		if(!_id){
	// 			return false;
	// 		}

	// 		const db = getDB();
	// 		return db.collection('products')
	// 			.updateOne( 
	// 				{ _id : new objectId(String(_id)) }, 
	// 				{ $set : productData  }
	// 			)
	// 				.then( (result) => {
	// 				} )
	// 				.catch( (err) => {
	// 					console.log("product.js updateProduct model/product", err);
	// 				} )
	// 	}
		
	// 	// delete product
	// 	static deleteProduct(productId)
	// 	{
	// 		const db = getDB();
	// 		return db.collection('products')
	// 			.deleteOne( { _id : new objectId(String(productId)) } )
	// 				.then( (result) => {
	// 				} )
	// 				.catch( (err) => {
	// 					console.log("product.js deleteProduct model/product", err);
	// 				} )
	// 	}

	// }

	// module.exports = Product;

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            //      Products Model Using MongoDB Ends
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------






// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            //      Products Model Using Sequelize Starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// const Sequelize = require('sequelize');

// const sequelize = require('../utils/db/database');

// const Product = sequelize.define('product', {
	
// 	id: {
// 		type: Sequelize.INTEGER,
// 		autoIncrement: true,
// 		allowNull: false,
// 		primaryKey: true
// 	},

// 	title: Sequelize.STRING,

// 	price: {
// 		type: Sequelize.DOUBLE,
// 		allowNull: false
// 	},

// 	imageUrl: {
// 		type: Sequelize.STRING,
// 		allowNull: false
// 	},

// 	description: {
// 		type: Sequelize.STRING,
// 		allowNull: false
// 	}
	
// });

// module.exports = Product;





// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            //      Products Model Using Sequelize Starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------






















// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            //      Import And Set Data And File Starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	// const db = require('../mysql/database');

	// const rootDir = require('../utils/path');
	// const p = rootDir + '/data/products.json';

	// const Cart = require('./cart');

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            //      Import And Set Data And File Ends
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
			//      Products Model Class Definition Starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	// module.exports = class Product {
		
	// 	// this
	// 	constructor(id, title, imageUrl, description, price) {
	// 		this.id = id;
	// 		this.title = title;
	// 		this.price = price;
	// 		this.imageUrl = imageUrl;
	// 		this.description = description;
	// 	}

	// 	// save new product
	// 	postProduct() {
	// 		return 	db.execute(
	// 					"Insert Into products(title, price, imageUrl, description) Values(?,?,?,?)",
	// 					[this.title, this.price, this.imageUrl, this.description]
	// 				);			
	// 	}

	// 	// get all the products
	// 	static getProducts() {
	// 		return db.execute("Select * From products");
	// 	}

	// 	// get individual product
	// 	static getProduct(id){
	// 		return 	db.execute(
	// 					"Select * From products where products.id = ?", [id]
	// 				);	
			
	// 	}

	// 	delete(id) {
			
			
			
	// 	}

	// };

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            //      Products Model Class Definition Ends
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------