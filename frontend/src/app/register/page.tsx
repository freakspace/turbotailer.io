"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useContext, useEffect } from "react";
import Link from "next/link";

import { getAuth } from "../login/services";

import { UserContext, IContext } from "@/context/UserContext";

function isValidEmail(email: string): boolean {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordRepeated, setPasswordRepeated] = useState<string>("");
  const [termsIsChecked, setTermsIsChecked] = useState<boolean>(false);
  const [newsletterIsChecked, setNewsletterIsChecked] =
    useState<boolean>(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");

  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const { token, setToken } = useContext(UserContext) as IContext;
  const { push } = useRouter();

  const validateSubmission = () => {
    let isValid = true;

    if (!isValidEmail(email)) {
      setEmailError("This is not a valid e-mail");
      isValid = false;
    } else {
      setEmailError("");
      isValid = true;
    }

    if (password !== passwordRepeated) {
      setPasswordError("Passwords doesn't match");
      isValid = false;
    } else {
      setPasswordError("");
      isValid = true;
    }

    if (!termsIsChecked) {
      setTermsError("Please accept our Terms and Conditions");
      isValid = false;
    } else {
      setTermsError("");
      isValid = true;
    }

    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const isValid = validateSubmission();
    if (isValid) {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/register/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let errors: string[] = [];
        for (let field in data) {
          data[field].forEach((errorMessage: string) => {
            errors.push(errorMessage);
          });
        }
        setServerErrors(errors);
      } else {
        setServerErrors([]);
        // login
        const response = await getAuth(username, password);

        if (response.ok) {
          const data = await response.json();
          setToken(data.token);
        } else {
          //Check for errors
        }
      }

      console.log(data);
    }
  };

  useEffect(() => {
    if (token) {
      push("onboarding/");
    }
  }, [push, token]);

  return (
    <div className="w-screen">
      <div className="container mx-auto">
        <div className="flex justify-center items-center h-screen">
          <div className="w-1/2">
            <div className="bg-gray-50 rounded-2xl border border-solid border-gray-300 p-10 shadow-xl">
              <h2 className="text-5xl mb-3 text-pink-600 font-bold">
                Turbocharge Your Store
              </h2>
              <p className="text-lg mb-5 font-bold">
                Create an account to get started
              </p>
              {serverErrors &&
                serverErrors.map((error, id) => (
                  <span key={id} className="text-red-600">
                    {error}
                  </span>
                ))}
              <form onSubmit={handleSubmit}>
                <div className={"flex flex-col mb-4"}>
                  <label className="">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="h-10 rounded-md border border-solid border-gray-300 focus:border-2 focus:border-pink-600 focus:outline-none"
                  />
                </div>
                <div
                  className={
                    (emailError ? "border-solid border-red-600 " : "") +
                    "flex flex-col mb-4"
                  }
                >
                  <label
                    htmlFor="email"
                    className={(emailError ? "text-red-600 " : "") + "mb-1"}
                  >
                    Your E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={
                      (emailError
                        ? "border-solid border border-red-600 "
                        : "border-solid border border-gray-300 ") +
                      "h-10 rounded-md focus:border-2 focus:border-pink-600 focus:outline-none"
                    }
                    required
                  />
                  {emailError && (
                    <span className="text-sm text-red-600">{emailError}</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-8 mb-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor="password"
                      className={
                        (passwordError ? "text-red-600 " : "") + "mb-1"
                      }
                    >
                      Create a Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-solid border border-gray-300 h-10 rounded-md focus:border-2 focus:border-pink-600 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="password"
                      className={passwordError ? "text-red-600 " : "mb-1"}
                    >
                      Repeat Password
                    </label>
                    <input
                      type="password"
                      id="password-repeated"
                      name="password-repeated"
                      value={passwordRepeated}
                      onChange={(e) => setPasswordRepeated(e.target.value)}
                      className={
                        (passwordError
                          ? "border-solid border border-red-600 "
                          : "border-solid border border-gray-300 ") +
                        "h-10 rounded-md focus:border-2 focus:border-pink-600 focus:outline-none"
                      }
                      required
                    />
                  </div>
                  {passwordError && (
                    <span className="text-sm text-red-600">
                      {passwordError}
                    </span>
                  )}
                </div>
                <label
                  htmlFor="terms"
                  className="flex items-center space-x-3 mb-4"
                >
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    className="h-5 w-5 flex-shrink-0"
                    checked={termsIsChecked}
                    onChange={() => setTermsIsChecked(!termsIsChecked)}
                  />
                  <span
                    className={(termsError ? "text-red-600 " : "") + "text-sm"}
                  >
                    By creating a Turbotailer account you agree to our Terms of
                    Use and Privacy Policy
                  </span>
                </label>
                {termsError && (
                  <span className="text-sm text-red-600">{termsError}</span>
                )}
                <label
                  htmlFor="subscribe"
                  className="flex items-center space-x-3 mb-4"
                >
                  <input
                    type="checkbox"
                    id="subscribe"
                    name="subscribe"
                    className="h-5 w-5 text-blue-600 flex-shrink-0"
                    checked={newsletterIsChecked}
                    onChange={() =>
                      setNewsletterIsChecked(!newsletterIsChecked)
                    }
                  />
                  <span className="text-sm">
                    Receive tips & tricks on a regularly basis
                  </span>
                </label>
                <button
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-xl font-bold text-xl mt-3 mb-5"
                >
                  Register
                </button>
              </form>
              <p>
                Already have an account?{" "}
                <Link href={"login/"} className="text-pink-600 font-bold">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
