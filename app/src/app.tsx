import { Route, Routes } from '@solidjs/router'
import { lazy, Suspense } from 'solid-js'

import './app.module.css'

const HomePage = lazy(() => import('./pages/home'))
const EditorPage = lazy(() => import('./pages/editor'))

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
