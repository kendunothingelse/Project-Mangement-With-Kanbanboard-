import {useState} from "react";
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Text
} from "@chakra-ui/react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

export default function RegisterPage() {
    const {register} = useAuth();
    const navigate = useNavigate();
    const location = useLocation() as any;
    const [name, setName] = useState("Ken Adams");
    const [email, setEmail] = useState("ken@example.com");
    const [password, setPassword] = useState("password");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const from = location.state?.from?.pathname || "/";

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await register(name, email, password);
            navigate(from, {replace: true});
        } catch (err: any) {
            setError(err?.message || "Registration failed");
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <Container maxW="md" py={10}>
            <Heading mb={6} textAlign="center">Register</Heading>
            <Box as="form" onSubmit={onSubmit} p={6} borderWidth="1px" rounded="md">
                <FormControl mb={4} isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input value={name} onChange={e => setName(e.target.value)}/>
                </FormControl>
                <FormControl mb={4} isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)}/>
                </FormControl>
                <FormControl mb={4} isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
                </FormControl>
                {error && <Text color="red.500" mb={3}>{error}</Text>}
                <Button type="submit" colorScheme="blue" isLoading={submitting} width="100%">Create account</Button>
                <Text mt={4} textAlign="center">
                    Have an account? <Link to="/login">Login</Link>
                </Text>
            </Box>
        </Container>
    );
}
