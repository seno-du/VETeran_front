import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Configure default marker icon
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;


const MapComponent: React.FC = () => {
    const position: [number, number] = [37.50123287544606, 127.02498756247662]; // 강남역 좌표

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-4">오시는 길</h3>
            <div className="rounded mb-4 overflow-hidden h-80">
                <MapContainer
                    center={position}
                    zoom={15}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup>
                            병원 위치
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
                <p>서울 서초구 서초대로77길 41 4층</p>
                <p>
                    2호선 - 강남역 10번 출구 200m <br />
                    9호선, 신분당선 - 신논현역 7번 출구 50m
                </p>
            </div>
        </div>
    );
};

export default MapComponent;