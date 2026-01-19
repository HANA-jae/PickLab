import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const apiUrl = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3001'

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="card">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">Welcome to PickLab</h1>
          <p className="text-gray-400 text-lg">Full-stack service with NestJS & React</p>
        </div>

        <div className="message-box">
          {loading && <p className="text-gray-400">Loading...</p>}
          {error && <p className="error">Error: {error}</p>}
          {message && !loading && (
            <p className="success">Backend says: {message}</p>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary w-full"
          >
            Refresh
          </button>
          
          <p className="info text-center">
            API URL: <code className="bg-gray-900 text-blue-400">{apiUrl}</code>
          </p>

          <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-300 border border-gray-700">
            <p className="font-semibold text-gray-100 mb-2">Available Endpoints:</p>
            <ul className="space-y-1">
              <li>• GET <code className="bg-gray-800 px-2 py-1 rounded text-blue-300">/</code> - Welcome message</li>
              <li>• GET <code className="bg-gray-800 px-2 py-1 rounded text-blue-300">/health</code> - Health check</li>
              <li>• Docs: <code className="bg-gray-800 px-2 py-1 rounded text-blue-300">/api</code> - Swagger API documentation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
