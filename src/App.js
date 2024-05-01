import React, { useState, useEffect } from 'react';
import Button from './components/Button';
import Card from './components/Card';
import titleImage from './images/title.png';
import backImage from './images/image6.jpg';
import cardImages from './data';
import './App.css';

function generateCardPairs() {
  const cards = [];
  const numPairs = 5;
  const imagesCopy = [...cardImages];
  for (let i = 0; i < numPairs; i++) {
    const imageIndex = Math.floor(Math.random() * imagesCopy.length);
    const image = imagesCopy.splice(imageIndex, 1)[0];
    cards.push({ id: i * 2, image, isFlipped: true });
    cards.push({ id: i * 2 + 1, image, isFlipped: true });
  }
  return cards;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function App() {
  const [cards, setCards] = useState(generateCardPairs());
  const [flippedCards, setFlippedCards] = useState([]);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [pairsFound, setPairsFound] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [scores, setScores] = useState([]);
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    let timer;
    if (isRunning && pairsFound !== totalPairs) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
  
    return () => clearInterval(timer);
  }, [isRunning, pairsFound]);

  const totalPairs = 5;

  const handleCardClick = (id, image) => {
    const flippedCard = { id, image };
    setFlippedCards(prevFlippedCards => [...prevFlippedCards, flippedCard]);
    setCards(prevCards => prevCards.map(card => {
      if (card.id === id) {
        return { ...card, isFlipped: true };
      }
      return card;
    }));
  };

  const handleStartClick = () => {
    setIsRunning(true);
    setPairsFound(0);
    setCards(shuffle(cards.map(card => ({ ...card, isFlipped: false }))));
  };

  const handleRestartClick = () => {
    const newCards = generateCardPairs();
    setCards(newCards);
    setIsRunning(false);
    setTime(0);
    setIsGameWon(false);
    setPlayerName('');
  };

  const handlePlayerNameChange = (event) => {
    setPlayerName(event.target.value);
  };

  const handleSaveScore = () => {
    setScores(prevScores => [...prevScores, { playerName, time }]);
    handleRestartClick(); // Redémarrer le jeu après avoir enregistré le score
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;
      if (firstCard.image === secondCard.image) {
        setCards(prevCards => prevCards.map(card => {
          if (card.id === firstCard.id || card.id === secondCard.id) {
            return { ...card, isFlipped: true };
          }
          return card;
        }));
        setPairsFound(prevPairsFound => prevPairsFound + 1);
      } else {
        setTimeout(() => {
          setCards(prevCards => prevCards.map(card => {
            if (card.id === firstCard.id || card.id === secondCard.id) {
              return { ...card, isFlipped: false };
            }
            return card;
          }));
        }, 1000);
      }
      setFlippedCards([]);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (pairsFound === totalPairs) {
      setIsRunning(false);
      setIsGameWon(true);
    }
  }, [pairsFound, totalPairs]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleResetScores = () => {
    setScores([]);
  };

  const handleSortScores = () => {
    const sortedScores = [...scores].sort((a, b) => a.time - b.time);
    setScores(sortedScores);
  };

  const handleSortScoresByName = () => {
    const sortedScores = [...scores].sort((a, b) => a.playerName.localeCompare(b.playerName));
    setScores(sortedScores);
  };

  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem('memory_game_scores')) || [];
    setScores(storedScores);
  }, []);

  useEffect(() => {
    localStorage.setItem('memory_game_scores', JSON.stringify(scores));
  }, [scores]);

  return (
    <div className="center-content">
      <div className="App">
        <img src={titleImage} alt="Titre" className="title-image" />
        {!isRunning && !isGameWon && <Button className="start-button" label="Start" onClick={handleStartClick} />}
        {(!isRunning || !isGameWon) && <Button className="restart-button" label="Shufle" onClick={handleRestartClick} />}
        {isGameWon && (
          <div>
            <div className="message">You Won !</div>
            <input type="text" value={playerName} onChange={handlePlayerNameChange} placeholder="Enter your name" />
            <Button className="save-score-button" label="Save Score" onClick={handleSaveScore} />
          </div>
        )}
        <div className="time">Time: {formatTime(time)}</div>
        <div className="card-container">
          {cards.map(card => (
            <Card
              key={card.id}
              image={card.isFlipped ? card.image : backImage}
              onClick={() => card.isFlipped ? null : handleCardClick(card.id, card.image)}
            />
          ))}
        </div>
      </div>
      <div className="leaderboard">
        <h2>Leaderboard</h2>
          <div className="sort-buttons-container">
            <Button label="Sort by Time" onClick={handleSortScores} className="sort-button" />
            <Button label="Sort by Name" onClick={handleSortScoresByName} className="sort-button" />
            <Button label="Reset Scores" onClick={handleResetScores} className="sort-button" />
          </div>
        <table>
          <thead>
            <tr>
              <th>Player Name</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={index}>
                <td>{score.playerName}</td>
                <td>{formatTime(score.time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
