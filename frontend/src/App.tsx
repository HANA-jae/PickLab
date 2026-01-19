import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  useEffect(() => {
    const fetchMessage = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(`${apiUrl}/`)
        if (!response.ok) {
          throw new Error('Failed to fetch')
        }
        const data = await response.text()
        setMessage(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchMessage()
  }, [apiUrl])

  return (
    <>
      <div className="card">
        <h1>Welcome to PickLab</h1>
        <p>Full-stack service with NestJS & React</p>

        <div className="message-box">
          {loading && <p>Loading...</p>}
          {error && <p className="error">Error: {error}</p>}
          {message && !loading && (
            <p className="success">Backend says: {message}</p>
          )}
        </div>

        <p className="info">
          API URL: <code>{apiUrl}</code>
        </p>
      </div>
    </>
  )
}

export default App
