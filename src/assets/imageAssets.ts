import coinImage from "@/assets/coins.svg";
import foodImage from "@/assets/food.svg";
import knowledgeImage from "@/assets/knowledge.svg";
import woodImage from "@/assets/wood.svg";
import ironImage from "@/assets/iron.svg";
import rockImage from "@/assets/rock.svg";
import backgroundSvg from "@/assets/leaves-6975462.svg";

export const images = {
  coins: coinImage,
  food: foodImage,
  knowledge: knowledgeImage,
  wood: woodImage,
  iron: ironImage,
  rock: rockImage,
  background: backgroundSvg,
};

export type ImageKey = keyof typeof images;
