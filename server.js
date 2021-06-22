const express = require("express");
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
const mongoose = require("mongoose");
const Blog = require('./models/blog');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(express.json({ limit: '1mb' }))

const SECRET_KEY = 'eyJ2ZXJzaW9uIjoiUDJQIiwiZGF0YSI6eyJwYXlpbl9tZXJjaGFudF9zaXRlX3VpZCI6InptcG1ndC0wMCIsInVzZXJfaWQiOiI3OTc3NjMxNDE1OCIsInNlY3JldCI6Ijg3Y2IxYzM0YjU5Y2M4MmNiZGIxZTY2N2I5YjcxZmVjMzA3ZWQ2Yzg2ZDdlYjQ2MDY3YzQ4Y2ZmNzljMTU0OTUifX0=';

let counter = 0;

const qiwiApi = new QiwiBillPaymentsAPI(SECRET_KEY);

const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// connect to MongoDB
const dbURI = 'mongodb+srv://retro:Britva01@nodegambit.hjc0u.mongodb.net/example-db?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => listenMethod(), console.log("connected to db"))
	.catch((err) => console.log(err));

// Middleware
app.use(express.static(__dirname + '/views'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.post('/payment', (req, res) => {
	console.log(req.body);
	const random = (length = 8) => {
		return Math.random().toString(16).substr(2, length);
	};
	const publicKey = '48e7qUxn9T7RyYE1MVZswX1FRSbE6iyCj2gCRwwF3Dnh5XrasNTx3BGPiMsyXQFNKQhvukniQG8RTVhYm3iPzNytXGVvEQtUcQ3sez7YnWijV8DAaYfa9ri5FboXQ2VPzK2WdqpXsXakkxs3gaJfeg3STiS99VQPz6cN7UrTs6YjnHeX9aq3rGpdzTe76';

	const params = {
		publicKey,
		amount: parseInt(req.body.valueInput),
		billId: random(36).toString(),
		successUrl: 'http://localhost:8080/success',
		email: 'm@ya.ru'
	};
	const link = qiwiApi.createPaymentForm(params);
	const billInfo = qiwiApi.getBillInfo(params.billId).then(data => {return data});
	res.json({
		link: link,
		billInfo: billInfo
	})
})

app.get('/mines', (req, res) => {
	res.render('mines');
})

app.get('/refs', (req, res) => {
	res.render('ref');
})

app.post('/post-example', (req, res) => {
	if (req.headers.cookie === undefined) {
		const data = req.body;
		res.json({
			status: 'success',
			firstName: data.first_name,
			lastName: data.last_name,
			userId: data.userId
		});
		const blog = new Blog({
			first_name: data.first_name,
			last_name: data.last_name,
			balance: 0,
			signedIn: true,
			gotBonus: false,
			userId: data.userId,
			refNum: 0
		});
	
		blog.save()
			.then((result) => {
				res.send(result);
			})
			.catch((err) => console.log(err));
	} else {
		const cookieRef = req.headers.cookie.substring(6);
		const data = req.body;
		res.json({
			status: 'success',
			firstName: data.first_name,
			lastName: data.last_name,
			userId: data.userId
		});
		const blog = new Blog({
			first_name: data.first_name,
			last_name: data.last_name,
			balance: 0,
			signedIn: true,
			gotBonus: false,
			userId: data.userId,
			cookieRef: cookieRef,
			refNum: 0
		});
	
		blog.save()
			.then((result) => {
				res.send(result);
			})
			.catch((err) => console.log(err));
	}
});

app.post('/update-ref-num', async (req, res) => {
	const data = req.body;

	const filter = { userId: data.userId };
	const update = { refNum: data.cnt };

	let doc = await Blog.findOne(filter);
	await Blog.updateOne(filter, update);
	await doc.save();
})

app.post('/update-balance', (req, res) => {
	const data = req.body;
	Blog.findOne(data, function(err, blog) {
		if (!blog.gotBonus) {
			if (!err) {
				if (!blog) {
					blog = new Blog();
					blog.userId = 143398090;
				}
				blog.balance += 10;
				blog.gotBonus = true;
				blog.save(function(err) {
					if (!err) {
						console.log(blog);
					} else {
						console.log("error");
					}
				})
			}
		}
		console.log(blog);
	})
})

app.get('/update-one', (req, res) => {
	res.redirect("http://example.com");
})

app.get('/add-blog', (req, res) => {
	const blog = new Blog({
		first_name: 'borov',
		last_name: '123',
		balance: 1000
	});

	blog.save()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => console.log(err));
});

app.get('/all-blogs', (req, res) => {
	Blog.find()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => console.log(err));
});

app.get('/single-blog', (req, res) => {
	Blog.findById('60c325eb6e54f23200adb173')
		.then((result) => {
			res.send(result);
		})
		.catch((err) => console.log(err));
});

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/refsignin', (req, res) => {
	res.cookie("refId", req.query.refid);
	res.render('index');
});

app.get('/login', (req, res) => {
	res.render('login');
});

function listenMethod() {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
}