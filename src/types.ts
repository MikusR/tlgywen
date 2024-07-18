export interface Resources {
  coins: number;
  energy: number;
  data: number;
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
  energyPlant: Generator;
  dataCenter: Generator;
}

export type ResourceType = "coins" | "energy" | "data";
