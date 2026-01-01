import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <div className="m-[2vw]">
              <h1 className="text-2xl font-bold">Welcome</h1>
              <p className="text-muted-foreground mt-2">Your content goes here</p>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
