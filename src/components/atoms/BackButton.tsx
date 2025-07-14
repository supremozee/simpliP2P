import React from "react";
import BackIcon from "./Icons/BackIcon";
import { useRouter } from "next/navigation";

const BackButton = () => {
    const router = useRouter()
  return (
    <button
      className="rounded-full bg-primary w-10 h-10 shadow-md drop-shadow-md flex justify-center items-center"
      onClick={() => router.back()}
    >
      <BackIcon />
    </button>
  );
};

export default BackButton;
