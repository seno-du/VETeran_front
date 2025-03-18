export interface HospitalPet {
    petName?: string;
    petBreed?: string;
    petSpecies?: "강아지" | "고양이";
    userName?: string;
    managerName?: string;
    hospitalStartTime: string; // "HH:mm:ss" 형식
    hospitalMemo: string;
    hospitalRoom: number;      // 입원실 번호
    hospitalStatus: "활성" | "퇴원";
    hospitalNum: number;
    chartNum: number;
  }