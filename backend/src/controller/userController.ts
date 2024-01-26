import { Request, Response } from "express";
import User, { IUser } from "../model/user.model";

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const newUser: IUser = new User({ name, email, password, role });
    const savedUser = await newUser.save();

    res.status(201).json({ savedUser, message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update user by ID
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, email, password, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, password, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ updatedUser, message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete user by ID
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ deletedUser, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
