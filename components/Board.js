import React from 'react';
import Card from './Card';
import './Board.css';

const Board = ({ cards, onCardClick }) => {
  return (
    <div className="board">
      {cards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          character={card.character}
          isFlipped={card.isFlipped}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
};

export default Board;
