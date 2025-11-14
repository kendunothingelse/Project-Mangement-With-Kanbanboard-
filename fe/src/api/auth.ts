export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

const USERS_KEY = "auth_users";
const CURRENT_USER_KEY = "auth_current_user";

function readUsers(): User[] {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
    const seed: User[] = [
        { id: "u-1", name: "Ken Adams", email: "ken@example.com", password: "password" },
        { id: "u-2", name: "Jane Doe", email: "jane@example.com", password: "password" }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(seed));
    return seed;
}
function writeUsers(users: User[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
}
export async function login(email: string, password: string): Promise<User> {
    await new Promise(r => setTimeout(r, 300));
    const users = readUsers();
    const user = users.find(
        u => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!user) throw new Error("Invalid credentials");
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
}

export async function register(name: string, email: string, password: string): Promise<User> {
    await new Promise(r => setTimeout(r, 300));
    const users = readUsers();
    if (users.some(u => u.email.trim().toLowerCase() === email.trim().toLowerCase())) {
        throw new Error("Email already registered");
    }
    const newUser: User = { id: `u-${Date.now()}`, name, email, password };
    const updated = [...users, newUser];  writeUsers(updated);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
}
export function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
}
