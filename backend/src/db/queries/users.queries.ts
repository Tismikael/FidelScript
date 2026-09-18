import { db } from '../index';
import { NewUser, users } from '../schema';

const insertUser = async (user: NewUser) => {
    return db.insert(users).values(user);
}

export {
    insertUser
}

// const newUser: NewUser = { username: 'lookman', email: 'lookman@gmail.com', createdAt: new Date()};

// await insertUser(newUser);