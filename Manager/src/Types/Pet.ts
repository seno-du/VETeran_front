export interface Pet {
    petNum: number;
    userNum: number;
    userName: string;
    petSpecies: "강아지" | "고양이";
    petColor: string;
    petName: string;
    petBreed: string;
    petGender: "암컷" | "수컷" | "중성화암컷" | "중성화수컷";
    petBirth: string; 
    petMicrochip?: string;
    petWeight: number;
    petStatus: "활성화" | "비활성화";
    petImage?: string;
    chartNum?: number; // 추가된 부분: 선택적 속성
    managerNum: string;
}