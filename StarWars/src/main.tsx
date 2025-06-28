import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/global.scss' // custom Sass

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="/StarWars">
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
