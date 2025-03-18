import { useState } from 'react';

const DogWalkTime = () => {
  const dogBreeds = {
    "대형견 (리트리버, 골든 리트리버, 그레이트 데인 등)": { minTime: 40, maxTime: 120 },
    "중형견 (불독, 비글, 닥스훈트 등)": { minTime: 40, maxTime: 60 },
    "소형견 (치와와, 포메라니안, 요크셔 테리어 등)": { minTime: 15, maxTime: 30 }
  };

  const [selectedBreed, setSelectedBreed] = useState('');
  const [walkTime, setWalkTime] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleBreedChange = (event) => {
    setSelectedBreed(event.target.value);
    setWalkTime('');
    setMessage('');
    setErrorMessage('');
  };

  const handleWalkTimeChange = (event) => {
    setWalkTime(event.target.value);
    setErrorMessage('');
  };

  const handleCheckWalkTime = () => {
    if (!selectedBreed || !walkTime) {
      setMessage('');
      setErrorMessage('강아지 종과 산책 시간을 모두 선택해주세요.');
      return;
    }

    if (isNaN(walkTime) || walkTime <= 0) {
      setMessage('');
      setErrorMessage('산책 시간은 양의 숫자여야 합니다.');
      return;
    }

    const breedInfo = dogBreeds[selectedBreed];
    const walkTimeNum = parseInt(walkTime);

    if (walkTimeNum < breedInfo.minTime) {
      setMessage('');
      setErrorMessage(`산책 시간이 부족합니다. ${selectedBreed}는 최소 ${breedInfo.minTime}분이 필요합니다.`);
    } else if (walkTimeNum > breedInfo.maxTime) {
      setMessage('');
      setErrorMessage(`산책 시간이 너무 깁니다. ${selectedBreed}는 최대 ${breedInfo.maxTime}분까지 적절합니다.`);
    } else {
      setErrorMessage('');
      setMessage(`산책 시간이 적절합니다. ${selectedBreed}는 ${walkTimeNum}분 산책이 적합합니다.`);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        강아지 산책 시간 체크 🐶
      </h1>

      <div className="mb-5">
        <label className="block text-lg font-medium text-gray-700">강아지 종 선택</label>
        <select
          value={selectedBreed}
          onChange={handleBreedChange}
          className="mt-2 block w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">선택하세요</option>
          {Object.keys(dogBreeds).map((breed) => (
            <option key={breed} value={breed}>{breed}</option>
          ))}
        </select>
      </div>

      {selectedBreed && (
        <div className="mb-5 p-3 bg-gray-100 rounded-lg border border-gray-300">
          <p className="text-gray-700 font-medium">⏳ 적정 산책 시간: {dogBreeds[selectedBreed].minTime}분 ~ {dogBreeds[selectedBreed].maxTime}분</p>
        </div>
      )}

      <div className="mb-5">
        <label className="block text-lg font-medium text-gray-700">산책 시간 (분)</label>
        <input
          type="number"
          value={walkTime}
          onChange={handleWalkTimeChange}
          className="mt-2 block w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          min="0"
          placeholder="산책 시간을 입력하세요"
        />
      </div>

      <div className="text-center">
        <button
          onClick={handleCheckWalkTime}
          className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
        >
          🚶‍♂️ 산책 시간 확인
        </button>
      </div>

      {message && (
        <p className="mt-5 text-green-600 text-center font-medium">{message}</p>
      )}

      {errorMessage && (
        <p className="mt-5 text-red-500 text-center font-medium">{errorMessage}</p>
      )}
    </div>
  );
};

export default DogWalkTime;
