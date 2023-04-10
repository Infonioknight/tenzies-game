import Die from "./Die";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [count, setCount] = useState(0);
  const [highscore, setHighscore] = useState(
    JSON.parse(localStorage.getItem("highscore")) || 0
  );

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dice]);

  function storeHighscore() {
    if (highscore === 0 || count < highscore)
      localStorage.setItem("highscore", JSON.stringify(count));
  }

  function updateHighscore() {
    setHighscore(JSON.parse(localStorage.getItem("highscore")));
  }

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.isHeld ? die : generateNewDie();
      })
    );
  }

  function updateCounter() {
    setCount((prevCount) => prevCount + 1);
  }

  function rollAndCount() {
    if (!tenzies) {
      rollDice();
      updateCounter();
    } else {
      setTenzies(false);
      setDice(allNewDice());
      resetCount();
      storeHighscore();
      updateHighscore();
    }
  }

  function resetCount() {
    setCount(0);
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <div className="master-container">
      {tenzies && <Confetti />}
      <main className="app-container">
        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls. The lower the number of rolls, the
          better!
        </p>
        <div className="dice-container">{diceElements}</div>
        <h2 className="high-score">High-Score: {highscore}</h2>
        <h2 className="number-of-rolls">Number of Rolls: {count}</h2>
        <button className="roll-dice" onClick={rollAndCount}>
          {tenzies ? "New Game" : "Roll"}
        </button>
      </main>
    </div>
  );
}
