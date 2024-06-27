import {useCallback, useEffect, useMemo, useState} from 'react'
import owl from './assets/owl.svg'
import './App.css'
import Decimal from "break_eternity.js";

const __SAVE_VERSION__ = '2024-06-27-1'; // Update when changing save format

interface Effect {
    name: string;
    value: string;
}

interface Upgrade {
    name: string;
    basePrice: string;
    price: string;
    stock: string;
    count: string;
    effect: Effect[];
    soldOut: boolean;
    formula: string;
}

const baseUpgrades: Upgrade[] = [
    {
        name: "+1 per click",
        basePrice: "50",
        price: "50",
        stock: '10',
        count: '0',
        soldOut: false,
        effect: [
            {
                name: "perClick",
                value: '1'
            }
        ],
        formula: 'formula1',
    },
    {
        name: "+2 per click",
        basePrice: '100',
        price: '100',
        stock: '5',
        count: '0',
        soldOut: false,
        effect: [
            {
                name: "perClick",
                value: '2'
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
            // return parsedUpgrades
            return parsedUpgrades.map(upgrade => ({...upgrade, price: calculateUpgradePrice(upgrade)}));
        }
        return baseUpgrades;
    });
    const [clicks, setClicks] = useState(() => {
        const storedClicks = localStorage.getItem('clickCount');
        return storedClicks ? new Decimal(storedClicks) : new Decimal(0);
    });
    const [autoClickers, setAutoClickers] = useState(() => {
        const storedAutoClickers = localStorage.getItem('autoClickers');
        return storedAutoClickers ? new Decimal(storedAutoClickers) : new Decimal(0);
    });
    const totalPerClick = useMemo(() => {
        let sum = new Decimal(1);
        upgrades.forEach(upgrade => {
            upgrade.effect.forEach(effect => {
                if (effect.name === 'perClick') {
                    sum = sum.plus(Decimal.mul(upgrade.count, effect.value))
                }
            })
        })
        return sum;
    }, [upgrades]);

    const autoClickerPrice = new Decimal(100).mul(new Decimal(10).pow(autoClickers));


    useEffect(() => {
        localStorage.setItem('clickCount', clicks.toString());
        localStorage.setItem('autoClickers', autoClickers.toString());
        localStorage.setItem('upgrades', JSON.stringify(upgrades));
        localStorage.setItem('saveVersion', __SAVE_VERSION__);
        localStorage.setItem('saveTimeStamp', new Date().toISOString());
    }, [clicks, autoClickers, upgrades]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (autoClickers.eq(0)) {
                return;
            }
            setClicks((clicks) => clicks.plus(totalPerClick.mul(autoClickers)).ceil());
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, [autoClickers, totalPerClick, clicks]);


    function buyUpgrade(index: number) {
        setUpgrades(prevUpgrades => {
            const updatedUpgrades = [...prevUpgrades];
            const upgrade = updatedUpgrades[index];
            if (upgrade.soldOut || clicks.lessThan(upgrade.price)) {
                return prevUpgrades;
            }
            const newCount = new Decimal(upgrade.count).plus(1).toString();
            const newPrice = calculateUpgradePrice({...upgrade, count: newCount});

            updatedUpgrades[index] = {
                ...upgrade,
                count: newCount,
                price: newPrice,
                soldOut: new Decimal(newCount).greaterThanOrEqualTo(upgrade.stock)
            };

            return updatedUpgrades;
        });


    }

    function calculateUpgradePrice(upgrade: Upgrade) {
        const basePrice = new Decimal(upgrade.basePrice)
        const count = new Decimal(upgrade.count)
        switch (upgrade.formula) {
            case 'formula1':
                return basePrice.mul(count.plus(1)).mul(count.plus(1).pow(2)).ceil().toString();
            case 'formula2':
                return basePrice.mul(count.plus(1)).mul(count.plus(1).mul(2).pow(count.plus(1))).ceil().toString();
        }
        return upgrade.price
    }

    const click = useCallback(() => {
        setClicks((clicks) => clicks.plus(totalPerClick).ceil());
    }, [totalPerClick]);

    return (
        <div style={{display: 'flex'}}>
            <div style={{flex: 2}}>
                <div className="owl">
                    <img src={owl} onClick={() => {
                        setClicks((clicks) => clicks.pow(2).ceil());
                    }} className="logo" alt="An owl"/>
                </div>
                Total clicks: <h1>{clicks.toString()}</h1>
                <div className="card">
                    <button onClick={click}>
                        Click!
                    </button>
                    <p>
                        Count per click {totalPerClick.toString()}
                    </p>
                    <div>
                        <button disabled={clicks.lessThan(autoClickerPrice)} onClick={() => {
                            setClicks((clicks) => clicks.minus(autoClickerPrice).ceil());
                            setAutoClickers((autoClickers) => autoClickers.plus(1));
                        }}>{autoClickerPrice.toString()}
                        </button>
                        <p>autoclickers: {autoClickers.toString()}</p>
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
                    setClicks(new Decimal(0));
                    setAutoClickers(new Decimal(0));
                    setUpgrades(baseUpgrades);
                }}>Reset
                </button>
            </div>
            <div style={{flex: 1, borderLeft: '1px solid #ccc', padding: '20px'}}>
                <h2>Upgrades</h2>
                {upgrades.map((upgrade, index) => (
                    <div key={index}>
                        <h3>{upgrade.name}</h3>
                        <button disabled={clicks.lessThan(upgrade.price) || upgrade.soldOut} onClick={() => {
                            setClicks((clicks) => clicks.minus(upgrade.price).ceil());
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
