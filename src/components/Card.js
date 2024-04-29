import React from 'react';

const Card = ({ image, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <img src={image} alt="Carte" />
    </div>
  );
}

export default Card;
