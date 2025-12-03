"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Dialog from "./Dialog";
import { useRouter } from "next/navigation";

const DeleteBtn = () => {
  const router = useRouter();
  const apiurl = `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/auth/delete-account`;
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiurl, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
      });
      const res = await response.json();
      if (res.success) {
        router.replace("login");
      } else {
        alert(res.reply);
      }
    } catch (err) {
      console.log(err);
      alert("Error");
    } finally {
      setIsOpen(false);
      setLoading(false);
    }
  };
  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Delete Account"
        description="Are you sure about deleting your account this is not reversible."
        variant="destructive"
        children={
          <>
            {loading ? (
              <Button variant={"destructive"} disabled={loading}>
                .........
              </Button>
            ) : (
              <Button
                variant={"destructive"}
                disabled={loading}
                onClick={() => handleDelete()}
              >
                Confirm Deletion
              </Button>
            )}
          </>
        }
      />
      <Button
        onClick={() => setIsOpen(true)}
        variant="destructive"
        className="px-6"
      >
        Delete Account
      </Button>
    </>
  );
};

export default DeleteBtn;
