import {useEffect, useState} from 'react'
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
    formula: (basePrice: number, count: number) => number; // Function to calculate price increase
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
        formula: (price, count) => price * (1 + count) ** 2,
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
        formula: (price, count) => price * 1.5 ** (1 + count),
    },
]


function App() {
    const [upgrades, setUpgrades] = useState<Upgrade[]>(() => {
        const storedUpgrades = localStorage.getItem('upgrades');
        if (storedUpgrades) {
            return JSON.parse(storedUpgrades) as Upgrade[];
        }
        return baseUpgrades;
    });
    const [clicks, setClicks] = useState(() => {
        const storedClicks = localStorage.getItem('clickCount');
        return storedClicks ? parseInt(storedClicks) : 0;
    });
    const [countPerClick, setCountPerClick] = useState(() => {
        const storedCountPerClick = localStorage.getItem('countPerClick');
        return storedCountPerClick ? parseInt(storedCountPerClick) : 1;
    });
    const [countPerClickIncrement, setCountPerClickIncrement] = useState(() => {
        const storedCountPerClickIncrement = localStorage.getItem('countPerClickIncrement');
        return storedCountPerClickIncrement ? parseInt(storedCountPerClickIncrement) : 1;
    });
    const [autoClickers, setAutoClickers] = useState(() => {
        const storedAutoClickers = localStorage.getItem('autoClickers');
        return storedAutoClickers ? parseInt(storedAutoClickers) : 0;
    });

    const autoClickerPrice = 100 * (10 ** autoClickers)
    useEffect(() => {
        localStorage.setItem('clickCount', clicks.toString());
        localStorage.setItem('countPerClick', countPerClick.toString());
        localStorage.setItem('countPerClickIncrement', countPerClickIncrement.toString());
        localStorage.setItem('autoClickers', autoClickers.toString());
        localStorage.setItem('upgrades', JSON.stringify(upgrades));
    }, [clicks, countPerClick, countPerClickIncrement, autoClickers, upgrades]);

    useEffect(() => {
        const timer = setInterval(() => {
            setClicks((clicks) => clicks + (countPerClick * autoClickers))
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, [countPerClick, autoClickers]);

    function buyUpgrade(index: number, newCount: number) {
        setUpgrades(prevUpgrades => {
            const updatedUpgrades = [...prevUpgrades];
            const upgrade = updatedUpgrades[index];
            if (upgrade.soldOut || clicks < upgrade.price) {
                return prevUpgrades;
            }
            if (clicks >= upgrade.price) {
                setClicks((clicks) => clicks - upgrade.price);
            }
            const newPrice = Math.ceil(upgrade.formula(upgrade.price, newCount));

            updatedUpgrades[index] = {
                ...upgrade,
                count: newCount,
                price: newPrice,
                soldOut: newCount >= upgrade.stock
            };
            return updatedUpgrades;
        });


    }

    function click() {
        // const countPerClickFromUpgrades = upgrades.map(upgrade => upgrade.count).reduce((a, b) => a + b, 0)
        setClicks((clicks) => clicks + countPerClick);
    }

    return (
        <div style={{display: 'flex'}}>
            <div style={{flex: 2}}>
                <div className="owl">
                    <img src={owl} onClick={() => {
                        setCountPerClick((countPerClick) => countPerClick + countPerClickIncrement);
                    }} className="logo" alt="An owl"/>
                </div>
                Total clicks: <h1>{clicks}</h1>
                <div className="card">
                    <button onClick={click}>
                        Click!
                    </button>
                    <p>
                        Count per click {countPerClick}
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
                    setCountPerClick(1);
                    setCountPerClickIncrement(1);
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
                            buyUpgrade(index, upgrade.count + 1);
                        }}>{upgrade.soldOut ? 'Sold out' : upgrade.price}</button>
                        <p>{upgrade.count}/{upgrade.stock}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default App
