import { Route, Routes, useLocation } from 'react-router-dom';
import Chart from './chart/Chart.tsx';
import Header from "./Header.tsx";
import DicomViewer from "./PACS/DicomViewer/DicomViewer.tsx";
import Hospital from "./hospital/Hospital.tsx";
import Document from './file/Document.tsx';
import SocialMsg from './SMS/SocialMsg.tsx';
import MedicalSchedule from './Calendar/MedicalSchedule.tsx';
import PatientFind from './patientFind/PatientFind.tsx';
import Upload from './file/Upload.tsx';
import Manager from './SMS/Manager.tsx';
import Footer from './Footer.tsx';
import ManagerCreate from './SMS/ManagerCreate.tsx';
import Abnormaltransaction from './transaction/Abnormaltransaction.tsx';
import PaymentDetail from './transaction/PaymentDetail.tsx';
import ChatRoom from './SMS/ChatRoom.tsx';
import Chat from './SMS/Chat.tsx';
import ChatRoomMember from './SMS/ChatRoomMember.tsx';
import LoginUi from './login/loginUiPage/LoginUi.tsx';
import Cookie from './SMS/Cookie.tsx';
import DogWalkTime from './SMS/DogWalkTime.tsx';
import Reservation from './Reservation/Reservation.tsx';
import FileDetail from './file/FileDetail.tsx';
import FileEdit from './file/FileEdit.tsx';
import Diagnosis from './diagnosis/Diagnosis.tsx';
import ItemOrder from './Item/ItemOrder.tsx';
import ItemSearch from './Item/ItemSearch.tsx';
import ItemList from './Item/ItemList.tsx';
import RequireAuth from './login/loginUiPage/RequireAuth.tsx';
import ItemFace from './Item/ItemFace.tsx';
import Vaccine from './SMS/Vaccine.tsx';
import Paymentcard from './Payment/Paymentcard.tsx';
import PaymentRequest from './Payment/PaymentReqest.tsx';
import Notice from './Notice/Notice.tsx';
import Notice_write from './Notice/Notice_write.tsx';
import Notice_detail from './Notice/Notice_detail.tsx';
import Notice_edit from './Notice/Notice_edit.tsx';




function App() {
  const location = useLocation();
  const isLoginPage = !(location.pathname === '/login');
  // console.log(isLoginPage)

  return (
    <div className="App">

      {isLoginPage ? <Header /> : (<></>)}  {/* ✅ 로그인 페이지가 아닐 때만 헤더 표시 */}

      <Routes>
        {/* ✅ 로그인 페이지 */}
        <Route path='/' element={<RequireAuth><PatientFind /></RequireAuth>} />
        <Route path="/login" element={<LoginUi />} />

        {/* ✅ 보호된 페이지는 RequireAuth로 감싸기 */}
        <Route path="/settings" element={<h1>설정 페이지</h1>} />
        <Route path="*" element={<h1>404: 페이지를 찾을 수 없습니다.</h1>} />
        <Route path="/chart/:chartNum" element={<Chart />} />
        <Route path="/chart/new" element={<Chart />} />


        <Route path="/sms" element={<SocialMsg />} />
        <Route path="/chatroom" element={<ChatRoom />} />
        <Route path="/chat/:chatroomNum" element={<Chat />} />
        <Route path="ChatRoomMember" element={<ChatRoomMember />} />
        <Route path="/chatlist" element={<ChatRoomMember />} />
        <Route path="/vaccine" element={<Vaccine />} />
        <Route path="/cookie" element={<Cookie />} />
        <Route path="/walktime" element={<DogWalkTime />} />
        <Route path="/admin" element={<Manager />} />
        <Route path="/ManagerCreate" element={<ManagerCreate />} />

        <Route path="/PACS/test/:url" element={<DicomViewer />} />
        <Route path="/hospital" element={<Hospital />} />

        {/* ✅ 파일 업로드 */}
        <Route path="/mfile/all" element={<Document />} />
        <Route path="/mfile/upload" element={<Upload />} />
        <Route path="/mfile/detail/:id" element={<FileDetail />} />
        <Route path="/mfile/getAll/:id" element={<FileEdit />} />

        <Route path="/medicalSchedule" element={<MedicalSchedule />} />
        <Route path="/diagnosis" element={<RequireAuth><Diagnosis /></RequireAuth>} />

        <Route path="/inventory/ItemFace" element={<ItemFace />} />
        <Route path="/inventory/order" element={<ItemOrder />} />
        <Route path="/item/list" element={<ItemList />} />
        <Route path="/item/search" element={<ItemSearch />} />

        <Route path="/abnormaltransaction/:page" element={<Abnormaltransaction />} />
        {/* <Route path="/userdetail/:userNum" element={<AbnormaltransactionUser />} /> */}
        <Route path="/paymentdetail/:userNum" element={<PaymentDetail />} />
        <Route path="/reservation" element={<RequireAuth><Reservation /></RequireAuth>} />

        <Route path="/paymentcard" element={<Paymentcard />} />
        <Route path="/paymentreqest" element={<PaymentRequest />} />

        <Route path="/notice/all" element={<Notice />} />
        <Route path={"/notice/notice_write"} element={<Notice_write />} />
        <Route path={"/notice/getAll/:num"} element={<Notice_edit />} />
        <Route path={"/notice/detail/:id"} element={<Notice_detail />} />
      </Routes>
      {isLoginPage ? <Footer /> : (<></>)}
    </div>
  );
}

export default App;