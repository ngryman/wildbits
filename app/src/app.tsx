import { Route, Routes } from '@solidjs/router'
import { Suspense } from 'solid-js'

import HomePage from './pages/home'
import EditorPage from './pages/editor'
// TODO: lazy load less accessed pages

import './app.module.css'

export default function App() {
  return (
    <Suspense>
      <Routes>
        <Route path="/" component={HomePage} />
        <Route path="/:id" component={EditorPage} />
      </Routes>
    </Suspense>
  )
}
