import { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import axios from 'axios';
import { useSelector } from 'react-redux';

interface PageDTO {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface Pet {
  userNum: number;
  petNum: number;
  petGender: string;
  petIsNeutered: string;
  petWeight: number;
  petColor: string;
  userName: string;
  petName: string;
  petSpecies: string;
  petMicrochip: string;
  petBreed: string;
  petImage: string;
  petStatus: string;
  petBirth: number;
}

interface PetList {
  PageDTO: PageDTO;
  list: Pet[];
}

interface userPwd {
  currentPassword: string;
}

const Mypage_petInfo = () => {

  const imagePath = "http://localhost:7124/back/uploads/";

  const [currentPage, setCurrentPage] = useState(1);
  const [step, setStep] = useState(1);
  const [disabledModalOpen, setDisabledModalOpen] = useState(false);
  const [addPetInfoModalOpen, setAddPetInfoModalOpen] = useState(false);
  const [editPetInfoModalOpen, setEditPetInfoModalOpen] = useState(false);
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const token = useSelector((state: any) => state.auth.token);
  
  const [password, setPassword] = useState<userPwd>({
    currentPassword: '',
  });
  const [savedImage, setSavedImage] = useState<File | null>(null);
  const [selectFile, setSelectFile] = useState<File>();

  const [pageDTO, setPageDTO] = useState<PageDTO>({
    currentPage: 0,
    pageSize: 0,
    totalRecords: 0,
    totalPages: 0,
    startIndex: 0,
    endIndex: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [petList, setPetList] = useState<Pet[]>();
  const [oneOfPets, setOneOfPets] = useState<Pet>({
    userNum: 0,
    petNum: 0,
    petGender: '',
    petIsNeutered: '',
    petWeight: 0,
    petColor: '',
    userName: '',
    petName: '',
    petSpecies: '',
    petMicrochip: '',
    petBreed: '',
    petImage: '',
    petStatus: '',
    petBirth: 0,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  const fetchAllPetData = async (page: number) => {
    try {
      const response = await axios.get<PetList>(`http://localhost:7124/back/api/pet/userNum?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPageDTO(response.data.PageDTO);
      setPetList(response.data.list);

    } catch (error) {
      console.log('Error :', error);
    }
  }

  const fetchOnePetData = async (petNum: number) => {
    try {
      const response = await axios.get<Pet>(`http://localhost:7124/back/api/pet/${petNum}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOneOfPets(response.data);

    } catch (error) {
      console.log('Error :', error);
    }
  }

  const handleVerifyPwd = async (petNum: number) => {
    try {
      const response = await axios.post(`http://localhost:7124/back/api/user/verifyPwd`, password,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );
      if (response.status == 200) {
        // alert(response.data);
        handleDisable(petNum)
      }
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data);
      }
      console.log('Error :', error);
    }
  }

  const handleDisable = async (petNum: number) => {
    try {
      const response = await axios.post(`http://localhost:7124/back/api/pet/unsubscription/${petNum}`, password,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data);
      if (response.status == 200) {
        setDisabledModalOpen(false);
        fetchAllPetData(currentPage);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error :', error);
    }
  };

  useEffect(() => {
    fetchAllPetData(currentPage);
  }, [currentPage])

  const handleAddPetInfo = async () => {

    const formData = new FormData();

    formData.append("pet", JSON.stringify(oneOfPets));

    if (selectFile) {
      formData.append("file", selectFile);
    } else {
      formData.append("file", new Blob([], { type: "application/octet-stream" }));
    }

    try {
      const response = await axios.post(`http://localhost:7124/back/api/pet/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert(response.data);
        handleCloseModel();
        window.location.reload();
      }
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data);
      }
      console.log("Error :", error);
    }
  };

  const handleEditPetInfo = async () => {

    const formData = new FormData();

    formData.append("pet", JSON.stringify(oneOfPets));
    if (selectFile) {
      formData.append("file", selectFile);
    } else {
      formData.append("file", new Blob([], { type: "application/octet-stream" }));
    }

    try {
      const response = await axios.post(`http://localhost:7124/back/api/pet/update/${oneOfPets.petNum}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert(response.data);
        handleCloseModel();
        window.location.reload();
      }
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data);
      }
      console.log("Error :", error);
    }
  };


  const handleModelOpen = (number: number, petNum: number): void => {
    if (step > 1)
      setStep(1);
    if (number == 1) {
      setEditPetInfoModalOpen(true);
      fetchOnePetData(petNum);
    } else if (number == 2) {
      setDisabledModalOpen(true);
      fetchOnePetData(petNum);
    } else {
      setAddPetInfoModalOpen(true);
      setOneOfPets({
        ...oneOfPets,
        petGender: '',
        petIsNeutered: '',
        petWeight: 0,
        petColor: '',
        petName: '',
        petSpecies: '',
        petMicrochip: '',
        petBreed: '',
        petImage: '',
        petBirth: 0,
      });
    }
  };

  const handleCloseModel = () => {
    setDisabledModalOpen(false);
    setEditPetInfoModalOpen(false);
    setAddPetInfoModalOpen(false);
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setOneOfPets({ ...oneOfPets, [e.target.name]: e.target.value });
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert("파일 크기가 너무 큽니다! 10MB 이하의 파일을 업로드하세요.");
        return;
      }
      setSelectFile(file);
    }
  };

  function formatDate(timestamp: number) {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  const profileImageUrl =
    savedImage !== null
      ? URL.createObjectURL(savedImage)
      : oneOfPets?.petImage
        ? `http://localhost:8891/back/${oneOfPets.petImage}`
        : "/default-profile.png";

  useEffect(() => {
  }, [profileImageUrl]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-center text-2xl font-bold mb-6">나의 펫 관리</h1>

        <button
          onClick={() => handleModelOpen(3, 0)}
          className="flex items-center text-red-500 font-semibold mt-4 px-6 py-2 rounded-md shadow hover:bg-red-500 hover:text-white">
          <AiOutlinePlus className="text-2xl mr-2" />
          새로운 반려동물을 등록해주세요
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {petList?.map((pet) => (
            <div
              key={pet.petNum}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl cursor-pointer transform transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="w-full flex items-center">
                <div className="w-1/3 flex justify-center">
                  {pet.petImage ? (
                    <img
                      src={`${imagePath}${pet.petImage}`}
                      alt={pet.petName}
                      className="w-[1000px] h-[120px] rounded-lg border-4 border-gray-300 object-cover"
                    />

                  ) : <img
                    src={`https://image.dongascience.com/Photo/2023/07/2a8a3655edb9a187db216dc4adc13b7e.jpg`}
                    className="w-auto h-auto rounded-lg"
                  />}
                </div>

                <div className="w-2/3 ml-4">
                  <div className="font-bold text-lg">{pet.petName}</div>
                  <div className="text-gray-600">
                    {pet.petSpecies}, {pet.petGender}, {pet.petColor}
                  </div>
                  {pet.petWeight != 0 && (
                    <>
                      <div className="text-sm text-gray-400">몸무게 : {pet.petWeight}kg</div>
                    </>
                  )}
                  {pet.petMicrochip != '' && (
                    <>
                      <div className="text-sm text-gray-400">칩 정보: {pet.petMicrochip}</div>
                    </>
                  )}
                  <div className="text-sm text-gray-400">생일: {formatDate(pet.petBirth)}</div>
                </div>
              </div>

              <div className="w-full flex justify-end mt-auto space-x-4">
                <button onClick={() => handleModelOpen(1, pet.petNum)} className="text-red-500 text-xl">
                  수정
                </button>
                <button onClick={() => handleModelOpen(2, pet.petNum)} className="text-red-500 text-xl">
                  삭제
                </button>
              </div>
            </div>
          ))}

        </div>
        <div className="flex justify-center mt-6 items-center space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"}`}>이전
          </button>
          <span className="px-4 py-2 text-lg font-semibold text-red-500">
            {currentPage}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage * pageDTO.pageSize >= pageDTO.totalRecords}
            className={`px-4 py-2 rounded-lg ${currentPage * pageDTO.pageSize >= pageDTO.totalRecords
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"}`} >다음
          </button>
        </div>
        {/* ====================================================================================================================================== */}

        {addPetInfoModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-lg w-full relative">
              <h1 className="text-xl font-semibold text-gray-900 mb-6">반려동물 등록</h1>
              <div className="flex space-x-4 mb-8 flex-wrap items-center">
                {['이름', '품종', '성별', '연령', '기타'].map((label, index) => (
                  <div
                    key={index}
                    className={`px-6 py-2 rounded-full text-sm font-semibold ${step === index + 1 ? 'bg-red-500 text-white' : 'border border-gray-400 text-gray-400'}`}
                  >
                    {label}
                  </div>
                ))}
              </div>
              {step === 1 && (
                <div className="w-full max-w-md">
                  <p className="text-center text-lg mb-4">반려동물의 이름이 무엇입니까? (필수)</p>
                  <input
                    type="text"
                    name="petName"
                    onChange={handleChange}
                    value={oneOfPets.petName}
                    placeholder="반려동물의 이름을 입력하세요"
                    className="w-full border border-black rounded-md p-3 focus:outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handleNext()}
                  />
                  <button
                    onClick={handleNext}
                    className={`mt-8 px-16 py-3 rounded-lg text-white font-bold bg-gray-400`}
                    disabled={oneOfPets.petName.trim() === ""}
                  >
                    다음
                  </button>
                </div>
              )}
              {step === 2 && (
                <div className="w-full max-w-md">
                  <p className="text-center text-lg mb-4">반려동물의 종류와 품종을 알려주세요 (필수)</p>
                  <select
                    name="petSpecies"
                    onChange={handleChange}
                    value={oneOfPets.petSpecies}
                    className="w-full border border-black rounded-md p-3 mb-3 focus:outline-none"
                  >
                    <option value="">종류 선택</option>
                    <option value="강아지">강아지</option>
                    <option value="고양이">고양이</option>
                  </select>
                  <input
                    type="text"
                    name="petBreed"
                    onChange={handleChange}
                    value={oneOfPets.petBreed}
                    placeholder="품종을 입력하세요"
                    className="w-full border border-black rounded-md p-3 focus:outline-none mb-4"
                  />
                  <input
                    type="text"
                    name="petColor"
                    onChange={handleChange}
                    value={oneOfPets.petColor}
                    placeholder="털 색깔을 입력하세요"
                    className="w-full border border-black rounded-md p-3 focus:outline-none mb-4"
                  />
                  <button
                    onClick={handleNext}
                    className={`mt-8 px-16 py-3 rounded-lg text-white font-bold bg-gray-400`}
                    disabled={oneOfPets.petSpecies.trim() === "" || oneOfPets.petBreed.trim() === "" || oneOfPets.petColor.trim() === ""}
                  >
                    다음
                  </button>
                </div>
              )}
              {step === 3 && (
                <div className="w-full max-w-md">
                  <p className="text-center text-lg mb-4">성별은 무엇인가요? (필수)</p>
                  <select
                    name="petGender"
                    value={oneOfPets.petGender}
                    onChange={handleChange}
                    className="w-full border border-black rounded-md p-3 mb-3 focus:outline-none"
                  >
                    <option value="">선택</option>
                    <option value="수컷">수컷</option>
                    <option value="암컷">암컷</option>
                  </select>
                  <select
                    name="petIsNeutered"
                    onChange={handleChange}
                    value={oneOfPets.petIsNeutered}
                    className="w-full border border-black rounded-md p-3 mb-3 focus:outline-none"
                  >
                    <option value="">중성화 여부</option>
                    <option value="예">예</option>
                    <option value="아니요">아니오</option>
                    <option value="아니요">모름</option>
                  </select>
                  <button
                    onClick={handleNext}
                    className={`mt-8 px-16 py-3 rounded-lg text-white font-bold bg-gray-400`}
                    disabled={oneOfPets.petGender.trim() === "" || oneOfPets.petIsNeutered.trim() === ""}
                  >다음
                  </button>
                </div>
              )}
              {step === 4 && (
                <div className="w-full max-w-md">
                  <p className="text-center text-lg mb-4">반려동물의 생일을 알려주세요 (필수)</p>
                  <input
                    type="date"
                    id="dob"
                    name="petBirth"
                    onChange={handleChange}
                    value={oneOfPets.petBirth}
                    placeholder="생일을 입력하세요."
                    className="w-full border border-black rounded-md p-3 focus:outline-none mb-4"
                  />
                  <button
                    onClick={handleNext}
                    className={`mt-8 px-16 py-3 rounded-lg text-white font-bold bg-gray-400`}
                    disabled={oneOfPets.petBirth == 0}
                  >
                    다음
                  </button>
                </div>
              )}
              {step === 5 && (
                <div className="w-full max-w-md">
                  <p className="text-center text-lg mb-4">특이사항을 작성해주세요 (선택)</p>
                  {oneOfPets.petWeight == 0 ? (
                    <input
                      type="number"
                      name="petWeight"
                      onChange={handleChange}
                      placeholder="몸무게를 입력하세요 (kg)"
                      className="w-full border border-black rounded-md p-3 focus:outline-none mb-4"
                    />
                  ) : (
                    <input
                      type="number"
                      name="petWeight"
                      value={oneOfPets.petWeight}
                      onChange={handleChange}
                      placeholder="몸무게를 입력하세요 (kg)"
                      className="w-full border border-black rounded-md p-3 focus:outline-none mb-4"
                    />
                  )}
                  <input
                    type="text"
                    name="petMicrochip"
                    onChange={handleChange}
                    value={oneOfPets.petMicrochip}
                    placeholder="칩 정보를 입력하세요"
                    className="w-full border border-black rounded-md p-3 focus:outline-none mb-4"
                  />
                  <label className="block font-semibold">펫 이미지 등록</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full border border-gray-300 p-2 rounded mt-1"
                    onChange={handleFileChange}
                  />
                  <button
                    onClick={handleNext}
                    className={`mt-8 px-16 py-3 rounded-lg text-white font-bold bg-gray-400`}
                  >
                    다음
                  </button>
                </div>
              )}
              {step === 6 && (
                <>
                  <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-gray-800">
                    <div className="grid grid-cols-2 gap-y-4 text-left">
                      <p className="font-semibold text-gray-600">품종:</p>
                      <p>{oneOfPets.petSpecies} ({oneOfPets.petBreed}, {oneOfPets.petColor})</p>

                      <p className="font-semibold text-gray-600">성별:</p>
                      <p>{oneOfPets.petGender} (중성화: {oneOfPets.petIsNeutered})</p>

                      <p className="font-semibold text-gray-600">생년월일:</p>
                      <p>{formatDate(oneOfPets.petBirth)}</p>
                      {oneOfPets.petWeight != 0 && (
                        <>
                          <p className="font-semibold text-gray-600">몸무게:</p>
                          <p>{oneOfPets.petWeight}kg</p>
                        </>
                      )}
                      {oneOfPets.petMicrochip && (
                        <>
                          <p className="font-semibold text-gray-600">MicroChip 번호:</p>
                          <p>{oneOfPets.petMicrochip}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 flex justify-around">
                    <button onClick={() => handleAddPetInfo()} className="bg-red-500 text-white px-6 py-2 rounded-md">등록하기</button>
                  </div>
                </>
              )}
              <button onClick={handlePrev} className="absolute top-2 left-2 text-xl text-gray-500 hover:text-red-500 p-2">
                이전
              </button>
              <button onClick={handleCloseModel} className="absolute top-2 right-2 text-xl text-gray-500 hover:text-red-500 p-2">
                닫기
              </button>
            </div>
          </div>
        )}

        {editPetInfoModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full relative">
              <h1 className="text-xl font-semibold text-gray-900 mb-6"><span>{oneOfPets?.petName}</span> 정보 수정</h1>

              <div className="flex space-x-4 mb-8 justify-center items-center">
                {['성별', '기타'].map((label, index) => (
                  <div
                    key={index}
                    className={`px-6 py-2 text-center rounded-full text-sm font-semibold ${step === index + 1 ? 'bg-red-500 text-white' : 'border border-gray-400 text-gray-400'}`}
                  >
                    {label}
                  </div>

                ))}
              </div>
              {step === 1 && (
                <div className="w-full max-w-md">
                  <p className="text-center text-lg mb-4">성별을 수정해주세요</p>
                  <select
                    name="petGender"
                    onChange={handleChange}
                    className="w-full border border-black rounded-md p-3 mb-3 focus:outline-none"
                  >
                    <option value="">선택</option>
                    <option value="수컷">수컷</option>
                    <option value="암컷">암컷</option>
                  </select>
                  <select
                    name="petIsNeutered"
                    onChange={handleChange}
                    className="w-full border border-black rounded-md p-3 mb-3 focus:outline-none"
                  >
                    <option value="">중성화 여부</option>
                    <option value="예">예</option>
                    <option value="아니요">아니오</option>
                    <option value="아니요">모름</option>
                  </select>
                  <button
                    onClick={handleNext}
                    className={`mt-8 px-16 py-3 rounded-lg text-white font-bold bg-gray-400`}
                  // disabled={oneOfPets.petGender.trim() == "" || oneOfPets.petIsNeutered.trim() == ""}
                  >
                    다음
                  </button>
                </div>
              )}
              {step === 2 && (
                <div className="w-full max-w-md">
                  <p className="text-center text-lg mb-4">특이사항을 작성해주세요 (선택)</p>
                  {oneOfPets.petWeight == 0 ? (
                    <input
                      type="number"
                      name="petWeight"
                      onChange={handleChange}
                      placeholder="몸무게를 입력하세요 (kg)"
                      className="w-full border border-black rounded-md p-3 focus:outline-none mb-4"
                    />
                  ) : (
                    <input
                      type="number"
                      name="petWeight"
                      value={oneOfPets.petWeight}
                      onChange={handleChange}
                      placeholder="몸무게를 입력하세요 (kg)"
                      className="w-full border border-black rounded-md p-3 focus:outline-none mb-4"
                    />
                  )}
                  <label className="block font-semibold">펫 이미지 등록</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full border border-gray-300 p-2 rounded mt-1"
                    onChange={handleFileChange}
                  />
                  <button
                    onClick={handleNext}
                    className={`mt-8 px-16 py-3 rounded-lg text-white font-bold bg-gray-400`}
                  >
                    다음
                  </button>
                </div>
              )}
              {step === 3 && (
                <>
                  <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-gray-800">
                    <div className="grid grid-cols-2 gap-y-4 text-left">
                      <p className="font-semibold text-gray-600">품종:</p>
                      <p>{oneOfPets.petSpecies} ({oneOfPets.petBreed}, {oneOfPets.petColor})</p>

                      <p className="font-semibold text-gray-600">성별:</p>
                      <p>{oneOfPets.petGender.slice(-2,)} (중성화: {oneOfPets.petGender.slice(0, 3) == "중성화" ? "예" : "아니요"})</p>

                      <p className="font-semibold text-gray-600">생년월일:</p>
                      <p>{formatDate(oneOfPets.petBirth)}</p>

                      {oneOfPets.petWeight != 0 && (
                        <>
                          <p className="font-semibold text-gray-600">몸무게:</p>
                          <p>{oneOfPets.petWeight}kg</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 flex justify-around">
                    <button onClick={() => handleEditPetInfo()} className="bg-red-500 text-white px-6 py-2 rounded-md">수정하기</button>
                  </div> </>
              )}
              <button onClick={handlePrev} className="absolute top-2 left-2 text-xl text-gray-500 hover:text-red-500 p-2">
                이전
              </button>
              <button onClick={handleCloseModel} className="absolute top-2 right-2 text-xl text-gray-500 hover:text-red-500 p-2">
                닫기
              </button>
            </div>
          </div>
        )}
        {
          disabledModalOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full relative">
                <h1 className="text-xl font-semibold text-gray-900 mb-6">{oneOfPets?.petName} 정보 삭제</h1>
                {step === 1 && (
                  <div className="w-full max-w-md">
                    <p className="text-center text-lg mb-4">
                      <p> 펫 정보를 삭제하시면, </p>
                      <p> 예약 내역 및 진료 내역을 확인하실 수 없습니다.</p>
                      <p>정말로 삭제하시겠습니까?</p>
                    </p>
                    <button
                      onClick={handleNext}
                      className="mt-8 px-8 py-2 rounded-lg text-white font-bold bg-red-500 mr-4"
                    >
                      다음
                    </button>
                  </div>
                )}
                {step === 2 && (
                  <div className="w-full max-w-md">
                    <p className="text-center text-lg mb-4">비밀번호를 입력해주세요</p>
                    <input
                      type="password"
                      name="currentPassword"
                      onChange={handleChange}
                      placeholder="기존 비밀번호"
                      onKeyDown={(e) => e.key === "Enter" && handleVerifyPwd(oneOfPets.petNum)}
                      className="w-full border border-black rounded-md p-3 focus:outline-none"
                    />
                    <button
                      onClick={() => handleVerifyPwd(oneOfPets.petNum)}
                      className="mt-8 px-8 py-2 rounded-lg text-white font-bold bg-red-500 mr-4"
                    >
                      다음
                    </button>
                  </div>
                )}
                <button
                  onClick={handleCloseModel}
                  className="absolute top-2 right-2 text-xl text-gray-500 hover:text-red-500 p-2"
                >
                  닫기
                </button>
              </div>
            </div>
          )
        }

      </div >
    </div >
  );
};

export default Mypage_petInfo;
