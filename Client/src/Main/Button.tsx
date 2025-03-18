import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'default' | 'icon';
    className?: string;
}

const Button = ({ children, variant = 'default', size = 'default', className = '', ...props } : ButtonProps) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors';
    const variants = {
        default: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50',
        ghost: 'text-gray-700 hover:bg-gray-100'
    };
    const sizes = {
        default: 'px-4 py-2 text-sm',
        icon: 'p-2'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button