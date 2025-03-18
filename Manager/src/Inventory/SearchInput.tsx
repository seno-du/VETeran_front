import React from 'react';

interface SearchInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ inputValue, setInputValue }) => {
  return (
    <div className="mb-4">
      {/* 입력창 */}
      <label htmlFor="searchInput" className="block text-gray-700 mb-2">
        {inputValue ? '검색 결과' : '검색어를 입력하세요'}
      </label>
      <input
        id="searchInput"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)} // 부모 컴포넌트에서 받은 setInputValue로 처리
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="재고 ID 또는 이름을 입력하세요"
      />
    </div>
  );
};

export default SearchInput;
