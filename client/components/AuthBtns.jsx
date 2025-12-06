"use client";
import React from "react";
import { Button } from "./ui/button";
import { FaGoogle, FaGithub } from "react-icons/fa6";
import { githubRedirect, googleRedirect } from "@/app/actions/oauth";

export const GoogleButton = () => {
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
