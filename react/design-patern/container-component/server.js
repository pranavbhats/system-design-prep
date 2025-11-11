import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data
let currentUser = {
	name: 'John Doe',
	age: 54,
	hairColor: 'brown',
	hobbies: ['swimming', 'bicycling', 'video games'],
};

let users = [{
	id: '123',
	name: 'John Doe',
	age: 54,
	hairColor: 'brown',
	hobbies: ['swimming', 'bicycling', 'video games'],
}, {
	id: '234',
	name: 'Brenda Smith',
	age: 33,
	hairColor: 'black',
	hobbies: ['golf', 'mathematics'],
}, {
	id: '345',
	name: 'Jane Garcia',
	age: 27,
	hairColor: 'blonde',
	hobbies: ['biology', 'medicine', 'gymnastics'],
}];

let products = [{
	id: '1',
	name: 'Flat-Screen TV',
	price: '$300',
	description: 'Huge LCD screen, a great deal',
	rating: 4.5,
}, {
	id: '2',
	name: 'Basketball',
	price: '$10',
	description: 'Just like the pros use',
	rating: 3.8,
}, {
	id: '3',
	name: 'Running Shoes',
	price: '$120',
	description: 'State-of-the-art technology for optimum running',
	rating: 4.2,
}];

// Helper function to generate unique IDs
const generateId = () => Date.now().toString();

// ============ USERS CRUD OPERATIONS ============

// GET all users
app.get('/api/users', (req, res) => {
	res.json(users);
});

// GET single user by ID
app.get('/api/users/:id', (req, res) => {
	const user = users.find(u => u.id === req.params.id);
	if (!user) {
		return res.status(404).json({ error: 'User not found' });
	}
	res.json(user);
});

// POST create new user
app.post('/api/users', (req, res) => {
	const newUser = {
		id: generateId(),
		...req.body
	};
	users.push(newUser);
	res.status(201).json(newUser);
});

// PUT update user
app.put('/api/users/:id', (req, res) => {
	const index = users.findIndex(u => u.id === req.params.id);
	if (index === -1) {
		return res.status(404).json({ error: 'User not found' });
	}
	users[index] = { ...users[index], ...req.body, id: req.params.id };
	res.json(users[index]);
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
	const index = users.findIndex(u => u.id === req.params.id);
	if (index === -1) {
		return res.status(404).json({ error: 'User not found' });
	}
	const deletedUser = users.splice(index, 1)[0];
	res.json(deletedUser);
});

// ============ PRODUCTS CRUD OPERATIONS ============

// GET all products
app.get('/api/products', (req, res) => {
	res.json(products);
});

// GET single product by ID
app.get('/api/products/:id', (req, res) => {
	const product = products.find(p => p.id === req.params.id);
	if (!product) {
		return res.status(404).json({ error: 'Product not found' });
	}
	res.json(product);
});

// POST create new product
app.post('/api/products', (req, res) => {
	const newProduct = {
		id: generateId(),
		...req.body
	};
	products.push(newProduct);
	res.status(201).json(newProduct);
});

// PUT update product
app.put('/api/products/:id', (req, res) => {
	const index = products.findIndex(p => p.id === req.params.id);
	if (index === -1) {
		return res.status(404).json({ error: 'Product not found' });
	}
	products[index] = { ...products[index], ...req.body, id: req.params.id };
	res.json(products[index]);
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
	const index = products.findIndex(p => p.id === req.params.id);
	if (index === -1) {
		return res.status(404).json({ error: 'Product not found' });
	}
	const deletedProduct = products.splice(index, 1)[0];
	res.json(deletedProduct);
});

// ============ CURRENT USER OPERATIONS ============

// GET current user
app.get('/api/current-user', (req, res) => {
	res.json(currentUser);
});

// PUT update current user
app.put('/api/current-user', (req, res) => {
	currentUser = { ...currentUser, ...req.body };
	res.json(currentUser);
});

// Start server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});