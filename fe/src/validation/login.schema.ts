import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(3, "Mật khẩu phải từ 6 ký tự"),
});

export type TLoginSchema = z.infer<typeof LoginSchema>;
