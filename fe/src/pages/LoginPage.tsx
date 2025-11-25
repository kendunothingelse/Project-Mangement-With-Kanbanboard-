import {Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input} from "@chakra-ui/react";
import {useState} from "react";
import {login} from "../api/auth";
import {useNavigate} from "react-router-dom";
import WorkspacePage from "./WorkspacePage";


export const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    let navigate = useNavigate();
    const submitLogin = () => {
        // Implement login logic here
        login(username, password);
        navigate("/");
    }
    const isError = username === ''
    return (
        <>
            <FormControl isInvalid={isError}>
                <FormLabel>Username</FormLabel>
                <Input type='text' value={username} onChange={(e) => setUsername(e.target.value)}/>
                <FormLabel>Password</FormLabel>
                <Input type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                <Button type="submit" onClick={submitLogin}> Login </Button>

            </FormControl>
        </>
    );
};
