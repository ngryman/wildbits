import { Route, Routes } from '@solidjs/router'
import { lazy } from 'solid-js'

import './app.module.css'

const HomePage = lazy(() => import('./pages/home'))
const EditorPage = lazy(() => import('./pages/editor'))

export default function App() {
  return (
    <Routes>
      <Route path="/" component={HomePage} />
      <Route path="/:id" component={EditorPage} />
    </Routes>
  )
}
