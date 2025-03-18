import React from 'react';

const Menu: React.FC = () => {
  return (
    <div className="flex justify-center bg-gray-800 p-4 rounded-lg shadow-lg">
      {['고객관리', '포인트카드', 'ID카드', 'CID기록', '보호자교육서', '진료기록', '출력양식', '병원인테리어', '메시지'].map((item, index) => (
        <button key={index} className="bg-gray-700 text-white px-4 py-2 mx-2 rounded-md hover:bg-gray-600">
          {item}
        </button>
      ))}
    </div>
  );
};

export default Menu;
