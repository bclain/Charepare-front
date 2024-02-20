import React, { useRef } from 'react';

function FileUploadButton({ onFileSelect, txt  }) {
    const hiddenFileInput = useRef(null);

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const handleChange = (event) => {
        const file = event.target.files;
        onFileSelect(file); // Passer l'identifiant avec le fichier
    };

    return (
        <div>
            <button type="button" onClick={handleClick} className='btn-base'>
               <p>{txt}</p>
            </button>
            <input 
                type="file" 
                ref={hiddenFileInput} 
                onChange={handleChange}
                style={{display: 'none'}} 
                accept="image/*"
            />
        </div>
    );
}

export default FileUploadButton;