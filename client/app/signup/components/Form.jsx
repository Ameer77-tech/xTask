"use client";
import { GithubButton, GoogleButton } from "@/components/AuthBtns";
import Toast from "@/components/Toast";
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
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Form = () => {
  const router = useRouter();
  const [showPassword, setshowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    displayName: "",
    password: "",
    confirmPassword: "",
  });
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState({});
  const [responseStatus, setresponseStatus] = useState({
    message: "",
    isSuccess: false,
    type: "",
  });
  const [showToast, setshowToast] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required.";
    } else if (!/^[A-Za-z0-9@._-]+$/.test(formData.userName)) {
      newErrors.userName =
        "Username can only include letters, numbers, underscores, dots, hyphens, or @.";
    } else if (!/[A-Z0-9@._-]/.test(formData.userName)) {
      newErrors.userName =
        "Username should include at least one number, one capital or special character like _ or @.";
    }
    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6 || formData.password.length > 15) {
      newErrors.password = "Password must be between 6 and 15 characters.";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const url = `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/auth/register-user`;
    setPending(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/auth/register-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );
      const response = await res.json();
      if (!response.success) {
        setresponseStatus({
          message: response.reply,
          isSuccess: response.success,
          type: "error",
        });
        setshowToast(true);
        setTimeout(() => {
          setresponseStatus("");
          setshowToast(false);
        }, 2000);
      } else {
        setshowToast(true);
        setresponseStatus({
          message: response.reply,
          isSuccess: response.success,
          type: "success",
        });
        router.push("/");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setPending(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  return (
    <>
      <Toast toastData={responseStatus} show={showToast} />
      <Card className="w-full border-0 sm:w-3/4 md:w-2/3 lg:w-2/5">
        <CardHeader className={"mb-5"}>
          <CardTitle className="text-3xl font-medium tracking-tighter text-primary md:text-4xl lg:text-5xl">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-sm md:text-base lg:text-lg">
            Join our community and start managing your tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Input
                onChange={handleChange}
                placeholder="Username"
                name="userName"
                value={formData.userName}
                className={"lg:text-lg lg:py-2"}
              />
              {errors.userName && (
                <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
              )}
            </div>
            <div>
              <Input
                onChange={handleChange}
                name="displayName"
                placeholder="Display Name"
                type="text"
                value={formData.displayName}
                className={"lg:text-lg lg:py-2"}
              />
              {errors.displayName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.displayName}
                </p>
              )}
            </div>
            <div>
              <Input
                onChange={handleChange}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                className={"lg:text-lg lg:py-2"}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div className="relative">
              <Input
                onChange={handleChange}
                placeholder="Confirm Password"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                className={"lg:text-lg lg:py-2"}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
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
            {pending ? (
              <Button type="submit" className="w-full" disabled>
                <Spinner className={"size-5"} />
                Sign Up
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            )}
          </form>

          <div className="border-accent w-full h-px border relative my-10">
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
          Already have an account?{" "}
          <Link href={"/login"} className="underline cursor-pointer">
            Log in
          </Link>
        </CardFooter>
      </Card>
    </>
  );
};

export default Form;
