import { getUser } from "./auth";

export async function getUsername() {
    let name = localStorage.getItem('username');
    if (!name) {
        const user = await getUser();
        name = user.name;
        localStorage.setItem('username', name);
    }
    return name;
}