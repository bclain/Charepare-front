import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';


const DropZone = ({ onDrop, children, className }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            onDrop(acceptedFiles);
            setIsDragOver(false); // Réinitialiser l'état ici
        },
        noClick: true, // Désactive le clic pour ouvrir le dialogue de sélection de fichier
        noKeyboard: true // Désactive l'ouverture par touche du clavier
    });

    const handleDragEnter = (e) => {
        setIsDragOver(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget.contains(e.relatedTarget)) {
            // Ignore si l'événement provient d'un enfant
            return;
        }
        setIsDragOver(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Maintenir l'état isDragOver à true ici
    };

    return (
        <div {...getRootProps()} className={`dropzone ${isDragOver ? 'drag-over ' + className : ' ' + className}`}
            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} 
            onDragOver={handleDragOver}
        >
            <input {...getInputProps()} />
            {children}
        </div>
    );
};

export default DropZone;