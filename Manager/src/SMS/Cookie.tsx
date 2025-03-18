import React, { useState } from "react";
import { motion } from "framer-motion";

const categories = {
  일반: [
    "오늘은 기분이 맑은 하늘처럼 상쾌할 거예요! ☀️",
    "사소한 일에도 웃음을 찾을 수 있는 하루가 될 거예요. 😊",
    "행운의 숫자는 7! 오늘은 뭔가 특별한 일이 생길지도 몰라요. 🔢",
    "마음이 가는 대로 행동하면 좋은 결과가 있을 거예요. 🍀",
    "새로운 도전이 기대되는 하루예요. 용기를 내보세요! 🏆",
    "예상치 못한 기회가 찾아올 가능성이 높아요! 🚪",
    "우연한 만남이 인생의 전환점이 될 수 있어요. 💫",
    "소소한 기쁨이 큰 행복으로 이어질 거예요! 🎈",
    "오늘 하루를 즐겁게 보내면 좋은 일이 따라올 거예요. 🎶",
    "긍정적인 마인드가 행운을 불러올 거예요! ✨",
  ],
  사랑운: [
    "오늘은 사랑의 기운이 가득한 날이에요! 💖",
    "연인과의 다툼이 있었다면 화해할 좋은 기회예요. 🤝",
    "싱글이라면 새로운 인연을 만날 가능성이 커요! 💕",
    "기존의 관계가 더욱 깊어질 거예요. 🌹",
    "운명적인 만남이 가까워지고 있어요! 💫",
    "오늘은 상대방에게 솔직한 감정을 표현하는 것이 좋아요. 💌",
    "연애운이 상승 중! 기대해도 좋아요. 😘",
    "좋은 사람과의 대화가 당신을 행복하게 만들어 줄 거예요. 🥰",
    "뜻밖의 장소에서 특별한 사람이 나타날지도 몰라요! 🔮",
    "좋은 인연은 가까운 곳에서 기다리고 있어요. 🚪",
  ],
  재물운: [
    "오늘은 재물운이 좋아요! 좋은 기회가 찾아올지도 몰라요. 💰",
    "계획적인 소비가 행운을 가져올 거예요. 🛍️",
    "생각지도 못한 수입이 들어올 가능성이 있어요! 🎉",
    "작은 투자라도 신중하게 하면 좋은 결과를 얻을 수 있어요. 📈",
    "자신을 위한 작은 보상을 해보는 것도 좋은 날이에요. 🎁",
    "무리한 지출을 줄이면 더 큰 기회를 잡을 수 있어요! 🏦",
    "금전적인 고민이 해결될 조짐이 보여요. 💡",
    "오늘은 재테크 공부를 해보는 것도 좋아요! 📖",
    "예상치 못한 선물이나 혜택을 받을 수도 있어요. 🎊",
    "돈을 모으는 것도 좋지만, 적절한 소비도 필요해요. ⚖️",
  ],
  건강운: [
    "오늘은 컨디션이 좋아질 거예요! 활기찬 하루를 보내세요. 💪",
    "규칙적인 운동이 건강을 지키는 비결이에요. 🏃",
    "스트레스를 받지 않도록 마음을 편하게 가져보세요. 🧘",
    "몸을 따뜻하게 하면 피로가 풀릴 거예요. ☕",
    "수분 섭취를 충분히 하면 건강 유지에 도움이 될 거예요. 💧",
    "가벼운 스트레칭이 몸과 마음을 개운하게 해줄 거예요! 🤸",
    "오늘은 건강한 식사를 챙기는 것이 중요해요. 🥗",
    "바쁜 하루 속에서도 충분한 휴식을 취하는 것이 좋아요. 💤",
    "햇볕을 쬐면 기분이 좋아지고 면역력도 올라갈 거예요! ☀️",
    "심호흡을 하면서 여유를 가지면 건강운이 좋아질 거예요. 🌿",
  ],
  직장운: [
    "오늘은 직장에서 좋은 일이 생길 가능성이 커요! 🚀",
    "업무에서 인정받을 기회가 찾아올 거예요. 🏆",
    "새로운 프로젝트를 맡으면 기대 이상의 결과가 나올지도 몰라요! 📊",
    "협업이 중요한 하루예요! 동료와 힘을 합쳐보세요. 🤝",
    "상사의 신뢰를 얻을 좋은 기회가 있을 거예요. 👏",
    "오늘은 집중력이 상승하는 날! 중요한 일을 처리하기에 좋아요. 🎯",
    "적극적인 태도가 행운을 불러올 거예요! 🌟",
    "회의나 발표에서 좋은 인상을 남길 수 있을 거예요. 🎤",
    "업무 속에서도 작은 즐거움을 찾아보세요! 😊",
    "기회는 준비된 자에게 온다! 배움을 게을리하지 마세요. 📚",
  ],
  행운아이템: [
    "오늘의 행운 아이템은 파란색 옷이에요! 💙",
    "지갑에 작은 부적을 넣어두면 좋은 일이 생길 거예요. 🍀",
    "커피보다는 차를 마시는 것이 좋은 하루예요. ☕",
    "새로운 노트를 사용하면 좋은 기운이 들어올 거예요. 📒",
    "자신이 좋아하는 향수를 뿌려보세요. 💐",
    "가벼운 악세서리가 행운을 불러올 거예요! 💍",
    "흰색 신발을 신으면 기분 좋은 하루가 될 거예요. 👟",
    "손목시계를 착용하면 좋은 흐름을 탈 수 있어요. ⌚",
    "자신을 위한 작은 선물을 해보세요! 🎁",
    "책 한 권을 읽으면 예상치 못한 깨달음을 얻을 거예요. 📖",
  ],
  행운의색: [
    "오늘의 행운 색은 노란색이에요! 🌟",
    "푸른 계열의 색상이 좋은 기운을 가져올 거예요. 💙",
    "오늘은 녹색이 당신에게 행운을 줄 거예요. 🌿",
    "빨간색이 열정을 불러일으킬 거예요! 🔥",
    "은색이 행운을 가져올 거예요. ✨",
    "핑크색이 당신을 더욱 빛나게 해줄 거예요. 💖",
    "보라색이 창의력을 상승시켜 줄 거예요. 💜",
    "하늘색이 평온한 기운을 줄 거예요. ☁️",
    "주황색이 에너지를 충전해 줄 거예요! 🍊",
    "검은색이 차분한 분위기를 만들어 줄 거예요. 🖤",
  ],
  오늘의조언: [
    "작은 것에서 행복을 찾아보세요. 😊",
    "긍정적인 마인드가 행운을 불러올 거예요! ✨",
    "가끔은 즉흥적인 선택이 더 좋은 결과를 가져올 수도 있어요. 🚀",
    "자신을 믿고 한 걸음 나아가 보세요! 👣",
    "기회는 준비된 자에게 찾아와요. 📚",
    "오늘 하루를 소중하게 보내세요. ⏳",
    "자신을 위한 시간을 가져보는 것도 중요해요. 🕰️",
    "작은 도전이 인생을 바꿀 수 있어요! 🔥",
    "너무 걱정하지 마세요, 모든 일은 잘 풀릴 거예요. 🌈",
    "행복은 멀리 있지 않아요, 지금 이 순간을 즐기세요! 🎶",
  ],
};


