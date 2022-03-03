import { useEffect, useRef, useState } from 'react'
import { Client } from '@livepeer/webrtmp-sdk'
import './App.css'

function App() {
  const videoInput = useRef(null)
  const stream = useRef(null)
  const inputEl = useRef(null)

  const [logsStream, setLogsStream] = useState([])

  const getLocalVideo = async () => {
    setLogsStream([])

    videoInput.current.volume = 0

    stream.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    videoInput.current.srcObject = stream.current

    videoInput.current.play()
    setLogsStream([...logsStream, 'Init local video'])
  }

  const startStream = async () => {
    const streamKey = inputEl.current.value

    setLogsStream([...logsStream, 'Start Stream'])

    if (!stream.current) {
      setLogsStream([...logsStream, 'Video stream was not started.'])
      return
    }

    if (!streamKey) {
      setLogsStream([...logsStream, 'Invalid streamKey.'])
      return
    }

    const client = new Client()

    const session = client.cast(stream.current, streamKey)

    session.on('open', () => {
      setLogsStream([...logsStream, 'Stream started.'])
      setLogsStream([
        ...logsStream,
        'Stream started; visit Livepeer Dashboard.',
      ])
    })

    session.on('close', () => {
      console.log()
      setLogsStream([...logsStream, 'Stream stopped.'])
    })

    session.on('error', (err) => {
      setLogsStream([...logsStream, `'Stream error.', ${err.message}`])
    })
  }

  useEffect(() => {
    getLocalVideo()
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="col w2">
          <div className="aspect-ratio-box">
            <div className="aspect-ratio-box-inside">
              <video ref={videoInput}></video>
            </div>
          </div>
        </div>
        <div className="col w2">
          <div>
            <h3>Local Video</h3>
            <div>
              <label htmlFor="email">Channe Name</label>
              <input
                className="App-Input"
                placeholder="Email"
                type="text"
                name="channelName"
                value={'woodland-channel'}
                readOnly
              />
              <label htmlFor="email">Stream key</label>
              <input
                className="App-Input"
                placeholder="Email"
                type="text"
                name="streamKey"
                value={'247b-872k-8ix0-wz66'}
                ref={inputEl}
                readOnly
              />
              <button onClick={() => startStream()} className="App-Btn">
                Stream
              </button>
            </div>
          </div>
        </div>
        <div className="col w1">
          <h5>Log Stream</h5>
          <ul>
            {logsStream.map((logStream, i) => (
              <li key={i}>{logStream}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
