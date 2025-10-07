import { prisma } from "../utils/prisma.js";
import bcrypt from "bcrypt";
import { type User } from "@prisma/client";

const SALT_ROUNDS = 10;

export const registerUser = async (email: string, password: string): Promise<User> => {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (user) throw new Error("User already exists");
    // hashed with salt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword
        }
    });
    return newUser;
}

export const loginUser = async (email: string, password: string): Promise<User> => {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (!user) throw new Error("User not found");
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid password");
    return user;
}