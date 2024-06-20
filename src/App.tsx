import {useState} from 'react'
import owl from './assets/owl.svg'
import './App.css'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div>
                <a href="https://mikusr.info" target="_blank">
                    <img src={owl} className="logo" alt="An owl"/>
                </a>
            </div>
            <h1>{count}</h1>
            <div className="card">
                <button onClick={() => {
                    setCount((count) => count + 1);
                }}>
                    Click!
                </button>
                <p>
                    The last game you would ever need
                </p>
            </div>
            <p className="about">
                Vectors and icons by
                <a href="https://dribbble.com/reggid?ref=svgrepo.com" target="_blank">Aslan</a>
                in CC Attribution License via
                <a href="https://www.svgrepo.com/" target="_blank">SVG Repo</a>
            </p>
        </>
    )
}

export default App
