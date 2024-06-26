import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { Request, Response, NextFunction } from "express";
import { pool } from "./db.js";

interface IUser {
	id: number;
	username: string;
    email: string;
    password_hash: string;
}

declare global {
	namespace Express {
		interface User extends IUser { }
	}
}

const options: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET as string,
};
interface JwtPayload {
	[key: string]: number | string;
}
passport.use(new JwtStrategy(options, async (jwt_payload: JwtPayload, done) => {
	try {
		const { rows } = await pool.query<IUser>('SELECT * FROM Users WHERE id = $1', [jwt_payload.id]);
		if (rows.length > 0) {
			const user = rows[0];
			const normalizedUser = {
				...user
			};
			return done(null, normalizedUser);
		}
		return done(null, false);
	} catch (error) {
		return done(error, false);
	}
}));

export function authenticate(req: Request, res: Response, next: NextFunction): void {
	passport.authenticate('jwt', { session: false }, (err: Error, user: Express.User | null) => {
		if (err) {
			console.log(err)
			return res.status(400).json({ message: err.message });
		}
		if (!user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		req.user = user;
		next();
	})(req, res, next);
}