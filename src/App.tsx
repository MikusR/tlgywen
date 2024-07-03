import {useState, useEffect} from 'react';
import {Grid, Zap, Database, Plus, ArrowUp, User} from 'lucide-react';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Progress} from '@/components/ui/progress';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';

const ResourceCard = ({name, amount, icon: Icon}) => (
    <div className="flex justify-between items-center mb-2 bg-gray-700 p-2 rounded">
        <div className="flex items-center">
            <Icon className="h-4 w-4 mr-2 text-gray-400"/>
            <span className="text-sm text-gray-200">{name}</span>
        </div>
        <span className="text-sm font-bold text-gray-200">{amount.toLocaleString()}</span>
    </div>
);

const GeneratorCard = ({name, level, cost, onUpgrade, backgroundImage}) => (
    <Card className="mb-2 overflow-hidden">
        <div
            className="relative h-24 bg-cover bg-center"
            style={{backgroundImage: `url(${backgroundImage})`}}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50 p-2">
                <div className="flex justify-between items-start h-full text-white">
                    <div>
                        <h3 className="font-bold">{name}</h3>
                        <p className="text-sm">Level: {level}</p>
                    </div>
                    <Button
                        onClick={onUpgrade}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                    >
                        <ArrowUp className="h-4 w-4 mr-1"/>
                        {cost}
                    </Button>
                </div>
                <Progress value={level % 10 * 10} className="absolute bottom-0 left-0 right-0"/>
            </div>
        </div>
    </Card>
);

const PersistentSidebar = ({stats, resources}) => (
    <div className="w-64 bg-gray-800 p-4 text-white flex flex-col">
        <div className="flex items-center space-x-4 mb-6">
            <Avatar>
                <AvatarImage src="/api/placeholder/32/32" alt="Avatar"/>
                <AvatarFallback><User/></AvatarFallback>
            </Avatar>
            <div>
                <h2 className="text-lg font-bold">Player Name</h2>
                <p className="text-sm text-gray-400">Level {stats.level}</p>
            </div>
        </div>
        <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Resources</h3>
            <ResourceCard name="Coins" amount={resources.coins} icon={Grid}/>
            <ResourceCard name="Energy" amount={resources.energy} icon={Zap}/>
            <ResourceCard name="Data" amount={resources.data} icon={Database}/>
        </div>
        <div className="space-y-2 mt-auto">
            <p>Total Clicks: {stats.totalClicks}</p>
            <p>Total Resources: {stats.totalResources}</p>
            <p>Generators Owned: {stats.generatorsOwned}</p>
        </div>
    </div>
);

const ClickerGameDashboard = () => {
    const [resources, setResources] = useState({
        coins: 0,
        energy: 0,
        data: 0,
    });

    const [generators, setGenerators] = useState({
        coinMiner: {level: 1, cost: 10, image: "/api/placeholder/256/144"},
        energyPlant: {level: 1, cost: 20, image: "/api/placeholder/256/144"},
        dataCenter: {level: 1, cost: 30, image: "/api/placeholder/256/144"},
    });

    const [stats, setStats] = useState({
        level: 1,
        totalClicks: 0,
        totalResources: 0,
        generatorsOwned: 3,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setResources(prev => ({
                coins: prev.coins + generators.coinMiner.level,
                energy: prev.energy + generators.energyPlant.level,
                data: prev.data + generators.dataCenter.level,
            }));
        }, 1000);

        return () => clearInterval(timer);
    }, [generators]);

    const upgradeGenerator = (type) => {
        const cost = generators[type].cost;
        if (resources.coins >= cost) {
            setGenerators(prev => ({
                ...prev,
                [type]: {
                    ...prev[type],
                    level: prev[type].level + 1,
                    cost: Math.floor(prev[type].cost * 1.15),
                },
            }));
            setResources(prev => ({...prev, coins: prev.coins - cost}));
            setStats(prev => ({...prev, generatorsOwned: prev.generatorsOwned + 1}));
        }
    };

    const handleClick = () => {
        setResources(prev => ({...prev, coins: prev.coins + 1}));
        setStats(prev => ({
            ...prev,
            totalClicks: prev.totalClicks + 1,
            totalResources: prev.totalResources + 1
        }));
    };

    return (
        <div className="h-screen flex bg-gray-100">
            <PersistentSidebar stats={stats} resources={resources}/>

            <div className="flex-grow flex flex-col p-4 overflow-hidden">
                <h1 className="text-3xl font-bold mb-4">Clicker Game Dashboard</h1>

                <Tabs defaultValue="main" className="flex-grow flex flex-col">
                    <TabsList className="mb-4">
                        <TabsTrigger value="main">Main</TabsTrigger>
                        <TabsTrigger value="generators">Generators</TabsTrigger>
                        <TabsTrigger value="research">Research</TabsTrigger>
                        <TabsTrigger value="quests">Quests</TabsTrigger>
                        <TabsTrigger value="shop">Shop</TabsTrigger>
                    </TabsList>

                    <TabsContent value="main" className="flex-grow">
                        <Tabs defaultValue="clicker">
                            <TabsList>
                                <TabsTrigger value="clicker">Clicker</TabsTrigger>
                                <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
                            </TabsList>
                            <TabsContent value="clicker">
                                <div className="flex justify-center items-center h-full">
                                    <Button onClick={handleClick} size="lg" className="p-8">
                                        <Plus className="mr-2 h-6 w-6"/> Click for Coin
                                    </Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="upgrades">
                                <p>Upgrades content (to be implemented)</p>
                            </TabsContent>
                        </Tabs>
                    </TabsContent>

                    <TabsContent value="generators" className="flex-grow overflow-auto">
                        <ScrollArea className="h-full">
                            <GeneratorCard
                                name="Coin Miner"
                                level={generators.coinMiner.level}
                                cost={generators.coinMiner.cost}
                                onUpgrade={() => upgradeGenerator('coinMiner')}
                                backgroundImage={generators.coinMiner.image}
                            />
                            <GeneratorCard
                                name="Energy Plant"
                                level={generators.energyPlant.level}
                                cost={generators.energyPlant.cost}
                                onUpgrade={() => upgradeGenerator('energyPlant')}
                                backgroundImage={generators.energyPlant.image}
                            />
                            <GeneratorCard
                                name="Data Center"
                                level={generators.dataCenter.level}
                                cost={generators.dataCenter.cost}
                                onUpgrade={() => upgradeGenerator('dataCenter')}
                                backgroundImage={generators.dataCenter.image}
                            />
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
                </Tabs>
            </div>
        </div>
    );
};

export default ClickerGameDashboard;
