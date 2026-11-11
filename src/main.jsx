import React, {useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Canvas, useFrame} from '@react-three/fiber';
import {Float, RoundedBox, Stars} from '@react-three/drei';
import {Heart, Volume2, VolumeX, CloudRain, ArrowDown, Camera} from 'lucide-react';
import * as THREE from 'three';
import {config} from './config';
import './style.css';

const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
function Person({x,shirt='#e7a4a8',hair='#3d2829',phase=0,progress=0,action='run',glasses=false}){
  const group=useRef(),leftArm=useRef(),rightArm=useRef(),leftLeg=useRef(),rightLeg=useRef();
  useFrame(({clock})=>{
    if(!group.current)return;
    const t=clock.getElapsedTime();
    const speed=action==='run'?9:action==='help'?3:1.5;
    const stride=action==='run'?.48:action==='help'?.17:.035;
    const swing=Math.sin(t*speed+phase)*stride;
    if(leftArm.current)leftArm.current.rotation.z=.23+swing;
    if(rightArm.current)rightArm.current.rotation.z=-.23-swing;
    if(leftLeg.current)leftLeg.current.rotation.x=swing;
    if(rightLeg.current)rightLeg.current.rotation.x=-swing;
    group.current.position.y=action==='run'?Math.abs(Math.sin(t*speed+phase))*.09:0;
    group.current.rotation.z=action==='fall'?-1.05:action==='help'?.12:Math.sin(t*3+phase)*.025;
    group.current.rotation.y=action==='sit'?-.18:Math.sin(t*.8+phase)*.06;
  });
  return <group position={[x,0,0]}><group ref={group}>
    <mesh position={[0,.61,0]} castShadow><capsuleGeometry args={[.29,.62,8,16]}/><meshStandardMaterial color={shirt} roughness={.82}/></mesh>
    <mesh position={[0,1.45,0]} castShadow><sphereGeometry args={[.39,24,24]}/><meshStandardMaterial color="#f2c7a6"/></mesh>
    <mesh position={[0,1.72,-.08]} scale={[1.05,.55,1]} castShadow><sphereGeometry args={[.39,20,20]}/><meshStandardMaterial color={hair}/></mesh>
    {[-.15,.15].map((v,i)=><mesh key={i} position={[v,1.45,.35]}><sphereGeometry args={[.028,10,10]}/><meshStandardMaterial color="#211b25"/></mesh>)}
    {glasses&&[-.15,.15].map((v,i)=><mesh key={'g'+i} position={[v,1.45,.38]}><torusGeometry args={[.12,.013,8,20]}/><meshStandardMaterial color="#c9a678" metalness={.5}/></mesh>)}
    <group ref={leftLeg} position={[-.19,.31,0]}><mesh position={[0,-.16,0]}><capsuleGeometry args={[.1,.32,6,10]}/><meshStandardMaterial color="#30354c"/></mesh></group>
    <group ref={rightLeg} position={[.19,.31,0]}><mesh position={[0,-.16,0]}><capsuleGeometry args={[.1,.32,6,10]}/><meshStandardMaterial color="#30354c"/></mesh></group>
    <group ref={leftArm} position={[-.36,1.01,0]}><mesh position={[-.03,-.22,0]}><capsuleGeometry args={[.09,.38,6,10]}/><meshStandardMaterial color="#f2c7a6"/></mesh></group>
    <group ref={rightArm} position={[.36,1.01,0]}><mesh position={[.03,-.22,0]}><capsuleGeometry args={[.09,.38,6,10]}/><meshStandardMaterial color="#f2c7a6"/></mesh></group>
  </group></group>;
}
function Rain({enabled}){
  const mesh=useRef();
  const positions=React.useMemo(()=>Float32Array.from({length:450*3},(_,i)=>i%3===0?(Math.random()-.5)*19:i%3===1?Math.random()*12-2:(Math.random()-.5)*9),[]);
  useFrame((_,dt)=>{if(!enabled||!mesh.current)return;const a=mesh.current.geometry.attributes.position;for(let i=0;i<a.count;i++){let y=a.getY(i)-dt*7;if(y<-2)y=10;a.setY(i,y)}a.needsUpdate=true;});
  if(!enabled)return null;
  return <points ref={mesh}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry><pointsMaterial color="#b8d7ff" size={.025} transparent opacity={.38}/></points>;
}
function World({progress,rain,chapterIndex,chapterFraction}){
  const stumble=chapterIndex===6&&chapterFraction>.31&&chapterFraction<.62;
  const falling=stumble&&chapterFraction<.46;
  const action=falling?'fall':stumble?'help':chapterIndex===5||chapterIndex===6?'sit':'run';
  const travel=Math.sin(progress*9*Math.PI)*.5;
  const himX=-.75+travel,herX=.75+travel;
  return <>
    <ambientLight intensity={2}/><directionalLight position={[2,7,5]} intensity={2.5} color="#ffd3a2"/>
    <pointLight position={[-3,2,1]} color="#ffb65f" intensity={9} distance={9}/>
    <Person x={himX} shirt="#283954" hair="#29242b" progress={progress} action={action}/>
    <Person x={herX} shirt="#943e5d" hair="#442b2b" phase={1} progress={progress} action={falling?'help':action} glasses/>
    {chapterIndex===6&&<group position={[0,.14,-.8]}><mesh><cylinderGeometry args={[.6,.6,.07,32]}/><meshStandardMaterial color="#a16e56"/></mesh>{[-.23,.23].map((x,i)=><group key={i} position={[x,.17,0]}><mesh><cylinderGeometry args={[.10,.09,.23,16]}/><meshStandardMaterial color={i?'#efb5cb':'#e5c5a4'}/></mesh><mesh position={[0,.17,0]}><cylinderGeometry args={[.012,.012,.28,8]}/><meshStandardMaterial color="#f4e8d4"/></mesh></group>)}</group>}
    <Rain enabled={rain&&chapterIndex!==5&&chapterIndex!==6}/>
  </>;
}
function Gallery(){return <div className="gallery">{config.photos.map((p,i)=><Photo key={i} photo={p} index={i}/>)}</div>}
function Photo({photo,index}){const [missing,setMissing]=useState(false);return <div className="photo"><div className="photo-image">{missing?<><Camera size={24}/><span>Foto {String(index+1).padStart(2,'0')}</span></>:<img src={photo.src} alt={photo.caption} loading="lazy" onError={()=>setMissing(true)}/>}</div><small>{photo.caption}</small></div>}
function useRainAudio(){const context=useRef(null),source=useRef(null);const [on,setOn]=useState(false);function toggle(){if(on){source.current?.stop();source.current?.disconnect();source.current=null;setOn(false);return;}const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const ctx=context.current||new C();context.current=ctx;ctx.resume();const buffer=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.25;const noise=ctx.createBufferSource();noise.buffer=buffer;noise.loop=true;const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=650;const gain=ctx.createGain();gain.gain.value=.18;noise.connect(filter).connect(gain).connect(ctx.destination);noise.start();source.current=noise;setOn(true);}useEffect(()=>()=>{try{source.current?.stop();context.current?.close()}catch{}},[]);return [on,toggle]}
function App(){const [progress,setProgress]=useState(0),[chapterIndex,setChapterIndex]=useState(0),[chapterFraction,setChapterFraction]=useState(0),[started,setStarted]=useState(false),[rain,toggleRain]=useRainAudio(),[showRain,setShowRain]=useState(true);useEffect(()=>{const update=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;setProgress(max>0?clamp(window.scrollY/max):0);const sections=[...document.querySelectorAll('.chapter')];const mid=window.scrollY+window.innerHeight*.52;let idx=sections.findIndex(el=>mid>=el.offsetTop&&mid<el.offsetTop+el.offsetHeight);if(idx<0)idx=mid<sections[0]?.offsetTop?0:sections.length-1;const sec=sections[idx];setChapterIndex(idx);setChapterFraction(sec?clamp((mid-sec.offsetTop)/sec.offsetHeight):0)};window.addEventListener('scroll',update,{passive:true});update();return()=>window.removeEventListener('scroll',update)},[]);
const finalText=config.ending==='proposal'?'Quer casar comigo? 💍':'Nossa história continua... ❤️';
return <main><div className={`memory-background ${chapterIndex===5||chapterIndex===6?'visible':''}`} aria-hidden="true"/><div className={`scene ${chapterIndex===5||chapterIndex===6?'at-memory':''}`} style={{'--runner-x':`${Math.sin(progress*10*Math.PI)*24}px`}}><Canvas dpr={[1,1.3]} camera={{position:[0,1.5,5.5],fov:43}} gl={{alpha:true,antialias:false,powerPreference:'low-power'}}><World progress={progress} rain={showRain} chapterIndex={chapterIndex} chapterFraction={chapterFraction}/></Canvas></div>
<div className="hud"><span className="brand">✦ não foi coincidência.</span><div className="controls"><button onClick={()=>setShowRain(v=>!v)} aria-label="Alternar chuva visual" title="Chuva visual"><CloudRain size={17}/></button><button onClick={toggleRain} aria-label="Alternar som de chuva" title="Som de chuva">{rain?<Volume2 size={17}/>:<VolumeX size={17}/>}</button></div></div>
<div className="progress-track"><div style={{width:`${progress*100}%`}}/></div>
{!started&&<div className="welcome"><span className="tiny">07 DE DEZEMBRO DE 2026</span><h1>Uma história que<br/>não foi coincidência.</h1><p>Feita com amor, chuva e um pouquinho de milk-shake.</p><button onClick={()=>setStarted(true)}>Começar nossa história <Heart size={17}/></button><small>Para ouvir a chuva, toque no ícone de som.</small></div>}
<div className="story" aria-hidden={!started}>{config.chapters.map((c,i)=><section key={i} className={`chapter chapter-${i}`}><div className="chapter-content"><span className="eyebrow">{c.eyebrow}</span><h2>{c.title}</h2><p>{c.text}</p>{i===6&&<span className="memory-note">Foi aqui, nas cadeirinhas vermelhas. ♡</span>}{i===0&&<span className="scroll-hint">Deslize para descobrir <ArrowDown size={16}/></span>}{c.gallery&&<Gallery/>}{c.ending&&<div className="ending"><Heart size={30}/><strong>{finalText}</strong><span>07.12.2023 — para sempre, um dia de cada vez.</span></div>}</div></section>)}</div>
<footer>Feito para guardar nossa história. ♥</footer></main>}

createRoot(document.getElementById('root')).render(<App/>);
