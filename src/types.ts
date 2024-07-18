export interface Resources {
  coins: number;
  wood: number;
  food: number;
  knowledge: number;
  iron: number;
  rock: number;
}

export interface Stats {
  level: number;
  totalClicks: number;
}

export interface Generator {
  level: number;
  cost: number;
  image: string;
}

export interface Generators {
  coinMiner: Generator;
  knowledgeMiner: Generator;
  foodMiner: Generator;
  woodMiner: Generator;
  rockMiner: Generator;
  ironMiner: Generator;
}

export type ResourceType =
  | "coins"
  | "wood"
  | "food"
  | "knowledge"
  | "iron"
  | "rock";
