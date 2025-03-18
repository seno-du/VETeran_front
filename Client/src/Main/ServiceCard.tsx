interface ServiceCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const ServiceCard = ({ icon, title, description }: ServiceCardProps) => (
    <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="mr-4 text-red-500">{icon}</div>
        <div>
            <h4 className="font-medium mb-1">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </div>
);

export default ServiceCard;