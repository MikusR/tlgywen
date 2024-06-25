import {useEffect, useState} from 'react'
import owl from './assets/owl.svg'
import './App.css'

interface Upgrade {
    name: string;
    price: number;
    stock: number;
    count: number;
    priceIncrease: number;
    formula: (basePrice: number, count: number) => number; // Function to calculate price increase
}


function App() {
    const [upgrades, setUpgrades] = useState<Upgrade[]>([
        {
            name: "Double Click",
            price: 50,
            stock: 10,
            count: 0,
            priceIncrease: 0,
            formula: (basePrice, count) => basePrice * count ** 2,
        },
        {
            name: "Auto Clicker",
            price: 100,
            stock: 5,
            count: 0,
            priceIncrease: 0,
            formula: (basePrice, count) => basePrice * 1.5 ** count, // Exponential growth
        },
        // ... more upgrades with their own formulas
    ]);
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
            setCount((count) => count + (countPerClick * autoClickers))
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, [countPerClick, autoClickers]);

    function handleUpgradeCountChange(index: number, newCount: number) {
        setUpgrades(prevUpgrades => {
            const updatedUpgrades = [...prevUpgrades];
            const upgrade = updatedUpgrades[index];

            // Use the upgrade's own formula to calculate the new price increase
            const newPriceIncrease = upgrade.formula(upgrade.price, newCount);

            updatedUpgrades[index] = {
                ...upgrade,
                count: newCount,
                priceIncrease: newPriceIncrease,
            };
            return updatedUpgrades;
        });
    }


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
                    setUpgrades([]);
                }}>Reset
                </button>
            </div>
            <div style={{flex: 1, borderLeft: '1px solid #ccc', padding: '20px'}}>
                <h2>Upgrades</h2>
                {upgrades.map((upgrade, index) => (
                    <div key={index}>
                        <h3>{upgrade.name}</h3>
                        <p>Price: {upgrade.price + upgrade.priceIncrease}</p>
                        <input
                            type="number"
                            value={upgrade.count}
                            min="0"
                            max={upgrade.stock}
                            onChange={e => {
                                handleUpgradeCountChange(index, Number(e.target.value));
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default App
