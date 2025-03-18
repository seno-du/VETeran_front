import { create } from 'zustand'
import {Pet} from "../Types/Pet.ts";
import {History} from "../Types/ChartHistory.ts";

interface FollowUp {
    date : Date | null;
    content : string | null;
    veterinarian : string | null;
}

// chart 진료기록
interface Historyitem{
    chartNum : number;
    chartDate : string;
    managerName : string;
    chartNote : string;
    totalAmount : number;
    plan: any[];
}

interface PetChartInfo extends Pet{
    chartNum : number | null;
    subjective : string | null;
    assessment : string | null;
    followup : FollowUp | null;
    managerNum : number | null;
    hospitalNum : number | null;

    hospitalStatus: string;
    setHospitalStatus: (status: string) => void;

    // Hitory 관련 상태
    historyData : Historyitem[];

     // planItems 관련 속성 추가
     planItems: PlanItem[];
     setPlanItems: (items: PlanItem[]) => void;

     timeMap: Record<number, string>;
     setTimeMap: (key: number, time: string) => void;

    setHistoryData: (historyData: Historyitem[]) => void;
    setPetNum: (petNum: number) => void;
    setUserName: (userName: string) => void;
    setPetSpecies: (petSpecies: "강아지" | "고양이") => void;
    setPetColor: (petColor: string) => void;
    setPetName: (petName: string) => void;
    setPetBreed: (petBreed: string) => void;
    setPetGender: (petGender: "암컷" | "수컷" | "중성화암컷" | "중성화수컷") => void;
    setPetBirth: (petBirth: string) => void;
    setPetMicrochip: (petMicrochip: string) => void;
    setPetWeight: (petWeight: number) => void;
    setPetStatus: (petStatus: "활성화" | "비활성화") => void;
    setPetImage: (petImage: string) => void;
    setSubjective: (subjective: string) => void;
    setAssessment: (assessment: string) => void;
    setFollowup: (followup: FollowUp) => void;
    setChartNum : (chartNum : number) => void;

    setHospitalNum: (hospitalNum: number | null) => void;

}

export interface Location {
  itemId: string;
  locationStock: number;
  itemName: string;
  itemCategory: string;
  itemState: string;
  itemPrice: number;
  remainingStock: number;
}

export interface PlanItem extends Location {
    historyQuantity: number;        // 선택한 수량 (예: 1)
    transactionType: "입고" | "출고"; // 거래 타입
    primaryNumber: number;          // chart, lab, vaccine의 pk 값
    planCategory: number;           // 1: chart, 2: lab, 3: vaccine
  }

interface ChartHistory {
    history : History[];
    selectedHistory: number | null;
    setSelectedHistory: (selectedDate: number | null) => void;
    setHistory : (history : History[]) => void;
}

export const useChartHistoryStore = create<ChartHistory>()((set) => ({
    history : [],
    selectedHistory: null,
    setHistory : (history: History[]) => set({ history: history }),
    setSelectedHistory: (selectedHistory: number | null) => set({ selectedHistory: selectedHistory }),
}))

export const useChartStore = create<PetChartInfo>()((set) => ({
    userNum:0,
    chartNum : 0,
    petNum: 0,
    userName: "",
    petSpecies: "강아지",
    petColor: "",
    petName: "",
    petBreed: "",
    petGender: "암컷",
    petBirth: "",
    petMicrochip: "",
    petWeight: 0,
    petStatus: "활성화",
    petImage: "",
    managerNum: 0,
    subjective : null,
    assessment : null,
    followup : null,
    hospitalNum : 0,

    hospitalStatus: "활성",
    setHospitalStatus: (status: string) => set({ hospitalStatus: status }),

    // History 상태
    historyData: [],
    setHistoryData: (data: Historyitem[]) => set({ historyData: data }),

    // planItems 상태 추가 (PlanItem 타입을 사용)
    planItems: [] as PlanItem[],
    setPlanItems: (items: PlanItem[]) => set({ planItems: items }),

    timeMap: JSON.parse(localStorage.getItem("hospitalTimeMap") || "{}"),
    setTimeMap: (key: number, time: string) => set((state) => ({timeMap: { ...state.timeMap, [key]: time }})),
    setPetNum: (petNum: number) => set({ petNum: petNum }),
    setUserName: (userName: string) => set({ userName: userName }),
    setPetSpecies: (petSpecies: "강아지" | "고양이") => set({ petSpecies: petSpecies }),
    setPetColor: (petColor: string) => set({ petColor: petColor }),
    setPetName: (petName: string) => set({ petName: petName }),
    setPetBreed: (petBreed: string) => set({ petBreed: petBreed }),
    setPetGender: (petGender: "암컷" | "수컷" | "중성화암컷" | "중성화수컷") => set({ petGender: petGender }),
    setPetBirth: (petBirth: string) => set({ petBirth: petBirth }),
    setPetMicrochip: (petMicrochip: string) => set({ petMicrochip: petMicrochip }),
    setPetWeight: (petWeight: number) => set({ petWeight: petWeight }),
    setPetStatus: (petStatus: "활성화" | "비활성화") => set({ petStatus: petStatus }),
    setPetImage: (petImage: string) => set({ petImage: petImage }),
    setSubjective: (subjective: string) => set({ subjective: subjective }),
    setAssessment: (assessment: string) => set({ assessment: assessment }),
    setFollowup: (followup: FollowUp) => set({ followup: followup }),
    setChartNum: (chartNum : number) => set({chartNum : chartNum}),

    setHospitalNum : (hospitalNum : number | null) => set({hospitalNum : hospitalNum})
}));