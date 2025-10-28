// Import the express module
import express from 'express';

// Create an instance of an Express application
const app = express();

// Set EJS as our view engine
app.set('view engine', 'ejs');

// Define the port number where our server will listen
const PORT = 3001;

// Enable static file serving
app.use(express.urlencoded({ extended: true }));

// Allow the app to parse form data
app.use(express.static('public'));

// Create an array to store orders
const orders = [];

// Define a default "route" ('/')
app.get('/', (req, res) => {
    res.render('home');
});

// Add a confirm "route" for form submission
app.post('/submit-order', (req, res) => {
    // Create a JSON object to store the data
    const order = {
        name: req.body.name,
        email: req.body.email,
        flavor: req.body.flavor,
        cone: req.body.cone,
        toppings: req.body.toppings,
        timestamp: new Date()
    };
     // Add the order to our orders array
    orders.push(order);
    console.log(orders);

    // Direct the user to the confirmation page
    res.render('confirm', { order });
});

// Define a "admin" route
app.get('/admin', (req, res) => {
    res.render('admin', { orders });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});