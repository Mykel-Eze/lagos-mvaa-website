import React from 'react';

/** 
 * @param {Object} props
 * @param {string} props.size - Size of the spinner (small, medium, large) or a custom size in px
 * @param {string} props.color - Color of the spinner
 * @param {string} props.thickness - Thickness of the spinner
 * @param {string} props.text - Optional text to display under the spinner
 * @param {boolean} props.fullScreen - Whether the spinner should take the full screen
 */
const LoadingSpinner = ({
  size = 'large',
  color = '#108A00',
  thickness = '4px',
  text = '',
  fullScreen = false
}) => {
  // Map size to pixel values
  const sizeMap = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };
  
  // Determine the final size (use predefined or custom)
  const spinnerSize = sizeMap[size] || size;
  
  // Styles for the spinner
  const spinnerStyle = {
    width: spinnerSize,
    height: spinnerSize,
    border: `${thickness} solid rgba(0, 0, 0, 0.1)`,
    borderTop: `${thickness} solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: text ? '0 auto 10px auto' : '0 auto'
  };
  
  // Styles for the container
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...(fullScreen && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      zIndex: 9999
    })
  };
  
  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={containerStyle}>
        <div style={spinnerStyle}></div>
        {text && <p style={{ margin: 0 }}>{text}</p>}
      </div>
    </>
  );
};

export default LoadingSpinner;