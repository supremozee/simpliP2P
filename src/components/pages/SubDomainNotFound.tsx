"use client";
import Link from "next/link";
import React from "react";

const SubdomainNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-primary mb-4">403</h1>
      <p className="text-xl text-primary text-center mb-8">
        Invalid subdomain. This subdomain is not authorized to access this application.
      </p>
      <Link
        href="app.simplip2p.com/signup"
        className="px-6 py-3 bg-primary text-white rounded-md text-lg transition duration-300 hover:bg-primary/90"
      >
        Register
      </Link>
    </div>
  );
};

export default SubdomainNotFound;