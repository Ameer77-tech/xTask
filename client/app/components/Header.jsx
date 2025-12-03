import React from "react";

const Header = ({ name }) => {
  return (
    <div className="p-5 lg:mt-5 mt-10">
      <div>
        <h1 className="font-bold lg:text-2xl text-2xl">Good Morning, {name}</h1>
        <p className="text-muted-foreground text-sm">
          Here is your dashboard for today.
        </p>
      </div>
    </div>
  );
};

export default Header;
