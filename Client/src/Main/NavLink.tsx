import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface NavLinkProps {
    href: string;
    children: ReactNode;
    active?: boolean;
}

const NavLink = ({ href, children, active = false }: NavLinkProps) => (
    <Link
        to={href}
        className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
            active ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-700'
        }`}
    >
        {children}
    </Link>
);

export default NavLink;