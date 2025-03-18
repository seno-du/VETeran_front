import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Main/Home.tsx";
import MobileHeader from "./Header/MobileHeader.tsx";
import DesktopHeader from "./Header/DesktopHeader.tsx";
import Footer from "./Footer.tsx";
import LoginForm from "./Login/LoginForm.tsx";
import IdSerch from "./Login/IdSerch.tsx";
import PasswordReset from "./Login/PasswordReset.tsx";
import LoginRequired from "./Security/LoginRequired.tsx";
import Mypage_edit from "./mypage/MyInfo/Mypage_edit.tsx";
import Mypage_medical_history from "./mypage/Log/Mypage_medical_history.tsx";
import Mypage_reservation from "./mypage/Log/Mypage_reservation.tsx";
import Mypage_main from "./mypage/Mypage_main.tsx";
import Chatbot from "./Chatbot/Chatbot.tsx";
import Mypage_petInfo from "./mypage/Pet/Mypage_petInfo.tsx";
import MedicalStaff from "./MedicalStaff/MedicalStaff.tsx";
import ConsultationReservation from "./MedicalStaff/ConsultationReservation.tsx";
import Agree from "./SignUp/Agree.tsx";
import SignUp from "./SignUp/SignUp.tsx";
import SignUpMethod from "./SignUp/SignUpMethod.tsx";
import Mypage_view from "./mypage/MyInfo/Mypage_view.tsx";
import KakaoLogin from "./kakao/KakaoLogin.tsx";
import NaverLogin from "./naver/NaverLogin.tsx";
import Hour from "./MedicalStaff/Hour.tsx";
import Information from "./MedicalStaff/Information.tsx";
import GoogleLogin from "./google/GoogleLogin.tsx";
import Notice from "./notice/Notice.tsx";
import Notice_write from "./notice/Notice_Write.tsx";
import Notice_detail from "./notice/Notice_detail.tsx";
import NaverLoginCallback from "./naver/NaverLoginCallback.tsx";
import GoogleCallback from "./google/GoogleCallback.tsx";
import Notice_edit from "./notice/Notice_edit.tsx";
import Mypage_security from "./mypage/MyInfo/Mypage_security.tsx";
import Reservation_Home from "./Reservation/Reservation_Home.tsx";
import DepartmentSelection from "./Reservation/DepartmentSelection.tsx";

import DateTimeSelection from "./Reservation/DateTimeSelection.tsx";
import ReservationConfirmation from "./Reservation/ReservationConfirmation.tsx";
import ReservationCompleted from "./Reservation/ReservationCompleted.tsx";
import DepartmentFind from "./Reservation/DepartmentFind.tsx";
import AnimalSelection from "./Reservation/AnimalSelection.tsx";
import DoctorSelection from "./Reservation/DoctorSelection.tsx";
import UpboardList from "./review/UpboardList.tsx";
import UpboardForm from "./review/UpboardForm.tsx";
import UpboardDetail from "./review/UpboardDetail.tsx";
import TossPay from "./tosspay/TossPay.tsx";
import Mypage_chat_history from "./mypage/Log/Mypage_chat_history.tsx";
import UpboardEdit from "./review/UpboardEdit.tsx";
import PasswordResetPage from "./Login/PasswordResetPage.tsx";



function App() {

  return (
    <div id={"app"}>
      <BrowserRouter>
        <MobileHeader />
        <DesktopHeader />
        <Routes>
          {/* ! 규칙 !  */}
          {/* path : / 폴더이름(파일이름 X) / 알아서 입니다.  */}
          {/* 잘 모르겠다 :    /폴더명/파일명  << 이렇게 하시면 됩니다. */}

          <Route path={"/"} element={<Home />} />

          {/* Login */}
          <Route path={"/login/form"} element={<LoginForm />} />
          <Route path={"/signup"} element={<SignUp />} />
          <Route path={"/signup/signupmethod"} element={<SignUpMethod />} />
          <Route path={"/login/idserch"} element={<IdSerch />} />
          <Route path={"/login/passwordreset"} element={<PasswordReset />} />
          <Route path={"/login/passwordresetPage"} element={<PasswordResetPage />} />

          {/* Mypage */}
          <Route path={"/mypage/main"} element={<Mypage_main />} />
          <Route path={"/mypage/view"} element={<Mypage_view />} />
          <Route path={"/mypage/edit"} element={<Mypage_edit />} />
          <Route path={"/mypage/security"} element={<Mypage_security />} />
          <Route path={"/mypage/medicalHistory"} element={<Mypage_medical_history />} />
          <Route path={"/mypage/reservation"} element={<Mypage_reservation />} />
          <Route path={"/mypage/petInfo"} element={<Mypage_petInfo />} />
          <Route path={"/mypage/chatHistory"} element={<Mypage_chat_history />} />


          {/* Chatbot */}
          <Route path={"/chatbot"} element={<Chatbot />} />

          {/* 진료안내 */}
          <Route path={"/information"} element={<Information />} />  {/* 오시는길 */}
          <Route path={"/hour"} element={<Hour />} />  {/* 진료시간 */}
          <Route path={"/doctors"} element={<MedicalStaff />} />  {/* 의료진 소개 */}
          <Route path={"/consultation"} element={<ConsultationReservation />} />  {/* 상담예약 */}

          {/* 예약 */}
          <Route path={"/reservation"} element={<Reservation_Home />} />
          <Route path={"/department_find"} element={<DepartmentFind />}/>
          <Route path={"/department_selection"} element={<DepartmentSelection />} />
          <Route path={"/animal_selection"} element={<AnimalSelection />} />
          <Route path={"/select_doctor"} element={<DoctorSelection />} />
          <Route path={"/select_datetime"} element={<DateTimeSelection />} />
          <Route path={"/confirm_reservation"} element={<ReservationConfirmation />} />
          <Route path={"/reservation_completed"} element={<ReservationCompleted />} />

          {/* <Route path={"/reservation/:token"} element={<PaymentPopupOpen />} /> */}

          {/* 사용후기 */}
          <Route path={"/review/UpboardList"} element={< UpboardList />} />
          <Route path={"/review/UpboardList/UpboardForm"} element={< UpboardForm />} />
          <Route path={"/review/UpboardList/:num"} element={< UpboardDetail />} />
          <Route path={"/review/UpboardList/UpboardEdit/:num"} element={< UpboardEdit />} />

          {/* 공지사항 */}
          <Route path={"/notice/all"} element={<Notice />} />
          <Route path="/notice/search/title" element={<Notice />} />
          <Route path="/notice/search/content" element={<Notice />} />
          <Route path="/notice/search/date" element={<Notice />} />
          <Route path={"/notice/notice_write"} element={<Notice_write />} />
          <Route path={"/notice/getAll/:num"} element={<Notice_edit />} />
          <Route path={"/notice/detail/:num"} element={<Notice_detail />} />


          {/* 약관동의 이거 앱에서 뺄겁니다. 나중에 클릭했을때 뜨도록만 해주세요. */}
          <Route path={"/signup/agree"} element={<Agree />} />

          <Route path={"/login/kakao"} element={<KakaoLogin />} />

          <Route path={"/login/naver"} element={<NaverLogin />} />
          <Route path={"/login/naver/callback"} element={<NaverLoginCallback />} />

          <Route path={"/login/google"} element={<GoogleLogin />} />
          <Route path={"/login/google/callback"} element={<GoogleCallback />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
