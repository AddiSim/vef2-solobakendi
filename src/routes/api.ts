import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import { catchErrors } from 'src/lib/catch-errors';
import bcrypt from 'bcrypt';
import { 
    createUserHandler,
    updateUserHandler,
    deleteUserHandler,
    getUserByIDHandler,
    getUserByUsernameHandler,
    createCategoryHandler,
    updateCategoryHandler,
    deleteCategoryHandler,
    getCategoryByIDHandler,
    getCategoriesByUserIDHandler,
    createTransactionHandler,
    updateTransactionHandler,
    deleteTransactionHandler,
    getTransactionByIDHandler,
    getTransactionsByUserIDHandler,
    getTransactionsByCategoryIDHandler
} from 'src/lib/crud';

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
            method: ['POST'],
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
            method: ['POST'],
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
            href: '/login',
            method: ['POST'],
            description: 'Endpoint for user login.',
        }
    ]);
}


router.get('/', index);

// User Routes
router.post('/users', createUserHandler);
router.patch('/users/:id', updateUserHandler);
router.delete('/users/:id', deleteUserHandler);
router.get('/users/:id', getUserByIDHandler);
router.get('/users/username/:username', getUserByUsernameHandler);
// Category Routes
router.post('/categories', createCategoryHandler);
router.patch('/categories/:id', updateCategoryHandler);
router.delete('/categories/:id', deleteCategoryHandler);
router.get('/categories/:id', getCategoryByIDHandler);
router.get('/categories/user/:user_id', getCategoriesByUserIDHandler);
// Transaction Routes
router.post('/transactions', createTransactionHandler);
router.patch('/transactions/:id', updateTransactionHandler);
router.delete('/transactions/:id', deleteTransactionHandler);
router.get('/transactions/:id', getTransactionByIDHandler);
router.get('/transactions/user/:user_id', getTransactionsByUserIDHandler);
router.get('/transactions/category/:category_id', getTransactionsByCategoryIDHandler);
