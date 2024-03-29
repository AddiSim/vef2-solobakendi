import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate } from '../lib/auth.js';
import { loginUser } from '../lib/db.js';
import { 
    createUserHandler,
    updateUserHandler,
    deleteUserHandler,
    getUserByIDHandler,
    getUserByUsernameHandler,
    createCategoryHandler,
    updateCategoryHandler,
    deleteCategoryHandler,
    getCategoriesHandler,
    getCategoryByIDHandler,
    getCategoriesByUserIDHandler,
    createTransactionHandler,
    updateTransactionHandler,
    deleteTransactionHandler,
    getTransactionsHandler,
    getTransactionByIDHandler,
    getTransactionsByUserIDHandler,
    getTransactionsByCategoryIDHandler,
    createBudgetHandler,
    updateBudgetHandler,
    deleteBudgetHandler,
    getBudgetsHandler,
    getBudgetByIDHandler,
    getBudgetsByUserIDHandler,
    getBudgetsByCategoryIDHandler,
    getBudgetsByPeriodStartHandler,
    getBudgetsByPeriodEndHandler,
} from '../lib/crud.js';

dotenv.config();

export const router = express.Router();

export async function index(req: Request, res: Response) {
    res.json([
        {
            href: '/users',
            method: ['GET', 'POST'],
            description: 'Endpoints for user operations. POST to create a new user, GET to retrieve user list with optional filtering.',
        },
        {
            href: '/users/:id',
            method: ['GET', 'PATCH', 'DELETE'],
            description: 'Endpoints for operating on a specific user by ID. GET to retrieve, PATCH to update, DELETE to remove.',
        },
        {
            href: '/users/username/:username',
            method: ['GET'],
            description: 'Endpoint to retrieve a user by username.',
        },
        {
            href: '/categories',
            method: ['GET','POST'],
            description: 'Endpoint to create a new category.',
        },
        {
            href: '/categories/:id',
            method: ['GET', 'PATCH', 'DELETE'],
            description: 'Endpoints for operating on a specific category by ID. GET to retrieve, PATCH to update, DELETE to remove.',
        },
        {
            href: '/categories/user/:user_id',
            method: ['GET'],
            description: 'Endpoint to retrieve all categories for a specific user ID.',
        },
        {
            href: '/transactions',
            method: ['GET','POST'],
            description: 'Endpoint to create a new transaction.',
        },
        {
            href: '/transactions/:id',
            method: ['GET', 'PATCH', 'DELETE'],
            description: 'Endpoints for operating on a specific transaction by ID. GET to retrieve, PATCH to update, DELETE to remove.',
        },
        {
            href: '/transactions/user/:user_id',
            method: ['GET'],
            description: 'Endpoint to retrieve all transactions for a specific user ID.',
        },
        {
            href: '/transactions/category/:category_id',
            method: ['GET'],
            description: 'Endpoint to retrieve all transactions for a specific category ID.',
        },
        {
            href: '/budgets',
            method: ['GET','POST'],
            description: 'Endpoint to create a new budget.',
        },
        {
            href: '/budgets/:id',
            method: ['GET', 'PATCH', 'DELETE'],
            description: 'Endpoints for operating on a specific budgets by ID. GET to retrieve, PATCH to update, DELETE to remove.',
        },
        {
            href: '/budgets/user/:user_id',
            method: ['GET'],
            description: 'Endpoint to retrieve all budgets for a specific user ID.',
        },
        {
            href: '/budgets/category/:category_id',
            method: ['GET'],
            description: 'Endpoint to retrieve all budgets for a specific category ID.',
        },
        {
            href: '/budgets/period_start/:period_start',
            method: ['GET'],
            description: 'Endpoint to retrieve all budgets for a specific period start.',
        },
        {
            href: '/budgets/period_end/:period_end',
            method: ['GET'],
            description: 'Endpoint to retrieve all budgets for a specific period end.',
        },
        {
            href: '/login',
            method: ['POST'],
            description: 'Endpoint for user login.',
        }
    ]);
}


router.get('/', index);

router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	const user = await loginUser(username);
	if (!user) {
		return res.status(401).json({ error: 'Login failed' });
	}

	const secret = process.env.JWT_SECRET || 'default-secret';
	const match = await bcrypt.compare(password, user.password_hash);
	if (match) {
		const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });
        res.status(200).json({ token, user: { id: user.id, username: user.username } });
	} else {
		res.status(401).json({ error: 'Login failed' });
	}
});

// User Routes
router.post('/users', createUserHandler);
router.patch('/users/:id', authenticate, updateUserHandler);
router.delete('/users/:id', authenticate, deleteUserHandler);
router.get('/users/:id', getUserByIDHandler);
router.get('/users/username/:username', getUserByUsernameHandler);
// Category Routes
router.post('/categories', createCategoryHandler);
router.patch('/categories/:id', authenticate, updateCategoryHandler);
router.delete('/categories/:id', authenticate, deleteCategoryHandler);
router.get('/categories', authenticate, getCategoriesHandler);
router.get('/categories/:id', authenticate, getCategoryByIDHandler);
router.get('/categories/user/:user_id', authenticate, getCategoriesByUserIDHandler);
// Transaction Routes
router.post('/transactions', createTransactionHandler);
router.patch('/transactions/:id', authenticate, updateTransactionHandler);
router.delete('/transactions/:id', authenticate,  deleteTransactionHandler);
router.get('/transactions', authenticate, getTransactionsHandler);
router.get('/transactions/:id',authenticate,  getTransactionByIDHandler);
router.get('/transactions/user/:user_id', authenticate, getTransactionsByUserIDHandler);
router.get('/transactions/category/:category_id', authenticate,  getTransactionsByCategoryIDHandler);
// Budget Routes
router.post('/budgets', authenticate, createBudgetHandler);
router.patch('/budgets/:id', authenticate, updateBudgetHandler);
router.delete('/budgets/:id', authenticate, deleteBudgetHandler);
router.get('/budgets', authenticate, getBudgetsHandler);
router.get('/budgets/:id', authenticate, getBudgetByIDHandler);
router.get('/budgets/user/:user_id', authenticate, getBudgetsByUserIDHandler);
router.get('/budgets/category/:category_id', authenticate, getBudgetsByCategoryIDHandler);
router.get('/budgets/period_start/:period_start', authenticate, getBudgetsByPeriodStartHandler);
router.get('/budgets/period_end/:period_end', authenticate, getBudgetsByPeriodEndHandler);
