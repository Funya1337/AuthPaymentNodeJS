const express = require("express");
const mongoose = require("mongoose");
const Blog = require('./models/blog');
const path = require('path');
const app = express();
app.use(express.json({ limit: '1mb' }))

const PORT = process.env.PORT || 8080;

// connect to MongoDB
const dbURI = 'mongodb+srv://retro:Britva01@nodegambit.hjc0u.mongodb.net/example-db?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => listenMethod(), console.log("connected to db"))
	.catch((err) => console.log(err));

// Middleware
app.use(express.static(__dirname + '/views'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.post('/post-example', (req, res) => {
	console.log(req.body);
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
		balance: 1000,
		signedIn: true,
		userId: data.userId
	});

	blog.save()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => console.log(err));
});

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

app.get('/login', (req, res) => {
	res.render('login');
});

function listenMethod() {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
}