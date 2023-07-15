"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useContext, useEffect } from "react";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";

import { getAuth } from "../login/services";

import { UserContext, IContext } from "@/context/UserContext";

import Input from "../components/Input";
import Button from "../components/Button";
import { spinner } from "../components/utils";

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

  const [logs, setLogs] = useState("");

  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async () => {
    setIsLoading(true);
    const isValid = validateSubmission();
    if (isValid) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/users/register/`,
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
      console.log(response);
      const data = await response.json();
      setLogs(data);
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

      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      push("onboarding/");
    }
  }, [push, token]);

  return (
    <div className="w-screen">
      <p className="text-black">{process.env.NEXT_PUBLIC_DJANGO_API_URL}</p>
      <pre className="text-black">{logs && JSON.stringify(logs)}</pre>
      <div className="container mx-auto">
        <div className="flex justify-center items-center h-screen">
          <div className="md:w-1/2 mx-4">
            <div className="relative bg-white rounded-2xl border border-solid border-gray-300 md:p-10 p-6 shadow-xl">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-2xl">
                  <motion.div
                    className="w-6 h-6 border-t-2 border-pink-600 rounded-full mr-2"
                    animate={spinner.animate}
                    transition={spinner.transition}
                  />
                  <div className="text-lg font-bold">Hold your horses...</div>
                </div>
              )}
              <h1 className="text-3xl font-bold mb-5 text-gray-800">
                Register
              </h1>
              {serverErrors &&
                serverErrors.map((error, id) => (
                  <span key={id} className="text-red-600">
                    {error}
                  </span>
                ))}
              <div className={"flex flex-col mb-4"}>
                <Input
                  placeholder="Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div
                className={
                  (emailError ? "border-solid border-red-600 " : "") +
                  "flex flex-col mb-4"
                }
              >
                <Input
                  placeholder="E-mail"
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  error={emailError}
                />
                {emailError && (
                  <span className="text-sm text-red-600">{emailError}</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-8 mb-4">
                <div className="flex flex-col">
                  <Input
                    placeholder="Password"
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <Input
                    placeholder="Repeat password"
                    type="password"
                    id="password-repeated"
                    name="password-repeated"
                    value={passwordRepeated}
                    onChange={(e) => setPasswordRepeated(e.target.value)}
                    required
                    error={passwordError}
                  />
                </div>
              </div>
              <label
                htmlFor="terms"
                className="flex items-center space-x-3 mb-5"
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
              <label
                htmlFor="subscribe"
                className="flex items-center space-x-3 mb-5"
              >
                <input
                  type="checkbox"
                  id="subscribe"
                  name="subscribe"
                  className="h-5 w-5 text-blue-600 flex-shrink-0"
                  checked={newsletterIsChecked}
                  onChange={() => setNewsletterIsChecked(!newsletterIsChecked)}
                />
                <span className="text-sm">
                  Receive tips & tricks on a regularly basis
                </span>
              </label>
              <Button onClick={() => handleSubmit()}>Register</Button>
              <p className="mt-5">
                Already have an account?{" "}
                <Link href={"login/"} className="text-pink-600 font-bold">
                  Log In
                </Link>
              </p>
            </div>
            <div className="div text-center mt-5">
              <p className="text-xl font-bold">Turbotailer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
