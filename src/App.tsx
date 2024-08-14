import { useEffect, useState } from 'react'

import './App.css'

import MPT from "./Modular-Pink-Trombone/pink_trombone_processor.js?worker&url"
import { RPT_Voice } from './Modular-Pink-Trombone/RPT';

const audioCtx = new AudioContext();


function App() {

  const [voices, setVoices] = useState<RPT_Voice[]>([]);

  useEffect(() => {
    audioCtx.audioWorklet.addModule(MPT).then(() => {
      setVoices(new Array(5).fill(undefined).map((_, i) => {
        const newVoice = new RPT_Voice(i, audioCtx);
        newVoice.connect()
        return newVoice;
      }));
      console.log("audio modules added successfully");
    })
  }, []);

  function setVoiceFrequency(i: number, f: number) {
    voices[i].setFrequency(f);
    setVoices([...voices]);
  }

  return (
    <>
      {voices.map((v, i) =>
        <input key={v.name} type="range" step={1}
        value={v.glottis.parameters.get("frequency")!.value} 
        min={30} max={600} 
        onChange={e => setVoiceFrequency(i, Number(e.target.value))}/>
      )}
      <button onClick={() => audioCtx.resume()}>Enable</button>
    </>
  )
}

export default App
