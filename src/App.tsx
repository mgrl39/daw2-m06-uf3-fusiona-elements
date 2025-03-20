import React from 'react'
import './App.css'
import Taulell from './components/Taulell'

type CombinacioType = { elements: string; resultat: string; };

const combinacions: CombinacioType[] = [
  { elements: '💧 + 💧', resultat: '🥛 (Llet)' },
  { elements: '🔥 + 🔥', resultat: '🍳 (Ou)' },
  { elements: '🥛 + 🥛', resultat: '🚰 (Aixeta)' },
  { elements: '🚰 + 🚰', resultat: '🚛 (Camió)' },
  { elements: '🍳 + 🍳', resultat: '🍗 (Carn)' },
  { elements: '🍗 + 🍗', resultat: '🍔 (Hamburguesa)' },
]

function App(): React.ReactElement {
  return (
    <div className="App">
      <h1>Fusiona-elements</h1>
      
      <Taulell />
      <div className="combinations">
        <h3>Combinacions:</h3>
        <div className="combinations-list">
          {combinacions.map((combo: CombinacioType, index: number) => (
            <div key={index} className="combination-item">
              <span>{combo.elements}</span>
              <span className="arrow">→</span>
              <span>{combo.resultat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
