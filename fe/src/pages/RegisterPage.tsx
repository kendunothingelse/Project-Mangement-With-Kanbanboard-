import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  VStack,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";
import { RegisterSchema, TRegisterSchema } from "../validation/register.schema";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const submitRegister = async () => {
    const formData: TRegisterSchema = {
      username,
      email,
      password,
    };
    // 1. validate dữ liệu
    const validate = RegisterSchema.safeParse(formData);

    if (!validate.success) {
      const errorsZod = validate.error.issues;
      const errors = errorsZod?.map(item => `${item.message} (${item.path[0]})`);
      console.log(errors);

      setErrors(errors);
      return;
    }

    // 2. Gọi api check email tồn tại

    // 3. Email ok → gửi API register
    setErrors([]);
    // await register({ username, email, password });
    // navigate("/login");
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
            <Heading size="lg">Đăng Ký</Heading>
            <Text mt={2} color="gray.600">
              Tạo tài khoản mới
            </Text>
          </Box>
          {errors.length > 0 &&
            errors.map((error, index) => (
              <Alert status="error" key={index} borderRadius="md">
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ))}

          <FormControl isRequired>
            <FormLabel>Tên người dùng</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="yourname"
            />
            <FormErrorMessage>a</FormErrorMessage>
          </FormControl>

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

          <Button colorScheme="blue" onClick={submitRegister}>
            Đăng Ký
          </Button>

          <Text textAlign="center" color="gray.600">
            Đã có tài khoản?{" "}
            <Link to="/login" style={{ textDecoration: "underline" }}>
              Đăng Nhập
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default RegisterPage;
