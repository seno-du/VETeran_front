import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function Button({ className, children, ...props }: ButtonProps) {
    return (
      <button
        className={`px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-800 ${className || ""}`}
        {...props}
      >
        {children}
      </button>
    );
  }
  
  
