import "babel-core/register"
import "babel-polyfill"
import "./App.less"

import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, IndexRoute } from 'react-router-dom'

import App from './App'

render((
    <BrowserRouter>
      <App/>
    </BrowserRouter>), document.getElementById('app'))
