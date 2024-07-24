import { ImageKey } from "@/assets/imageAssets";

export interface Generator {
  level: number;
  cost: number;
  image: ImageKey;
}

export interface Upgrade {
  level: number;
  cost: number;
  image: ImageKey;
}
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

export interface Generators {
  coinMiner: Generator;
  knowledgeMiner: Generator;
  foodMiner: Generator;
  woodMiner: Generator;
  rockMiner: Generator;
  ironMiner: Generator;
}

export interface Upgrades {
  autoClickers: Upgrade;
}

export type ResourceType = keyof Resources;

export interface GameState {
  resources: Resources;
  upgrades: Upgrades;
  generators: Generators;
  stats: Stats;
}

export interface GeneratorCardProps {
  name: string;
  level: number;
  cost: number;
  onUpgrade: () => void;
  image: ImageKey;
}

export interface PersistentSidebarProps {
  stats: Stats;
  resources: Resources;
}

export interface ResourceCardProps {
  name: ResourceType;
  amount: number;
  image: ImageKey;
  description: string;
}