const Cookie: React.FC = () => {
  const [fortune, setFortune] = useState<string>("🔮 운세를 확인하세요!");
  const [history, setHistory] = useState<string[]>([]);
  const [category, setCategory] = useState<keyof typeof categories>("일반");

  const getRandomFortune = () => {
    const randomIndex = Math.floor(Math.random() * categories[category].length);
    const newFortune = categories[category][randomIndex];
    setFortune(newFortune);
    setHistory([newFortune, ...history]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-red-200 p-4">
      <h1 className="text-3xl font-bold text-red-700 mb-6">오늘의 운세 🔮</h1>

      <div className="flex gap-4 mb-4">
        {Object.keys(categories).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat as keyof typeof categories)}
            className={`px-4 py-2 rounded-full font-medium transition ${category === cat ? "bg-red-600 text-white" : "bg-white text-red-600 border border-red-600"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={fortune}
        className="bg-white p-6 rounded-xl shadow-md text-center w-80 border-2 border-yellow-400"
      >
        <p className="text-lg font-semibold text-gray-800">{fortune}</p>
      </motion.div>

      <button
        onClick={getRandomFortune}
        className="mt-4 px-6 py-2 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition"
      >
        운세 보기 🎴
      </button>

      {history.length > 0 && (
        <div className="mt-6 w-80 p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-bold mb-2 text-gray-700">운세 기록 📜</h2>
          <ul className="text-gray-600 text-sm">
            {history.slice(0, 5).map((item, index) => (
              <li key={index} className="border-b py-1 last:border-none">🔹 {item}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};

export default Cookie;
