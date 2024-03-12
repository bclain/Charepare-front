import React from 'react';

const Switch = ({ items, activeItem, setActiveItem }) => {
    return (
        <div className="dynamicswitch">
            {items.map(item => (
                <div
                   className={activeItem === item.id ? 'btn active' : 'btn'}
                   onClick={() => setActiveItem(item.id)}>
                    <p>{item.label}</p> 
                </div>
            ))}
        </div>
    );
};

export default Switch;