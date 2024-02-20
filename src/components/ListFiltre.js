import React from 'react';

const ListFiltre = ({ filters, setFilter, titre, direct }) => {
    return (
        <div className={direct + ' filtre '}>
            <p className='desc'>{titre}</p>
            {direct=='verti' && <span className=''></span>}
            {filters.map((filter, index) => (
                <React.Fragment key={index}>
                    {direct!='verti' &&index > 0 && <span className='verti'></span>}
                    <a className={filter.active ? 'active' : ''}
                       onClick={() => setFilter(filter.name)}>
                        {filter.label}
                    </a>
                </React.Fragment>
            ))}
        </div>
    );
};

export default ListFiltre;