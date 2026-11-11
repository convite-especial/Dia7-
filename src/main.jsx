import React, {useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Canvas, useFrame} from '@react-three/fiber';
import {Float, RoundedBox, Stars} from '@react-three/drei';
import {Heart, Volume2, VolumeX, CloudRain, ArrowDown, Camera} from 'lucide-react';
import * as THREE from 'three';
import {config} from './config';
import './style.css';

const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
function Person({x,shirt='#e7a4a8',hair='#3d2829',phase=0,progress=0}){
  const group=useRef();
  useFrame(({clock})=>{
    if(!group.current)return;
    const t=clock.getElapsedTime();
    group.current.position.y = Math.abs(Math.sin(t*4+phase))*.07 + (progress>.27&&progress<.31 ? Math.sin((progress-.27)/.04*Math.PI)*.55:0);
    group.current.rotation.z = Math.sin(t*2+phase)*.035;
    group.current.rotation.y = Math.sin(t*.8+phase)*.09;
  });
  return <group ref={group} position={[x,0,0]}>
    <mesh position={[0,.58,0]} castShadow><capsuleGeometry args={[.28,.6,8,16]}/><meshStandardMaterial color={shirt} roughness={.82}/></mesh>
    <mesh position={[0,1.42,0]} castShadow><sphereGeometry args={[.39,24,24]}/><meshStandardMaterial color="#f2c7a6"/></mesh>
    <mesh position={[0,1.68,-.08]} scale={[1.05,.55,1]} castShadow><sphereGeometry args={[.39,20,20]}/><meshStandardMaterial color={hair}/></mesh>
    {[-.15,.15].map((v,i)=><mesh key={i} position={[v,1.45,.345]}><sphereGeometry args={[.028,10,10]}/><meshStandardMaterial color="#211b25"/></mesh>)}
    {[-.19,.19].map((v,i)=><mesh key={i} position={[v,.13,0]}><capsuleGeometry args={[.10,.35,6,10]}/><meshStandardMaterial color="#30354c"/></mesh>)}
    {[-.36,.36].map((v,i)=><mesh key={i} position={[v,.77,0]} rotation={[0,0,v>0?-.32:.32]}><capsuleGeometry args={[.09,.40,6,10]}/><meshStandardMaterial color="#f2c7a6"/></mesh>)}
  </group>;
}
function Rain({enabled}){
  const mesh=useRef();
  const positions=React.useMemo(()=>Float32Array.from({length:450*3},(_,i)=>i%3===0?(Math.random()-.5)*19:i%3===1?Math.random()*12-2:(Math.random()-.5)*9),[]);
  useFrame((_,dt)=>{if(!enabled||!mesh.current)return;const a=mesh.current.geometry.attributes.position;for(let i=0;i<a.count;i++){let y=a.getY(i)-dt*7;if(y<-2)y=10;a.setY(i,y)}a.needsUpdate=true;});
  if(!enabled)return null;
  return <points ref={mesh}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry><pointsMaterial color="#b8d7ff" size={.025} transparent opacity={.38}/></points>;
}
function World({progress,rain}){
  const scene=useRef();
  useFrame(({camera})=>{camera.position.x=THREE.MathUtils.lerp(camera.position.x,Math.sin(progress*Math.PI*3)*.35,.035);camera.lookAt(0,.8,0)});
  const together=clamp((progress-.19)/.19);
  const himX=-1.55+together*.9, herX=1.55-together*.9;
  return <>
    <color attach="background" args={[progress>.72?'#26344b':'#101a2a']}/>
    <fog attach="fog" args={['#101a2a',8,22]}/>
    <ambientLight intensity={1.6}/><directionalLight position={[2,7,5]} intensity={2.5} color="#ffd3a2" castShadow/>
    <pointLight position={[-3,2,1]} color="#ffb65f" intensity={22} distance={9}/>
    <Stars radius={50} depth={20} count={400} factor={2} fade speed={.3}/>
    <mesh position={[0,-.2,0]} receiveShadow><cylinderGeometry args={[6,6,.28,64]}/><meshStandardMaterial color="#253248" roughness={.94}/></mesh>
    <mesh position={[-3.1,1.3,-1]}><cylinderGeometry args={[.045,.06,2.6,12]}/><meshStandardMaterial color="#3d4151"/></mesh>
    <mesh position={[-3.1,2.62,-1]}><sphereGeometry args={[.2,16,16]}/><meshStandardMaterial color="#ffcf87" emissive="#ffad4d" emissiveIntensity={2.2}/></mesh>
    <Person x={himX} shirt="#6e9cc3" hair="#29242b" progress={progress}/>
    <Person x={herX} shirt="#d9919e" hair="#442b2b" phase={1} progress={progress}/>
    {progress>.33&&progress<.62&&<group position={[0,.25,-.5]}><mesh><cylinderGeometry args={[.75,.75,.08,32]}/><meshStandardMaterial color="#a16e56"/></mesh><mesh position={[0,-.42,0]}><cylinderGeometry args={[.07,.07,.8,12]}/><meshStandardMaterial color="#a16e56"/></mesh>{[-.26,.26].map((x,i)=><group key={i} position={[x,.17,0]}><mesh><cylinderGeometry args={[.12,.09,.25,16]}/><meshStandardMaterial color={i?'#efb5cb':'#e5c5a4'}/></mesh><mesh position={[0,.18,0]}><cylinderGeometry args={[.012,.012,.3,8]}/><meshStandardMaterial color="#f4e8d4"/></mesh></group>)}</group>}
    {progress>.78&&<Float speed={2} floatIntensity={.4}><mesh position={[0,2.55,0]} rotation={[0,0,Math.PI/4]}><boxGeometry args={[.23,.23,.12]}/><meshStandardMaterial color="#ff839e" emissive="#ff416e" emissiveIntensity={.6}/></mesh></Float>}
    <Rain enabled={rain}/>
  </>;
}
function Gallery(){return <div className="gallery">{config.photos.map((p,i)=><Photo key={i} photo={p} index={i}/>)}</div>}
function Photo({photo,index}){const [missing,setMissing]=useState(false);return <div className="photo"><div className="photo-image">{missing?<><Camera size={24}/><span>Foto {String(index+1).padStart(2,'0')}</span></>:<img src={photo.src} alt={photo.caption} loading="lazy" onError={()=>setMissing(true)}/>}</div><small>{photo.caption}</small></div>}
function useRainAudio(){const context=useRef(null),source=useRef(null);const [on,setOn]=useState(false);function toggle(){if(on){source.current?.stop();source.current?.disconnect();source.current=null;setOn(false);return;}const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const ctx=context.current||new C();context.current=ctx;ctx.resume();const buffer=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.25;const noise=ctx.createBufferSource();noise.buffer=buffer;noise.loop=true;const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=650;const gain=ctx.createGain();gain.gain.value=.18;noise.connect(filter).connect(gain).connect(ctx.destination);noise.start();source.current=noise;setOn(true);}useEffect(()=>()=>{try{source.current?.stop();context.current?.close()}catch{}},[]);return [on,toggle]}
function App(){const [progress,setProgress]=useState(0),[started,setStarted]=useState(false),[rain,toggleRain]=useRainAudio(),[showRain,setShowRain]=useState(true);useEffect(()=>{const update=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;setProgress(max>0?clamp(window.scrollY/max):0)};window.addEventListener('scroll',update,{passive:true});update();return()=>window.removeEventListener('scroll',update)},[]);
const finalText=config.ending==='proposal'?'Quer casar comigo? 💍':'Nossa história continua... ❤️';
return <main><div className="scene"><Canvas shadows dpr={[1,1.5]} camera={{position:[0,2.3,7],fov:42}} gl={{antialias:true,powerPreference:'high-performance'}}><World progress={progress} rain={showRain}/></Canvas><div className="scene-gradient"/></div>
<div className="hud"><span className="brand">✦ não foi coincidência.</span><div className="controls"><button onClick={()=>setShowRain(v=>!v)} aria-label="Alternar chuva visual" title="Chuva visual"><CloudRain size={17}/></button><button onClick={toggleRain} aria-label="Alternar som de chuva" title="Som de chuva">{rain?<Volume2 size={17}/>:<VolumeX size={17}/>}</button></div></div>
<div className="progress-track"><div style={{width:`${progress*100}%`}}/></div>
{!started&&<div className="welcome"><span className="tiny">07 DE DEZEMBRO DE 2026</span><h1>Uma história que<br/>não foi coincidência.</h1><p>Feita com amor, chuva e um pouquinho de milk-shake.</p><button onClick={()=>setStarted(true)}>Começar nossa história <Heart size={17}/></button><small>Para ouvir a chuva, toque no ícone de som.</small></div>}
<div className="story" aria-hidden={!started}>{config.chapters.map((c,i)=><section key={i} className={`chapter chapter-${i}`}><div className="chapter-content"><span className="eyebrow">{c.eyebrow}</span><h2>{c.title}</h2><p>{c.text}</p>{i===0&&<span className="scroll-hint">Deslize para descobrir <ArrowDown size={16}/></span>}{i===3&&<Gallery/>}{i===4&&<div className="ending"><Heart size={30}/><strong>{finalText}</strong><span>07.12.2023 — para sempre, um dia de cada vez.</span></div>}</div></section>)}</div>
<footer>Feito para guardar nossa história. ♥</footer></main>}

createRoot(document.getElementById('root')).render(<App/>);
