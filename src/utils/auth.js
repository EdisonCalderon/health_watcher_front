
const login = (username, password) => {
    if (username === 'admin' && password === 'admin123') localStorage.setItem('loggedIn', true);
}

const logout = () => {
    localStorage.removeItem('loggedIn');
}

const isLoggedIn = () => {
    return localStorage.getItem('loggedIn') === 'true'
}

export { login, logout, isLoggedIn }