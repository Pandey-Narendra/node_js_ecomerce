const bcrypt = require('bcryptjs');

const nodemailer = require('nodemailer');
const sendgridTranspot =  require('nodemailer-sendgrid-transport');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

const transporter = nodemailer.createTransport(
	sendgridTranspot({
		auth: {
			api_key : SENDGRID_API_KEY
		}
	})
);

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	
	let message = req.flash('error');
	if(message.length > 0){
		message = message[0];
	}else{
		message = null;
	}

	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		// isAuthenticated: false,
		errorMessage: req.flash('error'),
	});

};

exports.postLogin = (req, res, next) => {
 	
	// userID : 6875e67519e949d6c64036d5
	// req.session.user._id
	// User.findById('6875e67519e949d6c64036d5')

	const email = req.body.email;
	const password = req.body.password;
	
	User.findOne({ email: email })
		.then(user => {

			if (!user) {
				req.flash('error', 'Invalid email or password.');
				return res.redirect('/login');
			}

			// match the passwords
			bcrypt.compare(password, user.password)
				
				.then(doMatch => {
					
					if (doMatch) {
						
						req.session.isLoggedIn = true;
						req.session.user = user;

						return req.session.save(err => {
							console.log(err);
							return res.redirect('/');
						});
					}

					req.flash('error', 'Invalid email or password.');
					return res.redirect('/login');
				})
				.catch(err => {
					console.log(err);
					res.redirect('/login');
				})
			;

		})
		.catch(err => console.log(err));
	;
};


exports.postLogout = (req, res, next) => {
	
	req.session.destroy(err => {
		console.log(err);
		res.redirect('/');
	});
};


exports.getSignup = (req, res, next) => {
	
	let message = req.flash('error');
	if(message.length > 0){
		message = message[0];
	}else{
		message = null;
	}

	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
		// isAuthenticated: false
		errorMessage: message
	});
};

exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	User.findOne({ email: email })
		
		.then(userDoc => {
			
			if (userDoc) {
				
				req.flash(
					'error',
					'E-Mail exists already, please pick a different one.'
				);

				return res.redirect('/signup');
			}

			return bcrypt.hash(password, 12)
				
				.then(hashedPassword => {
			
					const user = new User({
						email: email,
						password: hashedPassword,
						cart: { items: [] }
					});

					return user.save();

				})
				.then(result => {
					res.redirect('/login');

					return transporter.sendMail({
						to: email,
						from:'narendrapandey@testnode.com',
						subject: 'Signup Successful',
						html: '<p>You successfully signed up!</p>'
					});
				})
				.catch(err => {
					console.log(err);
				});
			;
		})
		
		.catch(err => {
			console.log(err);
			res.redirect('/signup');
		})
	;
};