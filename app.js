// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    //      Import Files Ans Set Data Starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  	require('dotenv').config();

	const path = require('path');
	const rootDir = require('./utils/path');

	// npm install --save express
	const express = require('express');
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

		const username = encodeURIComponent(process.env.MONGODB_USERNAME);
		const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
		const cluster = process.env.MONGODB_CLUSTER;
		const dbName = process.env.MONGODB_DB_NAME;

		const MONGODB_URI = `mongodb+srv://${username}:${password}@${cluster}/${dbName}`;


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
	
	// const fileStorage = multer.diskStorage({
	// 	destination: (req, file, cb) => {
	// 		cb(null, 'images');
	// 	},

	// 	filename: (req, file, cb) => {
	// 		cb(null, new Date().toISOString() + '-' + file.originalname);
	// 	}
	// })

	const fileStorage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, 'images');
		},
		filename: (req, file, cb) => {
			const timestamp = new Date().toISOString().replace(/:/g, '-');
			cb(null, timestamp + '-' + file.originalname);
		}
	});


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

	// console.log('adminRoutes');

    const adminRoutes = require('./routes/admin');

	// console.log('shopRoutes');

    const shopRoutes = require('./routes/shop');

	// console.log('authRoutes');

	const authRoutes = require('./routes/auth');


	// Controllers
	const errorController = require('./controllers/errors');

	// Models
	const User = require('./models/user'); 

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    //  Import MVC ends
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                        //      Middleware and Session Starts
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	const bodyParser = require('body-parser');
	app.use(bodyParser.urlencoded({ extended: false }));

	
	// console.log('multer', fileStorage, fileFilter);
	app.use(
		multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
	);
	
	app.use(express.static(path.join(rootDir, 'public')));

	// console.log('/images');
	app.use(
		'/images', express.static(path.join(rootDir, 'images'))
	);

	app.use(
		
		session({
			
			secret : process.env.SESSION_SECRET,
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
		// console.log('res.locals.isAuthenticated ', res.locals.isAuthenticated, ' res.locals.csrfToken ', res.locals.csrfToken);
		next();
	});

	
	// storing the user details in our middleware to access through out the application like session
	app.use( async (req, res, next) => {
		
		// MongoDB
		// User.getUser('68565e78d31f677234eb0577')

		// Mongoose
		try {
			
			if(!req.session.user){
				// console.log("no user");
				return next();
			}

			// userID : 6875e67519e949d6c64036d5
			const user = await User.findById(req.session.user._id);
			
			if (!user) {
				// throw new Error('User not found');
				return next();
			}

			req.user = user;
			next();
		} 
		catch (err) {
			// console.error('User Middleware Error:', err);
			next(new Error(err));
		}
		

		// next();
	});

	// console.log('admin adminRoutes');
	app.use('/admin', adminRoutes);

	// console.log('shop shopRoutes');
	app.use(shopRoutes);

	// console.log('auth authRoutes');
	app.use(authRoutes);

	// console.log('error /500');
	app.get('/500', errorController.get500);

	// console.log(' error /404');
	app.use(errorController.get404);

	// console.log('error /500');
	app.use((error, req, res, next) => {
		// res.status(error.httpStatusCode).render(...);
		// res.redirect('/500');
		res.status(500).render('500', {
			pageTitle: 'Error!',
			path: '/500',
			isAuthenticated: req.session ? req.session.isLoggedIn : false
		});
	});

    
     
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
			const PORT = process.env.PORT || 3000;
			app.listen(PORT);
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