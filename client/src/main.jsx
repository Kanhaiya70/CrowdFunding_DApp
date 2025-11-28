// import React from "react";
// import { createRoot } from "react-dom/client";
// import { App } from "./App";
// import { ThirdwebProvider } from "thirdweb/react";
// import "./index.css";

// createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <ThirdwebProvider>
//       <App />
//     </ThirdwebProvider>
//   </React.StrictMode>
// );

// import React from "react";
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
// import { StateContextProvider } from "./context";
// import App from './App';
// import './index.css';

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//   <ThirdwebProvider desiredChainId = {ChainId.Sepolia}>
//     <Router>
//       <StateContextProvider>
//         <App />
//       </StateContextProvider>
//     </Router>
//   </ThirdwebProvider>
// )

import React from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { Sepolia } from "@thirdweb-dev/chains";
import { ThemeProvider } from "./context/ThemeContext";
import { StateContextProvider } from "./context";
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThirdwebProvider 
    clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}
    activeChain={Sepolia}
  >
    <Router>
      <ThemeProvider>
      <StateContextProvider>
        <App />
      </StateContextProvider>
      </ThemeProvider>
    </Router>
  </ThirdwebProvider>
);
