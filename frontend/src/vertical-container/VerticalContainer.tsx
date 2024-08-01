import React from 'react';
import './VerticalContainer.css';

interface VerticalContainerProps {
    children: React.ReactNode;
    className?: string; // className prop'unu ekleyin
}

const VerticalContainer: React.FC<VerticalContainerProps> = ({ children, className }) => {
    return (
        <div className={`vertical-container ${className}`}>
            {children}
        </div>
    );
};

export default VerticalContainer;
