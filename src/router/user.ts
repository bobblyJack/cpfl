export async function getUser() {
    let name = localStorage.getItem('username');
    if (!name) {
        const user: any = {name: 'admin'}; //placeholder
        if (!user.name) {
            throw new Error('username missing');
        }
        name = user.name as string;
        localStorage.setItem('name', name);
    }
    return name;
}