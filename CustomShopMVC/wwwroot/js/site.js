import $ from 'jquery';
import 'bootstrap';

// REACT //
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

import authComponents from './react/authComponents.jsx'
import adminPanelComponents from './react/adminPanelComponents.jsx';
import globalComponents from './react/globalComponents.jsx';

// any css-in-js or other libraries you want to use server-side
//import { ServerStyleSheet } from 'styled-components';
//import { renderStylesToString } from 'emotion-server';
//import Helmet from 'react-helmet';

global.React = React;
global.ReactDOM = ReactDOM;
global.ReactDOMServer = ReactDOMServer;

//global.Styled = { ServerStyleSheet };
//global.Helmet = Helmet;

global.Components = { authComponents, adminPanelComponents, globalComponents };

// END REACT //