// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    //      Import Files Ans Set Data Starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
	const path = require('path');

	// npm install --save express
	const express = require('express');

	const rootDir = require('./utils/path');

	const bodyParser = require('body-parser');

	const app = express();


	// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    //      Import DBs and Set Sessions Starts
	// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

		// const mongodbConnect = require('./utils/db/database-mongodb').mongoConnect;

		// npm install mongoose --save
		const mongoose = require('mongoose');

		// npm install --save express-session
		const session = require('express-session');

		const flash = require('connect-flash');

		// npm install --save connect-express-session
		const MongoDBStore = require('connect-mongodb-session')(session);

		const username = encodeURIComponent("NodeLearningUser");
		const password = encodeURIComponent("devnaren");
		const MONGODB_URI = `mongodb+srv://${username}:${password}@nodelearning.nvpzxls.mongodb.net/shop`;

		const store = new MongoDBStore({
			uri: MONGODB_URI,
			collection: 'sessions'
		});

		const csrf = require('csurf');
		const csrfProtection = csrf();

	// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
						//      Import DBs and Set Sessions Ends
	// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    // File Image/PDF Configuration Starts
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	// npm install --save multer
	const multer = require('multer');
	
	const fileStorage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, 'images');
		},

		filename: (req, file, cb) => {
			cb(null, new Date().toISOString() + '-' + file.originalname);
		}
	})

	const fileFilter = (req, file, cb) => {
		if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
			cb(null, true);
		}else{
			cb(null, false);
		}
	}

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    // File Image/PDF Configuration Starts
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    // View Engine Configuration Starts
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    // EJS Configuration starts
    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        app.set('view engine', 'ejs');

        app.set('views', path.join(rootDir, 'views'));

    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    // EJS Configuration starts
    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    // View Engine Configuration Ends
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                //  Import MVC Starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


	// Routes

    const adminRoutes = require('./routes/admin');

    const shopRoutes = require('./routes/shop');

	const authRoutes = require('./routes/auth');

	// Models

	const User = require('./models/user'); 

	const errorController = require('./controllers/error');

	// Controllers
	const errorController = require('./controllers/errors');

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    //  Import MVC ends
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                        //      Middleware and Session Starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


	app.use(bodyParser.urlencoded({ extended: false }));

	
	app.use(
		multer({ storage: fileStorage, fileFilter: fileFilter }).single('images')
	);
	
	app.use(express.static(path.join(rootDir, 'public')));

	app.use(
		'/images', express.static(path.join(rootDir, 'images'))
	);

	app.use(
		
		session({
			
			secret : '6875e67519e949d6c64036d5key',
			resave: false,
			saveUninitialized: false,
			store: store
			
		})
	);
	
	app.use(csrfProtection);
	
	app.use(flash());

	app.use((req, res, next) => {
		res.locals.isAuthenticated = req.session.isLoggedIn;
		res.locals.csrfToken = req.csrfToken();
		next();
	});

	
	// storing the user details in our middleware to access through out the application like session
	app.use( async (req, res, next) => {
		
		// MongoDB
		// User.getUser('68565e78d31f677234eb0577')

		// Mongoose
		try {
			
			if(!req.session.user){
				return next();
			}

			// userID : 6875e67519e949d6c64036d5
			const user = await User.findById(req.session.user._id);
			
			if (!user) {
				throw new Error('User not found');
			}

			req.user = user;
			next();
		} 
		catch (err) {
			// console.error('User Middleware Error:', err);
			next(err);
		}
		

		// next();
	});

	app.use('/admin', adminRoutes);

	app.use(shopRoutes);

	app.use(authRoutes);

	app.get('/500', errorController.get500);

	app.use(errorController.get404);

    
     
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                            //      Middleware Ends
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                            //      Mongodb Starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	
	// Mongoose
	// const username = encodeURIComponent("NodeLearningUser");
    // const password = encodeURIComponent("devnaren");
    // const uri = `mongodb+srv://${username}:${password}@nodelearning.nvpzxls.mongodb.net/shop?retryWrites=true&w=majority&appName=NodeLearning`;

	// uri
	mongoose.connect(MONGODB_URI)
		.then(result => {
			
			// User.findOne()
				
			// 	.then(user =>{
					
			// 		if(!user){
						
			// 			const user = new User({
							
			// 				name: "NARENDRA PANDEY",
			// 				email: "pandeynarendra785@gmail.com",
			// 				cart: {
			// 					items: []
			// 				}

			// 			});

			// 			user.save();
			// 		}
			// 	})
			// 	.catch(err => console.log(err))
			// ;

			app.listen(3000);
		})
		.catch(err => console.log(err))
	;


	// MongoDB
	// mongodbConnect( () => {
	// 	// const user = new User("NARENDRA PANDEY", "pandeynarendra785@gmail.com", { items: [] }, null);
	// 	// user.postUser()
	// 	// 	.then( (user) => {
	// 	// 		app.listen(3000);
	// 	// 	} )
	// 	// 	.catch((err) => {})
	// 	// ;
	// 	app.listen(3000);
	// } );


	// This () => {}  is a callback function passed as a actual parameter 
	// to get executed inside some other function as formal parameter
	// mongodbConnect( (client) => {
	// 	// console.log(client)
	// 	app.listen(3000);
	// } );

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                            //      Mongodb Ends
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------





// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                            //      Sequelize Starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	// Every Product belongs to some user, so products table contains a user id 
//    Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
//    User.hasMany(Product);

// 	User.hasOne(Cart);
	
// 	// Every Cart belongs to some user, so carts table contains a user id  
// 	Cart.belongsTo(User);
	
// 	// Every cart contains some products as cart item, this cart items table cart id
// 	Cart.belongsToMany(Product, { through: CartItem });

// 	// Every product can be cart item, this cart items table product id
// 	Product.belongsToMany(Cart, { through: CartItem });

// 	sequelize
// 		// .sync({ force: true })
// 		.sync()
// 		.then(result => {
// 			return User.findByPk(1);
// 			// console.log(result);
// 		})
// 		.then(user => {
// 			if (!user) {
// 				return User.create({ name: 'NARENDRA PANDEY', email: 'narendrapandey@gmail.com' });
// 			}
// 			return user;
// 		})
// 		.then(user => {
// 			// console.log(user);
// 			// return user.createCart();
// 			return 1;
// 		})
// 		.then((cart) => {
// 			app.listen(3000);
// 		})
// 		.catch(err => {
// 			console.log(err);
// 		})
// 	;

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                            //      Sequelize Ends
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------




// app.listen(3000);