"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GithubButton, GoogleButton } from "@/components/AuthBtns";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import Toast from "@/components/Toast";
import { useRouter } from "next/navigation";
import { EyeClosed, Eye, Check } from "lucide-react";

const Form = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [responseStatus, setresponseStatus] = useState({
    message: "",
    isSuccess: false,
    type: "",
  });
  const [showToast, setshowToast] = useState(false);
  const [showPassword, setshowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setErrors({});
    const url = `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/auth/verify-user`;
    setPending(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const response = await res.json();
      if (!response.success) {
        setresponseStatus({
          message: response.reply,
          type: "error",
          isSuccess: false,
        });
        setshowToast(true);
        setTimeout(() => {
          setshowToast(false);
        }, 2000);
      } else {
        setresponseStatus({
          message: response.reply,
          type: "success",
          isSuccess: true,
        });
        setLoggedIn(true);
        setshowToast(true);
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Toast show={showToast} toastData={responseStatus} />
      {loggedIn ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-4">
          <Card className="w-full max-w-sm border-none shadow-2xl shadow-primary/20 ring-1 ring-primary/10 animate-in fade-in zoom-in-95 duration-300">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              {/* Animated Icon Container */}
              <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping opacity-75 duration-1000" />
                <Check className="h-12 w-12 text-primary" strokeWidth={3} />
              </div>
              {/* Text Content */}
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Welcome Back
              </h2>
              <p className="mt-2 text-muted-foreground">
                You are successfully logged in.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="w-full border-0 sm:w-3/4 md:w-2/3 lg:w-2/5">
          <CardHeader className="mb-5">
            <CardTitle className="text-3xl tracking-tighter font-medium text-primary md:text-4xl lg:text-5xl">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm md:text-base lg:text-lg">
              Login to manage your tasks
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="Username"
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className={`lg:py-2 ${
                    errors.username ? "border-destructive" : ""
                  }`}
                  disabled={pending}
                />
                {errors.username && (
                  <p className="text-destructive text-sm">{errors.username}</p>
                )}
              </div>

              <div className="flex flex-col gap-1 relative">
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`lg:py-2 ${
                    errors.password ? "border-destructive" : ""
                  }`}
                  disabled={pending}
                />
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password}</p>
                )}
                <div
                  onClick={() => setshowPassword((prev) => !prev)}
                  className="absolute right-5 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <Eye size={"17"} className="text-primary" />
                  ) : (
                    <EyeClosed size={"17"} />
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full select-none"
                disabled={pending}
              >
                {pending ? (
                  <>
                    <Spinner className="size-5 mr-2" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            <div className="border-accent w-full h-px border relative my-10  select-none">
              <span className="text-muted-foreground bg-card absolute left-1/2 -translate-x-1/2 -top-3 w-40 lg:w-50 text-center">
                Or Continue With
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <GithubButton />
              <GoogleButton />
            </div>
          </CardContent>

          <CardFooter className="text-center text-sm text-muted-foreground mt-2">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline cursor-pointer">
              create account
            </Link>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default Form;
