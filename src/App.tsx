import {useEffect, useMemo, useState} from 'react'
import owl from './assets/owl.svg'
import './App.css'

interface Effect {
    name: string;
    value: number;
}

interface Upgrade {
    name: string;
    basePrice: number;
    price: number;
    stock: number;
    count: number;
    effect: Effect[];
    soldOut: boolean;
    formula: string;
}

const baseUpgrades: Upgrade[] = [
    {
        name: "+1 per click",
        basePrice: 50,
        price: 50,
        stock: 10,
        count: 0,
        soldOut: false,
        effect: [
            {
                name: "perClick",
                value: 1
            }
        ],
        formula: 'formula1',
    },
    {
        name: "+2 per click",
        basePrice: 100,
        price: 100,
        stock: 5,
        count: 0,
        soldOut: false,
        effect: [
            {
                name: "perClick",
                value: 2
            }
        ],
        formula: 'formula2',
    },
]


function App() {
    const [upgrades, setUpgrades] = useState<Upgrade[]>(() => {
        const storedUpgrades = localStorage.getItem('upgrades');
        if (storedUpgrades) {
            const parsedUpgrades = JSON.parse(storedUpgrades) as Upgrade[];
            return parsedUpgrades.map(upgrade => ({...upgrade, price: calculateUpgradePrice(upgrade)}));
        }
        return baseUpgrades;
    });
    const [clicks, setClicks] = useState(() => {
        const storedClicks = localStorage.getItem('clickCount');
        return storedClicks ? parseInt(storedClicks) : 0;
    });
    const [autoClickers, setAutoClickers] = useState(() => {
        const storedAutoClickers = localStorage.getItem('autoClickers');
        return storedAutoClickers ? parseInt(storedAutoClickers) : 0;
    });
    const totalPerClick = useMemo(() => {
        let sum = 1;
        upgrades.forEach(upgrade => {
            upgrade.effect.forEach(effect => {
                if (effect.name === 'perClick') {
                    sum += (upgrade.count * effect.value)
                }
            })
        })
        return sum;
    }, [upgrades]);
    const autoClickerPrice = 100 * (10 ** autoClickers)
    useEffect(() => {
        localStorage.setItem('clickCount', clicks.toString());
        localStorage.setItem('autoClickers', autoClickers.toString());
        localStorage.setItem('upgrades', JSON.stringify(upgrades));
    }, [clicks, autoClickers, upgrades]);

    useEffect(() => {
        const timer = setInterval(() => {
            setClicks((clicks) => clicks + (totalPerClick * autoClickers))
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, [autoClickers, totalPerClick]);

    function buyUpgrade(index: number) {
        setUpgrades(prevUpgrades => {
            const updatedUpgrades = [...prevUpgrades];
            const upgrade = updatedUpgrades[index];
            if (upgrade.soldOut || clicks < upgrade.price) {
                return prevUpgrades;
            }
            if (clicks >= upgrade.price) {
                setClicks((clicks) => clicks - upgrade.price);
            }
            const newCount = upgrade.count + 1;
            const newPrice = calculateUpgradePrice({...upgrade, count: newCount});

            updatedUpgrades[index] = {
                ...upgrade,
                count: newCount,
                price: newPrice,
                soldOut: newCount >= upgrade.stock
            };
            return updatedUpgrades;
        });


    }

    function calculateUpgradePrice(upgrade: Upgrade) {
        switch (upgrade.formula) {
            case 'formula1':
                return Math.ceil((upgrade.basePrice * (1 + upgrade.count)) * (1 + upgrade.count) ** 2);
            case 'formula2':
                return Math.ceil((upgrade.basePrice * (1 + upgrade.count)) * 2 ** (1 + upgrade.count));
        }
        return upgrade.price
    }

    function click() {
        // const countPerClickFromUpgrades = upgrades.map(upgrade => upgrade.count).reduce((a, b) => a + b, 0)
        setClicks((clicks) => clicks + totalPerClick);
    }

    return (
        <div style={{display: 'flex'}}>
            <div style={{flex: 2}}>
                <div className="owl">
                    <img src={owl} onClick={() => {
                        setClicks((clicks) => clicks ** 2);
                    }} className="logo" alt="An owl"/>
                </div>
                Total clicks: <h1>{clicks}</h1>
                <div className="card">
                    <button onClick={click}>
                        Click!
                    </button>
                    <p>
                        Count per click {totalPerClick}
                    </p>
                    <div>
                        <button disabled={clicks < autoClickerPrice} onClick={() => {
                            setClicks((clicks) => clicks - autoClickerPrice);
                            setAutoClickers((autoClickers) => autoClickers + 1);
                        }}>{autoClickerPrice}
                        </button>
                        <p>autoclickers: {autoClickers}</p>
                    </div>
                </div>
                <p className="about">
                    Vectors and icons by <a href="https://dribbble.com/reggid?ref=svgrepo.com"
                                            target="_blank">Aslan</a> in
                    CC Attribution License via <a href="https://www.svgrepo.com/" target="_blank">SVG Repo</a>
                </p>
                <p>
                    Version - {__COMMIT_HASH__}
                </p>
                <button onClick={() => {
                    localStorage.clear();
                    setClicks(0);
                    setAutoClickers(0);
                    setUpgrades(baseUpgrades);
                }}>Reset
                </button>
            </div>
            <div style={{flex: 1, borderLeft: '1px solid #ccc', padding: '20px'}}>
                <h2>Upgrades</h2>
                {upgrades.map((upgrade, index) => (
                    <div key={index}>
                        <h3>{upgrade.name}</h3>
                        <button disabled={clicks < upgrade.price || upgrade.soldOut} onClick={() => {
                            buyUpgrade(index);
                        }}>{upgrade.soldOut ? 'Sold out' : upgrade.price}</button>
                        <p>{upgrade.count}/{upgrade.stock}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default App
