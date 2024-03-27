import { Request, Response, NextFunction } from 'express';
import { hashPassword } from "./authUtils";
import {
    createUser,
    updateUser,
    deleteUser,
    getUserByID,
    getUserByUsername,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryByID,
    getCategoriesByUserID,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionByID,
    getTransactionsByUserID,
    getTransactionsByCategoryID,
} from "./db";
import { body } from "express-validator";

// User Handlers

export async function createUserHandler(req: Request, res: Response, next: NextFunction) {
    const { username, email, password } = req.body;
    const password_hash = await hashPassword(password);
    const user = await createUser(username, email, password_hash);
    return res.json(user);
}

export async function updateUserHandler(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const password_hash = await hashPassword(password);
    const user = await updateUser(parseInt(id), username, email, password_hash);
    return res.json(user);
}

export const deleteUserHandler = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		await deleteUser(parseInt(id));
		res.status(204).end();
	} catch (error) {
		next(error);
	}
}

export async function getUserByIDHandler(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const user = await getUserByID(parseInt(id));
    return res.json(user);
}

export async function getUserByUsernameHandler(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params;
    const user = await getUserByUsername(username);
    return res.json(user);
}


// Category Handlers
export async function createCategoryHandler(req: Request, res: Response, next: NextFunction) {
    const { name, user_id } = req.body;
    const category = await createCategory(name, user_id);
    return res.json(category);
}

export async function updateCategoryHandler(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { name, user_id } = req.body;
    const category = await updateCategory(name, user_id);
    return res.json(category);
}

export async function deleteCategoryHandler(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const category = await deleteCategory(parseInt(id));
    return res.json(category);
}

export async function getCategoryByIDHandler(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const category = await getCategoryByID(parseInt(id));
    return res.json(category);
}

export async function getCategoriesByUserIDHandler(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.params;
    const categories = await getCategoriesByUserID(parseInt(user_id));
    return res.json(categories);
}

// Transaction Handlers
export async function createTransactionHandler(req: Request, res: Response, next: NextFunction) {
    const { name, amount, date, category_id, user_id } = req.body;
    const transaction = await createTransaction(name, amount, date, category_id, user_id);
    return res.json(transaction);
}

export async function updateTransactionHandler(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { name, amount, date, category_id, user_id } = req.body;
    const transaction = await updateTransaction(parseInt(id), name, amount, date, category_id, user_id);
    return res.json(transaction);
}

export async function deleteTransactionHandler(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const transaction = await deleteTransaction(parseInt(id));
    return res.json(transaction);
}

export async function getTransactionByIDHandler(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const transaction = await getTransactionByID(parseInt(id));
    return res.json(transaction);
}

export async function getTransactionsByUserIDHandler(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.params;
    const transactions = await getTransactionsByUserID(parseInt(user_id));
    return res.json(transactions);
}

export async function getTransactionsByCategoryIDHandler(req: Request, res: Response, next: NextFunction) {
    const { category_id } = req.params;
    const transactions = await getTransactionsByCategoryID(parseInt(category_id));
    return res.json(transactions);
}

