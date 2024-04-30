import React, { useState } from 'react';

const Card = ({ image, onClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
    onClick();
  };

  return (
    <div className={`card ${isFlipped ? 'flipped' : ''}`} onClick={handleClick}>
      <img src={image} alt="Carte" />
    </div>
  );
};

export default Card;
