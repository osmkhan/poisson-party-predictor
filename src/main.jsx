import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import PartyApp from './components/PartyApp.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <PartyApp />
    </ErrorBoundary>
  </React.StrictMode>
);
// aaaa
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import PartyApp from './components/PartyApp.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <PartyApp /> {/* Use PartyApp here */}

//   </StrictMode>,
// )
