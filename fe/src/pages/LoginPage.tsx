import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { login } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import { LoginSchema, TLoginSchema } from "../validation/login.schema";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const submitLogin = async () => {
    const formData: TLoginSchema = {
      email,
      password,
    };

    // 1. validate dữ liệu
    const validate = LoginSchema.safeParse(formData);

    if (!validate.success) {
      const errorsZod = validate.error.issues;
      const errors = errorsZod?.map(item => `${item.message} (${item.path[0]})`);
      console.log(errors);

      setErrors(errors);
      return;
    }
    // 2. Gọi API login

    // await login(email, password);
    // navigate("/");
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      px={4}
    >
      <Box w="full" maxW="md" bg="white" boxShadow="md" borderRadius="md" p={8}>
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading size="lg">Đăng Nhập</Heading>
            <Text mt={2} color="gray.600">
              Chào mừng bạn trở lại
            </Text>
          </Box>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Mật khẩu</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </FormControl>

          <Button colorScheme="blue" onClick={submitLogin} isDisabled={!email || !password}>
            Đăng Nhập
          </Button>

          <Text textAlign="center" color="gray.600">
            Chưa có tài khoản?{" "}
            <Link to="/register" style={{ textDecoration: "underline" }}>
              Đăng Ký
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};
