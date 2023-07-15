export const getAuth = async (username: string, password: string) => {

    const response = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_API_URL}/auth-token/`, {
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