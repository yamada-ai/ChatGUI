// import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import './index.css'


// createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

const container = document.getElementById('root') as HTMLInputElement;
const root = createRoot(container);
root.render(<App />);