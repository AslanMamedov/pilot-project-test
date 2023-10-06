import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import 'react-tabulator/lib/css/tabulator_bootstrap4.min.css';
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
