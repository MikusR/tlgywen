import React, { useState, useEffect, useCallback } from "react";
import { UserRoundSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { images, ImageKey } from "@/assets/imageAssets";
import PersistentSidebar from "@/components/PersistentSidebar";
import GeneratorCard from "@/components/GeneratorCard";

import {
  Generators,
  Generator,
  ResourceType,
  Resources,
  Upgrades,
  GameState,
} from "../types";

const CURRENT_SAVE_VERSION = 1;

const assetCredits = [
  {
    name: "Background Image",
    author: "Alexey Hulsov",
    link: "https://pixabay.com/vectors/leaves-sample-decorative-decoration-6975462/",
  },
  {
    name: "Owl",
    author: "Aslan",
    link: "https://dribbble.com/reggid?ref=svgrepo.com",
  },
  {
    name: "Icons",
    author: "game-icons.net",
    link: "https://game-icons.net/",
  },
];

// Initial state values
const initialState = {
  version: CURRENT_SAVE_VERSION,
  resources: {
    coins: 1,
    wood: 1,
    food: 1,
    knowledge: 1,
    iron: 1,
    rock: 1,
  },
  upgrades: {
    autoClickers: {
      level: 1,
      cost: 10,
      image: "coins" as ImageKey,
    },
  },
  generators: {
    coinMiner: {
      level: 1,
      cost: 10,
      image: "coins" as ImageKey,
    },
    knowledgeMiner: {
      level: 1,
      cost: 20,
      image: "knowledge" as ImageKey,
    },
    foodMiner: {
      level: 1,
      cost: 30,
      image: "food" as ImageKey,
    },
    woodMiner: {
      level: 1,
      cost: 30,
      image: "wood" as ImageKey,
    },
    ironMiner: {
      level: 1,
      cost: 30,
      image: "iron" as ImageKey,
    },
    rockMiner: {
      level: 1,
      cost: 30,
      image: "rock" as ImageKey,
    },
  },
  stats: {
    level: 1,
    totalClicks: 1,
  },
};

// Function to migrate old save data to the current version
const migrateGameState = (oldState: GameState): GameState => {
  const newState = { ...oldState };

  if (!newState.version || newState.version < CURRENT_SAVE_VERSION) {
    // Perform migrations based on the version
    if (!newState.version) {
      // Migrate from unversioned to version 1
      newState.version = 1;
      // Add any new fields or modify existing ones as needed
      newState.resources = newState.resources || initialState.resources;
      newState.upgrades = newState.upgrades || initialState.upgrades;
      newState.generators = newState.generators || initialState.generators;
      newState.stats = newState.stats || initialState.stats;
    }

    // Add more migration steps for future versions here
    // if (newState.version < 2) {
    //   // Migrate from version 1 to 2
    //   newState.version = 2;
    //   // Add migration logic
    // }

    console.log(
      `Migrated save data from version ${
        oldState.version || "unversioned"
      } to ${newState.version}`
    );
  }
  return newState as GameState;
};

const ClickerGameDashboard: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedState = localStorage.getItem("clickerGameState");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        return migrateGameState(parsedState);
      } catch (error) {
        console.error("Error parsing saved game state:", error);
      }
    }
    return initialState;
  });

  const { toast } = useToast();

  const [log, setLog] = useState([
    {
      id: performance.now() + Math.random(),
      time: new Date().toLocaleTimeString(),
      event: "Game started",
    },
  ]);

  const addLogEntry = (event: string) => {
    const newEntry = {
      id: performance.now() + Math.random(),
      time: new Date().toLocaleTimeString(),
      event: event,
    };
    setLog((prevLog) => [newEntry, ...prevLog].slice(0, 10));
  };

  const saveGameState = useCallback(() => {
    localStorage.setItem("clickerGameState", JSON.stringify(gameState));
    console.log("Game state saved");
  }, [gameState]);

  useEffect(() => {
    const timer = setInterval(saveGameState, 50000); // Save every 50 seconds
    return () => clearInterval(timer);
  }, [saveGameState]);

  const updateGameState = useCallback(
    (updater: (prevState: GameState) => Partial<GameState>) => {
      setGameState((prevState: GameState) => {
        const updates = updater(prevState);
        const newState: GameState = {
          ...prevState,
          ...updates,
          resources: {
            ...prevState.resources,
            ...(updates.resources || {}),
          },
          upgrades: {
            ...prevState.upgrades,
            ...(updates.upgrades || {}),
          },
          generators: {
            ...prevState.generators,
            ...(updates.generators || {}),
          },
          stats: {
            ...prevState.stats,
            ...(updates.stats || {}),
          },
        };

        return newState;
      });
    },
    []
  );

  const handleClick = useCallback(() => {
    updateGameState((prevState) => {
      const newState: Partial<GameState> = {
        resources: {
          ...prevState.resources,
          coins: prevState.resources.coins + 1,
        },
        stats: {
          ...prevState.stats,
          totalClicks: prevState.stats.totalClicks + 1,
        },
      };

      if (Math.random() < 0.1) {
        const dropPool: ResourceType[] = [
          "coins",
          "wood",
          "food",
          "knowledge",
          "iron",
          "rock",
        ];
        const droppedResource =
          dropPool[Math.floor(Math.random() * dropPool.length)];
        const dropAmount = Math.floor(Math.random() * 10) + 1;

        newState.resources = {
          ...(newState.resources as Resources),
          [droppedResource]:
            (newState.resources as Resources)[droppedResource] + dropAmount,
        };
        addLogEntry(`You found ${dropAmount.toString()} ${droppedResource}!`);
        // toast({
        //   title: "Resource Drop!",
        //   description: `You found ${dropAmount.toString()} ${droppedResource}!`,
        //   duration: 3000,
        // });
      }

      return newState;
    });
  }, [updateGameState]);

  useEffect(() => {
    const timer = setInterval(() => {
      for (let i = 0; i < gameState.upgrades.autoClickers.level; i++) {
        handleClick();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.upgrades.autoClickers.level, handleClick]);

  useEffect(() => {
    const timer = setInterval(() => {
      updateGameState((prevState) => ({
        resources: {
          coins:
            prevState.resources.coins + prevState.generators.coinMiner.level,
          knowledge:
            prevState.resources.knowledge +
            prevState.generators.knowledgeMiner.level,
          food: prevState.resources.food + prevState.generators.foodMiner.level,
          iron: prevState.resources.iron + prevState.generators.ironMiner.level,
          wood: prevState.resources.wood + prevState.generators.woodMiner.level,
          rock: prevState.resources.rock + prevState.generators.rockMiner.level,
        },
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [updateGameState]);

  const upgradeGenerator = useCallback(
    (type: keyof Generators) => {
      const cost = gameState.generators[type].cost;
      if (gameState.resources.coins >= cost) {
        updateGameState((prevState) => ({
          generators: {
            ...prevState.generators,
            [type]: {
              ...prevState.generators[type],
              level: prevState.generators[type].level + 1,
              cost: Math.floor(prevState.generators[type].cost * 1.15),
            },
          },
          resources: {
            ...prevState.resources,
            coins: prevState.resources.coins - cost,
          },
        }));
      }
    },
    [gameState.generators, gameState.resources.coins, updateGameState]
  );

  const upgradeGather = useCallback(
    (type: keyof Upgrades) => {
      updateGameState((prevState) => {
        const cost = prevState.upgrades[type].cost;
        if (prevState.resources.coins >= cost) {
          return {
            upgrades: {
              ...prevState.upgrades,
              [type]: {
                ...prevState.upgrades[type],
                level: prevState.upgrades[type].level + 1,
                cost: Math.floor(prevState.upgrades[type].cost * 1.15),
              },
            },
            resources: {
              ...prevState.resources,
              coins: prevState.resources.coins - cost,
            },
          };
        }
        return prevState;
      });
    },
    [updateGameState]
  );

  const resetGame = useCallback(() => {
    localStorage.removeItem("clickerGameState");
    setGameState(initialState);
    toast({
      title: "Game Reset",
      description: "Your game has been reset to the initial state.",
      duration: 3000,
    });
  }, [toast]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveGameState();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [saveGameState]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="relative min-h-screen bg-transparent">
        <img
          src={images["background"]}
          alt="Background"
          className="fixed inset-0 object-cover w-full h-full -z-10"
        />
        <div className="absolute inset-0 bg-background/90">
          <div className="flex h-full">
            <PersistentSidebar
              stats={gameState.stats}
              resources={gameState.resources}
            />
            <div className="flex flex-col flex-grow p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Clicker Game Dashboard</h1>
                <div className="flex items-center space-x-2">
                  <Button onClick={resetGame} variant="destructive">
                    Reset Game
                  </Button>
                  <ModeToggle />
                </div>
              </div>

              <Tabs defaultValue="main" className="flex flex-col flex-grow">
                <TabsList className="mb-4 bg-background/90">
                  <TabsTrigger value="main">Main</TabsTrigger>
                  <TabsTrigger value="generators">Generators</TabsTrigger>
{/*                   <TabsTrigger value="research">Research</TabsTrigger>
                  <TabsTrigger value="quests">Quests</TabsTrigger>
                  <TabsTrigger value="shop">Shop</TabsTrigger> */}
                  <TabsTrigger value="log">Log</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>

                <TabsContent
                  value="main"
                  className="flex-grow p-4 rounded-lg bg-card/90"
                >
                  <Tabs defaultValue="clicker">
                    <TabsList>
                      <TabsTrigger value="clicker">Clicker</TabsTrigger>
                      <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
                    </TabsList>
                    <TabsContent value="clicker">
                      <div className="flex items-center justify-center h-full">
                        <Button onClick={handleClick} size="lg" className="p-8">
                          <UserRoundSearch className="w-6 h-6 mr-2" /> Gather
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="upgrades">
                      <GeneratorCard
                        name="Auto Gather"
                        level={gameState.upgrades.autoClickers.level}
                        cost={gameState.upgrades.autoClickers.cost}
                        onUpgrade={() => upgradeGather("autoClickers")}
                        backgroundImage={
                          images[gameState.upgrades.autoClickers.image]
                        }
                      />
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                <TabsContent
                  value="generators"
                  className="flex-grow p-4 overflow-auto rounded-lg bg-card/90"
                >
                  <ScrollArea className="h-full">
                    {(
                      Object.entries(gameState.generators) as [
                        keyof Generators,
                        Generator
                      ][]
                    ).map(([key, generator]) => (
                      <GeneratorCard
                        key={key}
                        name={key}
                        level={generator.level}
                        cost={generator.cost}
                        onUpgrade={() =>
                          upgradeGenerator(key as keyof Generators)
                        }
                        backgroundImage={images[generator.image]}
                      />
                    ))}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="research">
                  <p>Research content (to be implemented)</p>
                </TabsContent>

                <TabsContent value="quests">
                  <p>Quests content (to be implemented)</p>
                </TabsContent>

                <TabsContent value="shop">
                  <p>Shop content (to be implemented)</p>
                </TabsContent>
                <TabsContent value="log">
                  <Table>
                    <TableCaption>Event log</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Time</TableHead>
                        <TableHead className="text-center">Event</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {log.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">
                            {row.time}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.event}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="about">
                  <ScrollArea className="h-full">
                    <div className="space-y-6">
                      <section>
                        <h2 className="mb-2 text-2xl font-bold">
                          Game Version
                        </h2>
                        <p>Current Version: {__COMMIT_HASH__}</p>
                      </section>

                      <section>
                        <h2 className="mb-2 text-2xl font-bold">
                          Asset Credits
                        </h2>
                        <ul className="space-y-2">
                          {assetCredits.map((credit, index) => (
                            <li key={index}>
                              <strong>{credit.name}</strong> by{" "}
                              <a
                                href={credit.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                {credit.author}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </section>

                      <section>
                        <h2 className="mb-2 text-2xl font-bold">
                          About the Game
                        </h2>
                        <p>
                          This clicker game was developed as a fun project to
                          explore React and game development concepts.
                        </p>
                      </section>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default ClickerGameDashboard;
