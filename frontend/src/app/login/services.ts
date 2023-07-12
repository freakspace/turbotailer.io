export const getAuth = async (username: string, password: string) => {
    const response = await fetch(`http://127.0.0.1:8000/auth-token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    return response
}