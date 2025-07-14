import React from "react";

const OrSeparator = () => {
  return (
    <div className="w-full flex items-center gap-1">
      <hr className="border border-primary w-1/2" />
      <p className="text-center text-foreground">Or</p>
     <hr className="border border-secondary w-1/2" />
    </div>
  );
};

export default OrSeparator;
