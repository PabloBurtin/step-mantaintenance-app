import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    return bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
};

export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};