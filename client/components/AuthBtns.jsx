"use client";
import React from "react";
import { Button } from "./ui/button";
import { FaGoogle, FaGithub } from "react-icons/fa6";

export const GoogleButton = () => {
  const googleRedirect = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/auth/google`;
  };

  return (
    <Button
      onClick={googleRedirect}
      variant="outline"
      className="flex-1 flex items-center justify-center gap-2 active:bg-accent/50"
    >
      <FaGoogle />
      Google
    </Button>
  );
};

export const GithubButton = () => {
  const githubRedirect = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/auth/github`;
  };

  return (
    <Button
      onClick={githubRedirect}
      variant="outline"
      className="flex-1 flex items-center justify-center gap-2 active:bg-accent/50"
    >
      <FaGithub />
      Github
    </Button>
  );
};
