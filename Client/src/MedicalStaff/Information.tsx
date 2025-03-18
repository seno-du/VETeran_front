import React from 'react'
import { Link } from 'react-router-dom'
import MapComponent from '../Main/MapComponent'

const Information: React.FC = () => {
    return (
        <>
            <div className="flex justify-center gap-8 bg-white py-6 shadow">
                <Link
                    to="/information"
                    className={`px-4 py-2 border-none cursor-pointer text-xl transition-all duration-200 ${location.pathname === '/information' ? 'text-blue-600 font-bold' : 'text-black hover:text-blue-600'
                        }`}
                >
                    오시는길
                </Link>
                <Link
                    to="/hour"
                    className={`px-4 py-2 border-none cursor-pointer text-xl transition-all duration-200 ${location.pathname === '/hour' ? 'text-blue-600 font-bold' : 'text-black hover:text-blue-600'
                        }`}
                >
                    특화진료
                </Link>
                <Link
                    to="/doctors"
                    className={`px-4 py-2 border-none cursor-pointer text-xl transition-all duration-200 ${location.pathname === '/doctors' ? 'text-blue-600 font-bold' : 'text-black hover:text-blue-600'
                        }`}
                >
                    의료진 소개
                </Link>
                <Link
                    to="/consultation"
                    className={`px-4 py-2 border-none cursor-pointer text-xl transition-all duration-200 ${location.pathname === '/consultation' ? 'text-blue-600 font-bold' : 'text-black hover:text-blue-600'
                        }`}
                >
                    상담예약
                </Link>
            </div>
            <div className='mb-8'>
                <MapComponent />
            </div>
        </>
    )
}

export default Information