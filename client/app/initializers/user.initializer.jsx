"use client";
import React, { useEffect } from "react";
import useUserStore from "../Store/user.store";

const UserInitializer = ({ userData }) => {
  const setData = useUserStore((state) => state.setData);

  useEffect(() => {
    setData({
      userName: userData.reply.userName,
      email: userData.reply.email || "",
      displayName: userData.reply.displayName || "",
      avatar: userData.reply.avatar,
    });
  }, []);

  return null;
};

export default UserInitializer;
