"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { FaGoogle, FaGithub } from "react-icons/fa6";
import { githubRedirect, googleRedirect } from "@/app/actions/oauth";
import Loading from "./Loading";
import { Spinner } from "./ui/spinner";

export const GoogleButton = () => {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      disabled={loading}
      onClick={() => {
        setLoading(true);
        googleRedirect();
      }}
      variant="outline"
      className="flex-1 flex items-center justify-center gap-2 active:bg-accent/50"
    >
      {loading ? (
        <Spinner className={"text-accent size-5"} />
      ) : (
        <>
          {" "}
          <FaGoogle />
          Google
        </>
      )}
    </Button>
  );
};

export const GithubButton = () => {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      disabled={loading}
      onClick={() => {
        setLoading(true);
        githubRedirect();
      }}
      variant="outline"
      className="flex-1 flex items-center justify-center gap-2 active:bg-accent/50"
    >
      {loading ? (
        <Spinner className={"text-accent size-5"} />
      ) : (
        <>
          {" "}
          <FaGithub />
          Github
        </>
      )}
    </Button>
  );
};
