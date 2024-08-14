import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import MPT from "./RPT/pink_trombone_processor.js?worker&url"
import Tract, { RPT_Voice } from './RPT/RPT';

import './App.css'

function App() {

  const [voices, setVoices] = useState<RPT_Voice[]>([]);
  const [audioCtx, setCtx] = useState<AudioContext>();
  const [voiceCount, setVoiceCount] = useState(3);
  const [ctxInitiated, setCtxInitiated] = useState(false);
  const [ctxState, setCtxState] = useState<string>();

  useEffect(() => {
    const newCtx = new AudioContext();
    newCtx.audioWorklet.addModule(MPT).then(() => {
      console.log("audio modules added successfully");
      setCtxInitiated(true);
    });
    setCtx(newCtx);
  }, []);

  useEffect(() => {
    if (!audioCtx || !ctxInitiated) return;
    while (voices.length < voiceCount) {
      voices.push(new RPT_Voice(voices.length, audioCtx));
    }
    while (voices.length > voiceCount) {
      voices.splice(voices.length - 1, 1);
    }
    setVoices([...voices]);
    
  }, [audioCtx, voiceCount, ctxInitiated]);

  function ctxEnable() {
    audioCtx?.resume().then(() => {setCtx(audioCtx); setCtxState(audioCtx.state)});
  }

  const ctxRunning = ctxState === "running";

  return (
    <>
      <h1>React Pink Trombone</h1>
      <h2>By Yonatan Rozin <a href="https://github.com/yonatanrozin/Modular-Pink-Trombone/tree/React">
        (GitHub)</a>
      </h2>
      <p>

      </p>
      <label># of voices: 
        <input type="number" min={1} step={1} value={voiceCount} onChange={e => setVoiceCount(Number(e.target.value))} />
      </label>
      <button disabled={ctxRunning} onClick={ctxEnable}>{ctxRunning ? "Audio enabled." : "Enable Audio"}</button>
      <div id="tracts">
        {voices.map((v, i) =>
          <TractControls key={v.name} voice={v} update={setVoices} i={i}/>
        )}
      </div>
    </>
  )
}

function TractControls(props: {voice: RPT_Voice, update: Dispatch<SetStateAction<RPT_Voice[]>>, i: number}) {

  const {voice, update, i} = props;

  useEffect(() => {
    voice.connect();
    return () => voice.disconnect();
  }, []);

  function setVoiceFrequency(i: number, f: number) {
    update(prev => {
      prev[i].setFrequency(f);
      return [...prev];
    });
  }

  function setVoiceIntensity(i: number, int: number) {
    update(prev => {
      prev[i].glottis.parameters.get("intensity")!.value = int;
      return [...prev];
    });
  }

  return <div>
    <Tract voice={voice} />
    <label>Frequency
      <input type="range" step={1} min={30} max={600} 
        value={voice.glottis.parameters.get("frequency")!.value} 
        onChange={e => setVoiceFrequency(i, Number(e.target.value))}
      />
      <span>{voice.glottis.parameters.get("frequency")!.value.toFixed(2) + "Hz"}</span>
    </label>
    <label>Intensity
      <input type="range" step={.01} min={0} max={1} 
        value={voice.glottis.parameters.get("intensity")!.value} 
        onChange={e => setVoiceIntensity(i, Number(e.target.value))}
      />
      <span>{(voice.glottis.parameters.get("intensity")!.value * 100).toFixed(0) + "%"}</span>
    </label>
  </div>
}

export default App
