import {useEffect, useState} from 'react'
import owl from './assets/owl.svg'
import './App.css'

interface Upgrade {
    name: string;
    price: number;
    effect: () => void;
}


function App() {
    const [count, setCount] = useState(() => {
        const storedCount = localStorage.getItem('clickCount');
        return storedCount ? parseInt(storedCount) : 0;
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
    const [upgrades, setUpgrades] = useState<Upgrade[]>(() => {
        const storedUpgrades = localStorage.getItem('upgrades');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return storedUpgrades ? JSON.parse(storedUpgrades) : [
            {
                name: "Double Click", price: 50, effect: () => {
                    setCountPerClick(cpc => cpc * 2);
                }
            },
            {
                name: "Triple Click", price: 200, effect: () => {
                    setCountPerClick(cpc => cpc * 3);
                }
            },
            {
                name: "Auto Clicker Boost", price: 500, effect: () => {
                    setCountPerClickIncrement(cpi => cpi * 2);
                }
            },
        ];
    });
    const autoClickerPrice = 100 * (10 ** autoClickers)
    useEffect(() => {
        localStorage.setItem('clickCount', count.toString());
        localStorage.setItem('countPerClick', countPerClick.toString());
        localStorage.setItem('countPerClickIncrement', countPerClickIncrement.toString());
        localStorage.setItem('autoClickers', autoClickers.toString());
        localStorage.setItem('upgrades', JSON.stringify(upgrades));
    }, [count, countPerClick, countPerClickIncrement, autoClickers, upgrades]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCount((count) => count + (countPerClick) * autoClickers)
        }, 1000);
        return () => {
            clearInterval(timer)
        };
    },);
    const buyUpgrade = (upgrade: Upgrade, index: number) => {
        if (count >= upgrade.price) {
            setCount(count => count - upgrade.price);
            upgrade.effect();
            setUpgrades(upgrades => upgrades.filter((_, i) => i !== index));
        }
    };


    return (
        <div style={{display: 'flex'}}>
            <div style={{flex: 2}}>
                <div className="owl">
                    <img src={owl} onClick={() => {
                        setCountPerClick((countPerClick) => countPerClick + countPerClickIncrement);
                    }} className="logo" alt="An owl"/>
                </div>
                Total clicks: <h1>{count}</h1>
                <div className="card">
                    <button onClick={() => {
                        setCount((count) => count + countPerClick);
                    }}>
                        Click!
                    </button>
                    <p>
                        Count per click {countPerClick}
                    </p>
                    <div>
                        <button disabled={count < autoClickerPrice} onClick={() => {
                            setCount((count) => count - autoClickerPrice);
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
                    setCount(0);
                    setCountPerClick(1);
                    setCountPerClickIncrement(1);
                    setAutoClickers(0);
                    setUpgrades([
                        {
                            name: "Double Click", price: 50, effect: () => {
                                setCountPerClick(cpc => cpc * 2);
                            }
                        },
                        {
                            name: "Triple Click", price: 200, effect: () => {
                                setCountPerClick(cpc => cpc * 3);
                            }
                        },
                        {
                            name: "Auto Clicker Boost",
                            price: 500,
                            effect: () => {
                                setCountPerClickIncrement(cpi => cpi * 2);
                            }
                        },
                    ]);
                }}>Reset
                </button>
            </div>
            <div style={{flex: 1, borderLeft: '1px solid #ccc', padding: '20px'}}>
                <h2>Upgrades</h2>
                {upgrades.map((upgrade, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            buyUpgrade(upgrade, index);
                        }}
                        disabled={count < upgrade.price}
                        style={{display: 'block', margin: '10px 0'}}
                    >
                        {upgrade.name} ({upgrade.price} clicks)
                    </button>
                ))}
            </div>
        </div>
    )
}

export default App
