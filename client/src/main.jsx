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

import React from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import { StateContextProvider } from "./context";
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThirdwebProvider desiredChainId = {ChainId.Goerli}>
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider>
)