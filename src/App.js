import React, { useState, useEffect } from 'react';
import Button from './components/Button';
import Card from './components/Card';
import titleImage from './images/title.png'; // Importez l'image du titre
import backImage from './images/image6.jpg'; // Importez l'image du dos de carte
import cardImages from './data'; // Importez les liens vers les images des cartes
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
  // Algorithme de mélange de Fisher-Yates
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function App() {
  const [cards, setCards] = useState(generateCardPairs());
  const [flippedCards, setFlippedCards] = useState([]);

  const handleCardClick = (id, image) => {
    // Gérer le clic sur une carte
    const flippedCard = { id, image };
    setFlippedCards(prevFlippedCards => [...prevFlippedCards, flippedCard]);
    setCards(prevCards => prevCards.map(card => {
      if (card.id === id) {
        return { ...card, isFlipped: true };
      }
      return card;
    }));
  };

  const handleShuffleClick = () => {
    // Mélanger les cartes dans un ordre aléatoire
    const shuffledCards = shuffle(cards);
    setCards(shuffledCards.map(card => ({ ...card, isFlipped: false })));
  };

  const handleRestartClick = () => {
    // Rejouer la partie en remettant les cartes à zéro
    const newCards = generateCardPairs();
    setCards(newCards);
  };

  useEffect(() => {
    // Vérifier la correspondance des cartes après le retournement
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;
      if (firstCard.image === secondCard.image) {
        // Les cartes correspondent, les laisser retournées
        setCards(prevCards => prevCards.map(card => {
          if (card.id === firstCard.id || card.id === secondCard.id) {
            return { ...card, isFlipped: true };
          }
          return card;
        }));
      } else {
        // Les cartes ne correspondent pas, les retourner après un court délai
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
    // Vérifier si toutes les cartes ont été retournées pour afficher un message de victoire
    if (cards.every(card => card.isFlipped)) {
      alert("Bravo ! Vous avez gagné !");
    }
  }, [cards]);

  return (
    <div className="App">
      <img src={titleImage} alt="Titre" />
      <Button className="shuffle-button" label="Mélanger" onClick={handleShuffleClick} />
      <Button className="restart-button" label="Rejouer" onClick={handleRestartClick} />
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
  );
}

export default App;
