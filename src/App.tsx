import {useCallback, useEffect, useMemo, useState} from 'react'
import owl from './assets/owl.svg'
import './App.css'
import Decimal from "break_eternity.js";
import upgradesJSON from './data/upgrades.json';

const __SAVE_VERSION__ = '2024-06-27-1'; // Update when changing save format
const __BASE_TICK_TIMER__ = 10000;

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

const baseUpgrades: Upgrade[] = upgradesJSON

function App() {
    const [upgrades, setUpgrades] = useState<Upgrade[]>(() => {
        const finalUpgrades = baseUpgrades
        const storedUpgrades = localStorage.getItem('upgrades');
        if (storedUpgrades) {
            const parsedUpgrades = JSON.parse(storedUpgrades) as Upgrade[];
            finalUpgrades.forEach(finalUpgrade => {
                const upgrade = parsedUpgrades.find(u => u.name === finalUpgrade.name);
                if (upgrade) {
                    finalUpgrade.count = Decimal.min(upgrade.count, finalUpgrade.stock).toString();
                }

            })
            return finalUpgrades.map(upgrade => ({
                ...upgrade,
                price: calculateUpgradePrice(upgrade),
                soldOut: new Decimal(upgrade.count).greaterThanOrEqualTo(new Decimal(upgrade.stock))
            }));
        }
        return finalUpgrades;
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
    const perTick = useMemo(() => {
        let sum = new Decimal(0);
        upgrades.forEach(upgrade => {
            upgrade.effect.forEach(effect => {
                if (effect.name === 'perTick') {
                    sum = sum.plus(Decimal.mul(upgrade.count, effect.value))
                }
            })
        })
        return sum;
    }, [upgrades]);
    const totalTickTimer = useMemo(() => {
        let sum = new Decimal(__BASE_TICK_TIMER__);
        upgrades.forEach(upgrade => {
            upgrade.effect.forEach(effect => {
                if (effect.name === 'tickTime') {
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
    useEffect(() => {
        const tickTimer = setInterval(() => {
            if (perTick.eq(0)) {
                return;
            }
            setClicks((clicks) => clicks.plus(perTick).ceil());
        }, totalTickTimer.toNumber());
        return () => {
            clearInterval(tickTimer);
        };
    }, [perTick, totalTickTimer, clicks]);

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
                    }} className="logo" alt="A Cheating owl"/>
                </div>
                Total clicks: <h1>{clicks.toString()}</h1>


                +{perTick.toString()} every {totalTickTimer.div(1000).toString()}s from generators
                <div className="card">
                    <button onClick={click}>
                        Click! +{totalPerClick.toString()}
                    </button>
                    <br/>
                    <br/>
                    Auto Clickers
                    <div>
                        <button disabled={clicks.lessThan(autoClickerPrice)} onClick={() => {
                            setClicks((clicks) => clicks.minus(autoClickerPrice).ceil());
                            setAutoClickers((autoClickers) => autoClickers.plus(1));
                        }}>{autoClickerPrice.toString()}
                        </button>
                        <p>+{totalPerClick.toString()} every 1s from {autoClickers.toString()} autoclickers</p>
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
