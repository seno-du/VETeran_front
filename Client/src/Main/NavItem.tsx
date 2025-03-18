import { ReactNode } from "react";

interface NavItemProps {
    icon: ReactNode;
    label: string;
    active?: boolean;
}

const NavItem = ({ icon, label, active = false }: NavItemProps) => (
    <button className={`flex flex-col items-center gap-1 ${active ? 'text-red-500' : 'text-gray-500'}`}>
        {icon}
        <span className="text-xs">{label}</span>
    </button>
);

export default NavItem;