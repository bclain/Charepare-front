import React from 'react';
import { ReactComponent as LoadSvg } from '../LoadSvg.svg';

const Loader = () => {
    return (
        <div className='loadingAnim'>
            <LoadSvg></LoadSvg>
        </div>
    );
};

export default Loader;