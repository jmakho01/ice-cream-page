// Import required modules
import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

// Load the environment variables from .env file
dotenv.config();

// Create a database connection pool with multiple connections
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

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

// Database test route (for debugging)
app.get('/db-test', async (req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders');
        res.send(orders);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Database error: ' + err.message);
    }
});

// Define a default "route" ('/')
app.get('/', (req, res) => {
    res.render('home');
});

/*
// Old code for pulling data from a page
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
*/

// Add a confirm "route" for form submission
app.post('/submit-order', async (req, res) => {
    try {
        const order = req.body;
        console.log('New order submitted:' , order);
        order.toppings = Array.isArray(order.toppings) ? order.toppings.join(", ") : "";
        const sql = `INSERT INTO orders(customer, email, flavor, cone, toppings) VALUES (?, ?, ?, ?, ?);`;
        const params = [
            order.name,
            order.email,
            order.flavor,
            order.cone,
            order.toppings
        ];
        const [result] = await pool.execute(sql, params);
        console.log('Order saved with ID:', result.insertId);

        res.render('confirm', { order });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Sorry, there was an error processing your order. Please try again.');
    }
});

// Define a "admin" route
app.get('/admin', async(req, res) => {
    // res.render('admin', { orders });
    try  {
        const [orders] = await pool.query('SELECT * FROM orders ORDER BY timestamp DESC');
        console.log(orders);
        res.render('admin', { orders });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading orders: ' + err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});