import Joi from "joi";
import { Pool } from "mysql";
const util = require("util");

// Define the Joi schema for user data
const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().required(),
});

export const saveUserDataToDatabase = async (
    userData: any,
    pool: Pool
  ): Promise<void> => {
    console.log("User data to be saved:", userData);
  
    try {
      // Validate the user data using the defined Joi schema
      const validation = userSchema.validate(userData);
      if (validation.error) {
        throw new Error(validation.error.details[0].message);
      }
  
      const { firstName, lastName, email, age } = userData;
  
      const sqlQuery = `
        INSERT INTO users (firstName, lastName, email, age) 
        VALUES (?, ?, ?, ?) 
        ON DUPLICATE KEY UPDATE firstName = ?, lastName = ?, age = ?
      `;
  
      // Execute the database query
      await pool.query(sqlQuery, [firstName, lastName, email, age, firstName, lastName, age]);
      console.log("User data saved to the database successfully!");
    } catch (error) {
      console.error("Error saving user data to the database:", error);
      throw error;
    }
  };
  
