function GetToken(): string | null {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        return null;
    }

    return token;
}

export { GetToken };
