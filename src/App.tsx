import React from 'react'
import './App.css'
import Taulell from './components/Taulell'

type CombinacioType = { elements: string; resultat: string; };

const combinacions: CombinacioType[] = [
  { elements: '💧 + 💧', resultat: '🥛' },
  { elements: '🔥 + 🔥', resultat: '🍳' },
  { elements: '🥛 + 🥛', resultat: '🚰' },
  { elements: '🚰 + 🚰', resultat: '🚛' },
  { elements: '🍳 + 🍳', resultat: '🍗' },
  { elements: '🍗 + 🍗', resultat: '🍔' },
]

function App(): React.ReactElement {
  return (
    <div className="App">
      <h1>Fusiona-elements</h1>
      <Taulell />
      <div className="combinacions">
        <h3>Combinacions:</h3>
        <div className="llista-combinacions">
          {combinacions.map((combo: CombinacioType, index: number) => (
            <div key={index} className="combinatio">
              <span>{combo.elements} → {combo.resultat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
