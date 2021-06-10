const express = require("express");
// import Strategy as VKStrategy from "passport-vkontakte";
// passport.use(new VKStrategy(options, verify));
const app = express()

const PORT = process.env.PORT || 8080;

// Middleware
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render('index');
})

app.get('/login', (req, res) => {
	res.render('login')
})

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
})