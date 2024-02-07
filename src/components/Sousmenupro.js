import React from 'react';

const Sousmenupro = ({ items, activeItem, setActiveItem }) => {
    return (
        <div className="sousmenupro">
            {items.map(item => (
                <a key={item.id}
                   className={activeItem === item.id ? 'active' : ''}
                   onClick={() => setActiveItem(item.id)}>
                    {item.label}
                </a>
            ))}
        </div>
    );
};

export default Sousmenupro;