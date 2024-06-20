import {useEffect, useState} from 'react'
import owl from './assets/owl.svg'
import './App.css'

function App() {
    const [count, setCount] = useState(() => {
        const storedCount = localStorage.getItem('clickCount');
        return storedCount ? parseInt(storedCount) : 0;
    });
    const [countPerClick, setCountPerClick] = useState(() => {
        const storedCountPerClick = localStorage.getItem('countPerClick');
        return storedCountPerClick ? parseInt(storedCountPerClick) : 1;
    });
    const [countPerClickIncrement] = useState(() => {
        const storedCountPerClickIncrement = localStorage.getItem('countPerClickIncrement');
        return storedCountPerClickIncrement ? parseInt(storedCountPerClickIncrement) : 1;
    });
    useEffect(() => {
        localStorage.setItem('clickCount', count.toString());
        localStorage.setItem('countPerClick', countPerClick.toString());
        localStorage.setItem('countPerClickIncrement', countPerClickIncrement.toString());
    }, [count, countPerClick, countPerClickIncrement]);

    return (
        <>
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
            </div>
            <p className="about">
                Vectors and icons by <a href="https://dribbble.com/reggid?ref=svgrepo.com" target="_blank">Aslan</a> in
                CC Attribution License via <a href="https://www.svgrepo.com/" target="_blank">SVG Repo</a>
            </p>
        </>
    )
}

export default App
