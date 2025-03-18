import { ReactNode } from "react";

interface MobileNavLinkProps {
    href: string;
    children: ReactNode;
    active?: boolean;
}

const MobileNavLink = ({ href, children, active = false }: MobileNavLinkProps) => (
    <a                         // <-- 여기 <a> 태그 추가
        href={href}
        className={`block px-2 py-2 text-base font-medium ${
            active ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'
        }`}
    >
        {children}
    </a>
);

export default MobileNavLink;