import pg from 'pg';
import { environment } from './environment.js';
import { logger } from './logger.js';
import { readFile } from 'fs/promises';

const SCHEMA_FILE = './sql/schema.sql';
const DROP_SCHEMA_FILE = './sql/drop.sql';

const env = environment(process.env, logger);

const sslConfig = {
	rejectUnauthorized: false,
};

if (!env?.connectionString) {
	logger.error('No connection string');
	process.exit(1);
}

const { connectionString } = env;

export const pool = new pg.Pool({
	connectionString,
	ssl: process.env.NODE_ENV === 'production' ? true : sslConfig,
});

pool.on('error', (err: Error) => {
	console.error('Unexpected error on idle client', err);
	process.exit(-1);
});

export async function query(q: string, values: Array<number | string | boolean | Date> = []) {
	let client;
	try {
		client = await pool.connect();
	} catch (e) {
		console.error('unable to get client from pool', e);
		return null;
	}

try {
    const result = values.length === 0 ? await client.query(q) : await client.query(q, values as any);
    return result;
} catch (e) {
    console.error('unable to query', e);
    console.info(q, values);
    return null;
} finally {
    client.release();
}
}

// schema functions
export async function dropSchema(dropFile = DROP_SCHEMA_FILE) {
	const data = await readFile(dropFile);

	return query(data.toString('utf-8'));
}

export async function createSchema(schemaFile = SCHEMA_FILE) {
	const data = await readFile(schemaFile);
	return query(data.toString('utf-8'));
}

// user functions
export async function createUser(username: string, email: string, password_hash: string) {
    return query('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)', [username, email, password_hash]);
}

export async function updateUser(id: number, username: string, email: string, password_hash: string) {
    return query('UPDATE users SET username = $2, email = $3, password_hash = $4 WHERE id = $1', [id, username, email, password_hash]);
}

export async function deleteUser(id: number) {
    return query('DELETE FROM users WHERE id = $1', [id]);
}

export async function getUserByID(id: number) {
    return query('SELECT * FROM users WHERE id = $1', [id]);
}

export async function getUserByUsername(username: string) {
    return query('SELECT * FROM users WHERE username = $1', [username]);
}

// category functions

export async function createCategory(name: string, user_id: number) {
    return query('INSERT INTO categories (name, user_id) VALUES ($1, $2)', [name, user_id]);
}

export async function updateCategory(name: string, user_id: number) {
    return query('UPDATE categories SET name = $2, user_id = $3 WHERE id = $1', [name, user_id]);
}

export async function deleteCategory(id: number) {
    return query('DELETE FROM categories WHERE id = $1', [id]);
}

export async function getCategoryByID(id: number) {
    return query('SELECT * FROM categories WHERE id = $1', [id]);
}

export async function getCategoriesByUserID(user_id: number) {
    return query('SELECT * FROM categories WHERE user_id = $1', [user_id]);
}

// transaction functions

export async function createTransaction(user_id: number, category_id: number, amount: number, description: string, transaction_date: Date) {
    return query('INSERT INTO transactions (user_id, category_id, amount, description, transaction_date) VALUES ($1, $2, $3, $4, $5)', [user_id, category_id, amount, description, transaction_date]);
    console.log(query);
}

export async function updateTransaction(id: number, user_id: number, category_id: number, amount: number, description: string, transaction_date: Date) {
    return query('UPDATE transactions SET user_id = $2, category_id = $3, amount = $4, description = $5, transaction_date = $6 WHERE id = $1', [id, user_id, category_id, amount, description, transaction_date]);
}

export async function deleteTransaction(id: number) {
    return query('DELETE FROM transactions WHERE id = $1', [id]);
}

export async function getTransactionByID(id: number) {
    return query('SELECT * FROM transactions WHERE id = $1', [id]);
}

export async function getTransactionsByUserID(user_id: number) {
    return query('SELECT * FROM transactions WHERE user_id = $1', [user_id]);
}

export async function getTransactionsByCategoryID(category_id: number) {
    return query('SELECT * FROM transactions WHERE category_id = $1', [category_id]);
}

//budget functions

export async function createBudget(user_id: number, category_id: number, amount: number, period_start: Date, period_end: Date) {
    return query('INSERT INTO budgets (user_id, category_id, amount, period_start, period_end) VALUES ($1, $2, $3, $4, $5)', [user_id, category_id, amount, period_start, period_end]);
}

export async function updateBudget(id: number, user_id: number, category_id: number, amount: number, period_start: Date, period_end: Date) {
    return query('UPDATE budgets SET user_id = $2, category_id = $3, amount = $4, period_start = $5, period_end = $6 WHERE id = $1', [id, user_id, category_id, amount, period_start, period_end]);
}

export async function deleteBudget(id: number) {
    return query('DELETE FROM budgets WHERE id = $1', [id]);
}

export async function getBudgetByID(id: number) {
    return query('SELECT * FROM budgets WHERE id = $1', [id]);
}

export async function getBudgetsByUserID(user_id: number) {
    return query('SELECT * FROM budgets WHERE user_id = $1', [user_id]);
}

export async function getBudgetsByCategoryID(category_id: number) {
    return query('SELECT * FROM budgets WHERE category_id = $1', [category_id]);
}

export async function getBudgetsByPeriodStart(period_start: Date) {
    return query('SELECT * FROM budgets WHERE period_start = $1', [period_start]);
}

export async function getBudgetsByPeriodEnd(period_end: Date) {
    return query('SELECT * FROM budgets WHERE period_end = $1', [period_end]);
}



