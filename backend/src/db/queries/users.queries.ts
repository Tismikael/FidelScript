import { EmptyRelations } from 'drizzle-orm';
import { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { PgAsyncTransaction } from 'drizzle-orm/pg-core';
import { users, type NewUser, type User } from '../schema';
import bcrypt from "bcrypt";

const createUser = async (
    tx: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
    username: string,
    email: string,
    password: string
): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: NewUser = {
        email,
        username,
        password: hashedPassword,
    };

    const [user] = await tx.insert(users).values(newUser).returning();
    return user;
}

export {
    createUser
}
