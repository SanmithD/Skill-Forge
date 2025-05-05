import { z } from 'zod';

const signupSchema = (req, res, next) => {
  const signupReq = z.object({
    name: z.string().min(3).max(20),
    email: z.string().email(), // ✅ FIXED
    password: z.string().min(3).max(10)
  });

  const result = signupReq.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid signup data",
      errors: result.error.errors  // optional: show specific field issues
    });
  }

  next();
};

const loginSchema = (req, res, next) => {
  const loginReq = z.object({
    email: z.string().email(), // ✅ FIXED
    password: z.string().min(3).max(10)
  });

  const result = loginReq.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid login data",
      errors: result.error.errors
    });
  }

  next();
};

export { loginSchema, signupSchema };

