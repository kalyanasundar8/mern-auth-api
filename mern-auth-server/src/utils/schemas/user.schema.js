import z from "zod";

export const userSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  email: z.string().email({ message: "Enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must have atleast 6 charater" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must have atleast 6 character" }),
});
