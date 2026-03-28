import { useState, useEffect } from "react";

const LIGHT = {
  zwart:"#000000",wit:"#ffffff",geel:"#d9a300",grijs:"#878786",
  blauw:"#006f9d",rood:"#c22d0b",groen:"#007b2f",oranje:"#c97b1a",
  lichtgrijs:"#f4f3f1",zachtgrijs:"#e8e7e4",bg:"#fafaf9",
  // dark mode specifics
  header:"#d9a300",headerTxt:"#000000",headerSub:"#00000088",headerDiv:"#00000033",
  kaart:"#ffffff",kaartBorder:"#e8e7e4",
  panelBg:"#ffffff",
  selBg:"#ffffff",
  footerBg:"#ffffff",
  txtPrimary:"#000000",txtSecondary:"#878786",
  devSelBg:"#000000",devSelTxt:"#ffffff",devSelBorder:"#d9a300",
  devHlBg:"#e8f5e9",devHlBorder:"#007b2f",
  modalBg:"#ffffff",modalOverlay:"rgba(0,0,0,0.4)",
  inputBorder:"#e8e7e4",
  badgeBg:"#2a2a2a",badgeTxt:"#ffffff",
};

const DARK = {
  zwart:"#000000",wit:"#ffffff",geel:"#d9a300",grijs:"#999999",
  blauw:"#4dabcf",rood:"#e85d3a",groen:"#2ea852",oranje:"#e0a030",
  lichtgrijs:"#2a2a2a",zachtgrijs:"#3a3a3a",bg:"#1a1a1a",
  header:"#252525",headerTxt:"#ffffff",headerSub:"#ffffff66",headerDiv:"#ffffff22",
  kaart:"#252525",kaartBorder:"#3a3a3a",
  panelBg:"#1e1e1e",
  selBg:"#222222",
  footerBg:"#1e1e1e",
  txtPrimary:"#e8e8e8",txtSecondary:"#999999",
  devSelBg:"#d9a300",devSelTxt:"#000000",devSelBorder:"#d9a300",
  devHlBg:"#1a3a1a",devHlBorder:"#2ea852",
  modalBg:"#2a2a2a",modalOverlay:"rgba(0,0,0,0.7)",
  inputBorder:"#4a4a4a",
  badgeBg:"#d9a300",badgeTxt:"#000000",
};

const BC_LIGHT="#2a2a2a";
const BC_DARK="#d9a300";

let C = LIGHT;
let BC = BC_LIGHT;
const F="'Rubik','Helvetica Neue',sans-serif";

const getStages=()=>[
  {id:"matches",label:"Potentiële matches",short:"Match",sub:"Kans + ontwikkelaar",color:C.grijs,bg:C.kaart=="#ffffff"?"#f0efed":"#2a2a2a",needsMin2:true,addLabel:"+ Match"},
  {id:"verkennend",label:"Verkennende gesprekken",short:"Verkennend",sub:"Gesprekken lopen",color:C.geel,bg:C.kaart=="#ffffff"?"#fdf8ec":"#2d2816",needsMin2:true,addLabel:"+ Verkennend gesprek"},
  {id:"offerte",label:"Offertetraject",short:"Offerte",sub:"Concreet verzoek",color:C.blauw,bg:C.kaart=="#ffffff"?"#edf5f9":"#1a2830",needsMin2:false,addLabel:"+ Offertetraject"},
  {id:"actief",label:"Lopend werk",short:"Werk",sub:"In uitvoering",color:C.groen,bg:C.kaart=="#ffffff"?"#edf6ef":"#1a2e1e",needsMin2:false,addLabel:null},
];
const FUNCTIE=["Wonen","Kantoor","Gemengd","Bedrijven","Collectief","Retail","Zorg","Anders"];
const uid=()=>Math.random().toString(36).substring(2,9);

const I_DT=[
  {id:"t1",label:"Puur sang",short:"PS",so:0},{id:"t2",label:"Ontw. bouwer",short:"OB",so:1},
  {id:"t3",label:"Investeerder",short:"IN",so:2},{id:"t4",label:"Gebiedsontwikkelaar",short:"GO",so:3},
  {id:"t5",label:"CPO / Zelfbouw",short:"CP",so:4},
];
const I_KC=[{id:"c1",label:"Rotterdam",so:0},{id:"c2",label:"Schiedam",so:1},{id:"c3",label:"Vlaardingen",so:2}];
const I_D=[
  {id:"d1",name:"Van Wijnen",tid:"t2",schaal:"M-XL",contact:"",notitie:"",so:0},
  {id:"d2",name:"BPD",tid:"t1",schaal:"L-XL",contact:"",notitie:"",so:0},
  {id:"d3",name:"Synchroon",tid:"t1",schaal:"M-L",contact:"",notitie:"",so:1},
  {id:"d4",name:"Heijmans",tid:"t2",schaal:"L-XL",contact:"",notitie:"",so:1},
  {id:"d5",name:"AM Grondbedrijf",tid:"t4",schaal:"XL",contact:"",notitie:"",so:0},
  {id:"d6",name:"Certitudo Capital",tid:"t3",schaal:"M-L",contact:"",notitie:"",so:0},
  {id:"d7",name:"Slokker Bouwgroep",tid:"t2",schaal:"S-M",contact:"",notitie:"",so:2},
];
const I_K=[
  {id:"k1",name:"Maashaven Zuid",cid:"c1",adres:"Maashaven Zuidzijde, Rotterdam",omvang:"12.000",type:"Gemengd",notitie:"Gemeente positief",contact:"Jan de Vries",so:0},
  {id:"k2",name:"Schiedamseweg 45",cid:"c2",adres:"Schiedamseweg 45, Schiedam",omvang:"800",type:"Wonen",notitie:"",contact:"",so:0},
  {id:"k3",name:"Merwe-Vierhavens",cid:"c1",adres:"Vierhavensstraat, Rotterdam",omvang:"4.500",type:"Gemengd",notitie:"CPO mogelijk",contact:"Lisa Bakker",so:1},
  {id:"k4",name:"Kantoor Weena",cid:"c1",adres:"Weena, Rotterdam",omvang:"6.000",type:"Wonen",notitie:"Transformatie",contact:"Piet Jansen",so:2},
  {id:"k5",name:"Nieuwe Binnenweg",cid:"c1",adres:"Nieuwe Binnenweg, Rotterdam",omvang:"450",type:"Wonen",notitie:"",contact:"",so:3},
  {id:"k6",name:"Broersveld",cid:"c2",adres:"Broersveld, Schiedam",omvang:"1.200",type:"Gemengd",notitie:"",contact:"",so:1},
];
const I_M=[
  {id:"m1",kid:"k1",links:["d2","d5"],coals:[],stage:"verkennend",notitie:"Eerste gesprek",col:false,so:0},
  {id:"m2",kid:"k4",links:[],coals:[["d4","d6"]],stage:"actief",notitie:"Loopt",col:false,so:0},
  {id:"m3",kid:"k3",links:["d3"],coals:[],stage:"matches",notitie:"",col:false,so:0},
];

const maps=a=>a?`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a)}`:null;
const coalIds=m=>{const s=new Set();(m.coals||[]).forEach(c=>c.forEach(id=>s.add(id)));return s;};
const indivL=m=>{const ci=coalIds(m);return m.links.filter(id=>!ci.has(id));};
const totalL=m=>indivL(m).length+(m.coals||[]).length;
const mDevIds=m=>{const s=new Set(m.links);(m.coals||[]).forEach(c=>c.forEach(id=>s.add(id)));return s;};
const needsA=m=>{const s=getStages().find(x=>x.id===m.stage);return s&&s.needsMin2&&totalL(m)<2;};
const aLevel=m=>{if(!needsA(m))return"ok";return totalL(m)===0?"rood":"oranje";};

const bS=(bg,c)=>({padding:"8px 16px",fontSize:12,fontWeight:500,background:bg,color:c||C.wit,border:"none",borderRadius:3,cursor:"pointer",fontFamily:F});
const getIS=()=>({width:"100%",padding:"8px 10px",fontSize:13,border:`1px solid ${C.inputBorder||C.zachtgrijs}`,borderRadius:3,fontFamily:F,boxSizing:"border-box",color:C.txtPrimary,background:C.kaart});

const Badge=({s,sz=22})=><span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:sz,height:sz,borderRadius:2,background:BC,color:BC===BC_DARK?C.zwart:C.wit,fontSize:sz<22?9:10,fontFamily:F,fontWeight:500,flexShrink:0,letterSpacing:0.5}}>{s||"?"}</span>;

const Modal=({open,onClose,title,children,w=480})=>{
  if(!open)return null;
  return <div onClick={onClose} style={{position:"fixed",inset:0,background:C.modalOverlay,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div onClick={e=>e.stopPropagation()} style={{background:C.modalBg,borderRadius:6,width:"100%",maxWidth:w,maxHeight:"85vh",overflow:"auto",boxShadow:"0 24px 64px rgba(0,0,0,0.3)",color:C.txtPrimary}}>
      <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.zachtgrijs}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h3 style={{margin:0,fontSize:16,fontWeight:500,fontFamily:F}}>{title}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:C.grijs}}>✕</button>
      </div>
      <div style={{padding:20}}>{children}</div>
    </div>
  </div>;
};
const Fl=({label,children})=><div style={{marginBottom:14}}><label style={{fontSize:10,fontWeight:500,color:C.txtSecondary,display:"block",marginBottom:4,letterSpacing:1,textTransform:"uppercase",fontFamily:F}}>{label}</label>{children}</div>;

const CoalModal=({open,devs,dts,onClose,onSave,init=[]})=>{
  const [sel,setSel]=useState([]);
  useEffect(()=>{if(open)setSel(init||[]);},[open]);
  if(!open)return null;
  return <Modal open={true} onClose={onClose} title={init.length?"Coalitie bewerken":"Coalitie vormen"} w={420}>
    <div style={{maxHeight:250,overflowY:"auto",border:`1px solid ${C.zachtgrijs}`,borderRadius:3,padding:6,marginBottom:14}}>
      {devs.map(d=>{const ch=sel.includes(d.id);const dt=dts.find(t=>t.id===d.tid);
        return <div key={d.id} onClick={()=>setSel(s=>ch?s.filter(x=>x!==d.id):[...s,d.id])} style={{display:"flex",alignItems:"center",gap:7,padding:"6px",cursor:"pointer",borderRadius:3,fontSize:13,background:ch?`${C.geel}15`:"transparent"}}>
          <div style={{width:16,height:16,borderRadius:2,border:`2px solid ${ch?C.geel:C.zachtgrijs}`,background:ch?C.geel:"transparent",color:C.zwart,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600}}>{ch&&"✓"}</div>
          <Badge s={dt?.short} sz={20}/><span style={{fontWeight:ch?500:300}}>{d.name}</span>
        </div>;
      })}
    </div>
    <div style={{display:"flex",justifyContent:"flex-end",gap:6}}>
      <button onClick={onClose} style={bS(C.lichtgrijs,C.grijs)}>Annuleer</button>
      <button onClick={()=>{if(sel.length>=2){onSave(sel);onClose();}}} disabled={sel.length<2} style={{...bS(sel.length>=2?C.geel:C.zachtgrijs,sel.length>=2?C.zwart:C.grijs),cursor:sel.length>=2?"pointer":"not-allowed"}}>{init.length?"Opslaan":"Coalitie"} ({sel.length})</button>
    </div>
  </Modal>;
};

const MkMatchModal=({open,kans,devs,dts,onClose,onSave})=>{
  const [sel,setSel]=useState([]);
  useEffect(()=>{if(open)setSel([]);},[open]);
  if(!open||!kans)return null;
  return <Modal open={true} onClose={onClose} title={`Match: ${kans.name}`} w={440}>
    <p style={{fontSize:12,color:C.grijs,marginBottom:10,fontWeight:300}}>Koppel minimaal 1 ontwikkelaar.</p>
    <div style={{maxHeight:250,overflowY:"auto",border:`1px solid ${C.zachtgrijs}`,borderRadius:3,padding:6,marginBottom:14}}>
      {devs.map(d=>{const ch=sel.includes(d.id);const dt=dts.find(t=>t.id===d.tid);
        return <div key={d.id} onClick={()=>setSel(s=>ch?s.filter(x=>x!==d.id):[...s,d.id])} style={{display:"flex",alignItems:"center",gap:7,padding:"6px",cursor:"pointer",borderRadius:3,fontSize:13,background:ch?`${C.geel}15`:"transparent"}}>
          <div style={{width:16,height:16,borderRadius:2,border:`2px solid ${ch?C.geel:C.zachtgrijs}`,background:ch?C.geel:"transparent",color:C.zwart,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600}}>{ch&&"✓"}</div>
          <Badge s={dt?.short} sz={20}/><span style={{fontWeight:ch?500:300}}>{d.name}</span>
          <span style={{fontSize:10,color:C.grijs,marginLeft:"auto"}}>{d.schaal}</span>
        </div>;
      })}
    </div>
    <div style={{display:"flex",justifyContent:"flex-end",gap:6}}>
      <button onClick={onClose} style={bS(C.lichtgrijs,C.grijs)}>Annuleer</button>
      <button onClick={()=>{if(sel.length>=1){onSave(kans.id,sel);onClose();}}} disabled={sel.length<1} style={{...bS(sel.length>=1?C.geel:C.zachtgrijs,sel.length>=1?C.zwart:C.grijs),cursor:sel.length>=1?"pointer":"not-allowed"}}>Match ({sel.length})</button>
    </div>
  </Modal>;
};

const NewDTForm=({onSave,onCancel})=>{
  const [nl,setNl]=useState("");const [ns,setNs]=useState("");
  return <div>
    <Fl label="Label"><input style={iS} value={nl} onChange={e=>setNl(e.target.value)} placeholder="Bijv. Puur sang"/></Fl>
    <Fl label="Afkorting (2)"><input style={iS} maxLength={2} value={ns} onChange={e=>setNs(e.target.value.toUpperCase())} placeholder="PS"/></Fl>
    <div style={{display:"flex",justifyContent:"flex-end",gap:6,marginTop:14}}>
      <button onClick={onCancel} style={bS(C.lichtgrijs,C.grijs)}>Annuleer</button>
      <button onClick={()=>onSave(nl,ns)} disabled={!nl} style={{...bS(nl?C.zwart:C.zachtgrijs,nl?C.wit:C.grijs),cursor:nl?"pointer":"not-allowed"}}>Klaar</button>
    </div>
  </div>;
};

const NewKCForm=({onSave,onCancel})=>{
  const [nl,setNl]=useState("");
  return <div>
    <Fl label="Naam"><input style={iS} value={nl} onChange={e=>setNl(e.target.value)} placeholder="Bijv. Rotterdam"/></Fl>
    <div style={{display:"flex",justifyContent:"flex-end",gap:6,marginTop:14}}>
      <button onClick={onCancel} style={bS(C.lichtgrijs,C.grijs)}>Annuleer</button>
      <button onClick={()=>onSave(nl)} disabled={!nl} style={{...bS(nl?C.zwart:C.zachtgrijs,nl?C.wit:C.grijs),cursor:nl?"pointer":"not-allowed"}}>Klaar</button>
    </div>
  </div>;
};

// ════════════════════════════
export default function App(){
  const [dark,setDark]=useState(false);
  C=dark?DARK:LIGHT;
  BC=dark?BC_DARK:BC_LIGHT;
  const STAGES=getStages();
  const iS=getIS();

  const [dts,setDts]=useState(I_DT);
  const [kcs,setKcs]=useState(I_KC);
  const [devs,setDevs]=useState(I_D);
  const [kansen,setKansen]=useState(I_K);
  const [ms,setMs]=useState(I_M);

  const [selDev,setSelDev]=useState(null);
  const [selKans,setSelKans]=useState(null);
  const [selMatch,setSelMatch]=useState(null);
  const [dragging,setDragging]=useState(null);
  const [draggingKans,setDraggingKans]=useState(null);
  const [collapsedK,setCollapsedK]=useState(new Set());
  const [dragOver,setDragOver]=useState(null);
  const [dragKansen,setDragKansen]=useState(false);

  const [eDev,setEDev]=useState(null);
  const [eKans,setEKans]=useState(null);
  const [eMatch,setEMatch]=useState(null);
  const [eDT,setEDT]=useState(null);
  const [eKC,setEKC]=useState(null);
  const [mkMatch,setMkMatch]=useState(null);
  const [mkMatchStage,setMkMatchStage]=useState(null);
  const [coalM,setCoalM]=useState(null);
  const [cfDel,setCfDel]=useState(null);
  const [showAl,setShowAl]=useState(false);

  const sDts=[...dts].sort((a,b)=>a.so-b.so);
  const sKcs=[...kcs].sort((a,b)=>a.so-b.so);
  const matchCountForKans=kid=>ms.filter(m=>m.kid===kid).length;
  const unmatched=kansen.filter(k=>!ms.some(m=>m.kid===k.id));

  const alarms=[];
  ms.forEach(m=>{if(needsA(m)){const k=kansen.find(x=>x.id===m.kid);const tl=totalL(m);alarms.push({m,k,msg:`"${k?.name||"?"}" — ${tl===0?"geen match":"1 match"} (minstens 2 nodig)`,lv:tl===0?"rood":"oranje"});}});

  const devHl=dId=>{if(!selMatch)return null;const m=ms.find(x=>x.id===selMatch);return m?mDevIds(m).has(dId):null;};
  const matchHl=mId=>{
    if(selDev){const m=ms.find(x=>x.id===mId);return m?mDevIds(m).has(selDev):null;}
    if(selKans){const m=ms.find(x=>x.id===mId);return m?m.kid===selKans:null;}
    return null;
  };

  const clr=()=>{setSelDev(null);setSelKans(null);setSelMatch(null);};

  // Reorder helper
  const reorder=(arr,setArr,id,dir)=>{
    const sorted=[...arr].sort((a,b)=>a.so-b.so);
    const idx=sorted.findIndex(x=>x.id===id);
    const newIdx=idx+dir;
    if(newIdx<0||newIdx>=sorted.length)return;
    const newArr=sorted.map((x,i)=>({...x,so:i}));
    [newArr[idx].so,newArr[newIdx].so]=[newArr[newIdx].so,newArr[idx].so];
    setArr(prev=>prev.map(p=>{const u=newArr.find(n=>n.id===p.id);return u?{...p,so:u.so}:p;}));
  };

  const mkM=(kid,dIds,stage="matches")=>{setMs(p=>[...p,{id:`m_${uid()}`,kid,links:dIds,coals:[],stage,notitie:"",col:false,so:p.filter(m=>m.stage===stage).length}]);};
  const moveM=(id,st)=>setMs(p=>p.map(m=>m.id===id?{...m,stage:st,so:p.filter(x=>x.stage===st).length}:m));
  const unmatchM=id=>{setMs(p=>p.filter(m=>m.id!==id));setDragKansen(false);};
  const updM=(id,u)=>setMs(p=>p.map(m=>m.id===id?{...m,...u}:m));
  const rmM=id=>{setMs(p=>p.filter(m=>m.id!==id));setEMatch(null);setCfDel(null);};
  const togML=(mid,did)=>setMs(p=>p.map(m=>{if(m.id!==mid)return m;const h=m.links.includes(did);return{...m,links:h?m.links.filter(l=>l!==did):[...m.links,did]};}));
  const saveCoal=(mid,idx,ids)=>setMs(p=>p.map(m=>{if(m.id!==mid)return m;const c=[...(m.coals||[])];if(idx===null)c.push(ids);else c[idx]=ids;return{...m,coals:c};}));
  const rmCoal=(mid,idx)=>{setMs(p=>p.map(m=>{if(m.id!==mid)return m;const c=[...(m.coals||[])];c.splice(idx,1);return{...m,coals:c};}));setCfDel(null);};
  const colAll=(st,v)=>setMs(p=>p.map(m=>m.stage===st?{...m,col:v}:m));

  const addDev=()=>{const n={id:`d_${uid()}`,name:"",tid:dts[0]?.id||"",schaal:"",contact:"",notitie:"",so:devs.filter(d=>d.tid===(dts[0]?.id||"")).length};setDevs(p=>[...p,n]);setEDev(n.id);};
  const addKans=cid=>{const n={id:`k_${uid()}`,name:"",cid:cid||"",adres:"",omvang:"",type:"Wonen",notitie:"",contact:"",so:kansen.filter(k=>k.cid===cid).length};setKansen(p=>[...p,n]);setEKans(n.id);};
  const rmDev=id=>{setDevs(p=>p.filter(d=>d.id!==id));setMs(p=>p.map(m=>({...m,links:m.links.filter(l=>l!==id),coals:(m.coals||[]).map(c=>c.filter(x=>x!==id)).filter(c=>c.length>0)})));setEDev(null);setCfDel(null);};
  const rmKans=id=>{setKansen(p=>p.filter(k=>k.id!==id));setMs(p=>p.filter(m=>m.kid!==id));setEKans(null);setCfDel(null);};
  const addDT=()=>{setEDT("new");};
  const saveDT=(label,short)=>{if(!label)return;const n={id:`dt_${uid()}`,label,short:short.toUpperCase(),so:dts.length};setDts(p=>[...p,n]);setEDT(null);};
  const rmDT=id=>{setDts(p=>p.filter(t=>t.id!==id));setDevs(p=>p.map(d=>d.tid===id?{...d,tid:""}:d));setEDT(null);setCfDel(null);};
  const addKC=()=>{setEKC("new");};
  const saveKC=(label)=>{if(!label)return;const n={id:`kc_${uid()}`,label,so:kcs.length};setKcs(p=>[...p,n]);setEKC(null);};
  const rmKC=id=>{setKcs(p=>p.filter(c=>c.id!==id));setKansen(p=>p.map(k=>k.cid===id?{...k,cid:""}:k));setEKC(null);setCfDel(null);};

  const edDev=devs.find(d=>d.id===eDev);
  const edKans=kansen.find(k=>k.id===eKans);
  const edMatch=ms.find(m=>m.id===eMatch);
  const edDT=dts.find(t=>t.id===eDT);
  const edKC=kcs.find(c=>c.id===eKC);
  const coalMatch=coalM?ms.find(m=>m.id===coalM.mid):null;
  const coalInit=coalM&&coalM.idx!==null&&coalMatch?(coalMatch.coals||[])[coalM.idx]||[]:[];
  const selName=selDev?devs.find(d=>d.id===selDev)?.name:selKans?kansen.find(k=>k.id===selKans)?.name:selMatch?(()=>{const m=ms.find(x=>x.id===selMatch);return kansen.find(k=>k.id===m?.kid)?.name;})():null;

  return(
    <div style={{fontFamily:F,background:C.bg,minHeight:"100vh",display:"flex",flexDirection:"column",color:C.txtPrimary}}>
      <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}[data-noprint]{display:none!important}}*{box-sizing:border-box}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${C.zachtgrijs};border-radius:3px}`}</style>

      {/* HEADER */}
      <div style={{background:C.header,color:C.headerTxt,padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:18}}>
          <div><div style={{fontSize:26,fontWeight:700,letterSpacing:3}}>ARD</div><div style={{fontSize:8,fontWeight:300,letterSpacing:2,color:C.headerSub,marginTop:2}}>ATELIERRUIMDENKERS</div></div>
          <div style={{width:1,height:32,background:C.headerDiv}}/>
          <div><div style={{fontSize:9,fontWeight:300,letterSpacing:2,color:C.headerSub,textTransform:"uppercase"}}>Acquisitie</div><h1 style={{fontSize:20,fontWeight:300,margin:"2px 0 0"}}>De Koppelbaas</h1></div>
        </div>
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          {[{v:devs.length,l:"devs"},{v:kansen.length,l:"kansen"},{v:ms.length,l:"matches"}].map(x=>(
            <div key={x.l} style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:500}}>{x.v}</div><div style={{fontSize:8,color:C.headerSub,letterSpacing:1,textTransform:"uppercase",fontWeight:300}}>{x.l}</div></div>
          ))}
          <button onClick={()=>setShowAl(true)} data-noprint style={{...bS(alarms.length>0?C.rood:dark?"#444":"#000"),fontSize:11}}>⚠ {alarms.length} alert{alarms.length!==1?"s":""}</button>
          <button onClick={()=>setDark(!dark)} data-noprint style={{...bS(dark?"#444":"#000",dark?"#fff":"#fff"),fontSize:11}}>{dark?"☀":"☾"}</button>
          <button onClick={()=>window.print()} data-noprint style={{...bS(dark?"#444":"#000"),fontSize:11}}>Print</button>
        </div>
      </div>

      <div style={{background:C.selBg,borderBottom:`1px solid ${C.zachtgrijs}`,padding:"6px 24px",minHeight:34,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {selName&&<span style={{fontSize:12}}><span style={{color:C.geel,fontWeight:500}}>/ </span>{selName}</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}} data-noprint>
          {(()=>{
            const allMFolded=ms.length>0&&ms.every(m=>m.col);
            const allKFolded=unmatched.length>0&&unmatched.every(k=>collapsedK.has(k.id));
            const allFolded=allMFolded&&allKFolded;
            return <button onClick={()=>{
              setMs(p=>p.map(m=>({...m,col:!allFolded})));
              setCollapsedK(p=>{const n=new Set(p);unmatched.forEach(k=>{if(allFolded)n.delete(k.id);else n.add(k.id);});return n;});
            }} style={{...bS(C.lichtgrijs,C.grijs),fontSize:10,padding:"3px 12px",display:"flex",alignItems:"center",gap:4}}>
              <span style={{fontSize:13}}>{allFolded?"▸":"▾"}</span> {allFolded?"Alles uitklappen":"Alles inklappen"}
            </button>;
          })()}
          {selName&&<button onClick={clr} style={{...bS(C.lichtgrijs,C.grijs),fontSize:10,padding:"3px 10px"}}>✕ Reset</button>}
        </div>
      </div>

      {/* MAIN */}
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>

        {/* ═══ LEFT ═══ */}
        <div style={{width:500,flexShrink:0,display:"flex",borderRight:`2px solid ${C.zachtgrijs}`}}>

          {/* DEVS */}
          <div style={{width:250,borderRight:`1px solid ${C.zachtgrijs}`,background:C.panelBg,overflowY:"auto",padding:"14px 10px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <span style={{fontSize:13,letterSpacing:1,textTransform:"uppercase",fontWeight:500}}>Ontwikkelaars</span>
              <button onClick={addDev} data-noprint style={{...bS(C.zwart),fontSize:10,padding:"3px 8px"}}>+ Nieuw</button>
            </div>
            <div style={{fontSize:10,color:C.grijs,marginBottom:14,fontWeight:300}}>Klik om koppelingen te zien.</div>

            {sDts.map((type,ti)=>{
              const td=devs.filter(d=>d.tid===type.id).sort((a,b)=>a.so-b.so);
              return <div key={type.id} style={{marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:6}}>
                  <Badge s={type.short} sz={24}/>
                  <span style={{fontSize:14,fontWeight:600,flex:1}}>{type.label||"Naamloos"}</span>
                  <button onClick={()=>setEDT(type.id)} data-noprint style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.grijs,fontFamily:F}}>✎</button>
                </div>
                {td.map((dev,di)=>{
                  const isSel=selDev===dev.id;const hl=devHl(dev.id);
                  const cnt=ms.filter(m=>mDevIds(m).has(dev.id)).length;
                  let bg="transparent",col=C.txtPrimary,op=1,bl="3px solid transparent",shadow="none";
                  if(cnt===0&&!isSel&&hl!==true)bl=`3px solid ${C.rood}`;
                  if(isSel){bg=C.devSelBg;col=C.devSelTxt;bl=`3px solid ${C.devSelBorder}`;}
                  else if(hl===true){bg=C.devHlBg;bl=`3px solid ${C.devHlBorder}`;shadow=`0 0 0 1px ${C.devHlBorder}22`;}
                  else if(hl===false)op=0.15;
                  return <div key={dev.id} onClick={()=>{clr();setSelDev(isSel?null:dev.id);}} style={{
                    padding:"7px 10px",marginLeft:28,marginBottom:2,borderRadius:3,background:bg,color:col,
                    cursor:"pointer",transition:"all 0.12s",display:"flex",justifyContent:"space-between",alignItems:"center",
                    borderLeft:bl,opacity:op,boxShadow:shadow,
                  }}>
                    <div><div style={{fontWeight:400,fontSize:13,color:col}}>{dev.name||"Naamloos"}</div>{dev.schaal&&<div style={{fontSize:10,color:isSel?"#999":C.txtSecondary,fontWeight:300}}>{dev.schaal}</div>}</div>
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      <span style={{fontSize:11,fontWeight:500,color:isSel?"#999":cnt===0?C.rood:C.txtPrimary,background:isSel?"transparent":cnt===0?`${C.rood}10`:C.lichtgrijs,padding:"1px 5px",borderRadius:3}}>{cnt}×</span>
                      <button onClick={e=>{e.stopPropagation();setEDev(dev.id);}} data-noprint style={{background:isSel?C.devSelBg+"88":C.lichtgrijs,border:"none",cursor:"pointer",fontSize:12,color:isSel?C.devSelTxt:C.grijs,padding:"2px 6px",borderRadius:3,fontFamily:F}}>✎</button>
                    </div>
                  </div>;
                })}
                {td.length===0&&<div style={{marginLeft:28,fontSize:10,color:C.zachtgrijs,fontStyle:"italic"}}>Geen</div>}
              </div>;
            })}
            {devs.filter(d=>!dts.find(t=>t.id===d.tid)).length>0&&<div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.grijs,fontStyle:"italic",marginBottom:4}}>Geen categorie</div>
              {devs.filter(d=>!dts.find(t=>t.id===d.tid)).map(dev=>(
                <div key={dev.id} onClick={()=>{clr();setSelDev(selDev===dev.id?null:dev.id);}} style={{padding:"6px 8px",marginBottom:2,borderRadius:3,cursor:"pointer",fontSize:12,display:"flex",justifyContent:"space-between",borderLeft:`3px solid ${C.rood}`}}>
                  <span>{dev.name||"Naamloos"}</span>
                  <button onClick={e=>{e.stopPropagation();setEDev(dev.id);}} data-noprint style={{background:C.lichtgrijs,border:"none",cursor:"pointer",fontSize:11,color:C.grijs,padding:"2px 5px",borderRadius:3,fontFamily:F}}>✎</button>
                </div>
              ))}
            </div>}
            <button onClick={addDT} data-noprint style={{...bS(C.lichtgrijs,C.grijs),fontSize:10,padding:"4px 10px",width:"100%",marginTop:4}}>+ Categorie</button>
          </div>

          {/* KANSEN */}
          <div style={{width:250,background:C.panelBg,overflowY:"auto",padding:"14px 10px"}}
            onDragOver={e=>{e.preventDefault();setDragKansen(true);}} onDragLeave={()=>setDragKansen(false)}
            onDrop={()=>{if(dragging&&ms.find(m=>m.id===dragging))unmatchM(dragging);setDragging(null);setDragKansen(false);}}
          >
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:13,letterSpacing:1,textTransform:"uppercase",fontWeight:500}}>Kansen</span>
                {unmatched.length>0&&<button onClick={()=>{setCollapsedK(p=>{const allFolded=unmatched.every(k=>p.has(k.id));const n=new Set(p);unmatched.forEach(k=>{if(allFolded)n.delete(k.id);else n.add(k.id);});return n;});}} data-noprint style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:C.grijs,fontFamily:F,lineHeight:1}}>{unmatched.every(k=>collapsedK.has(k.id))?"▸":"▾"}</button>}
              </div>
              <button onClick={()=>addKans("")} data-noprint style={{...bS(C.zwart),fontSize:10,padding:"3px 8px"}}>+ Nieuw</button>
            </div>
            <div style={{fontSize:10,color:C.grijs,marginBottom:12,fontWeight:300}}>
              {dragKansen?<span style={{color:C.geel,fontWeight:500}}>Loslaten = match ontkoppelen</span>:"Koppel aan ontwikkelaar → match."}
            </div>
            {dragKansen&&<div style={{padding:10,border:`2px dashed ${C.geel}`,borderRadius:6,textAlign:"center",color:C.geel,fontSize:12,fontWeight:500,marginBottom:10}}>Hier loslaten</div>}

            {sKcs.map((cat,ci)=>{
              const ck=unmatched.filter(k=>k.cid===cat.id).sort((a,b)=>a.so-b.so);
              const allKC=ck.length>0&&ck.every(k=>collapsedK.has(k.id));
              return <div key={cat.id} style={{marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:6}}>
                  {ck.length>0&&<span onClick={()=>{setCollapsedK(p=>{const n=new Set(p);ck.forEach(k=>{if(allKC)n.delete(k.id);else n.add(k.id);});return n;});}} style={{fontSize:14,color:C.grijs,cursor:"pointer"}}>{allKC?"▸":"▾"}</span>}
                  <span style={{fontSize:14,fontWeight:600,flex:1,color:C.txtPrimary}}>{cat.label||"Naamloos"}</span>
                  <button onClick={()=>setEKC(cat.id)} data-noprint style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.grijs,fontFamily:F}}>✎</button>
                </div>
                {ck.map((kans,ki)=>{
                  const mp=maps(kans.adres);const isKC=collapsedK.has(kans.id);
                  return <div key={kans.id} draggable
                    onDragStart={()=>{setDraggingKans(kans.id);setDragging(null);}}
                    onDragEnd={()=>{setDraggingKans(null);setDragOver(null);}}
                    style={{padding:isKC?"6px 10px":"8px 10px",marginBottom:4,borderRadius:3,border:`1px solid ${C.kaartBorder}`,background:C.kaart,cursor:"grab",opacity:draggingKans===kans.id?0.4:1,transition:"opacity 0.12s"}}>
                    <div onClick={e=>{e.stopPropagation();setCollapsedK(p=>{const n=new Set(p);if(n.has(kans.id))n.delete(kans.id);else n.add(kans.id);return n;});}} style={{display:"flex",alignItems:"flex-start",gap:5,cursor:"pointer"}}>
                      <span style={{fontSize:13,color:C.grijs,flexShrink:0,lineHeight:1.3}}>{isKC?"▸":"▾"}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:500,fontSize:12,lineHeight:1.3,color:C.txtPrimary}}>{kans.name||"Naamloos"}</div>
                      </div>
                      <div style={{display:"flex",gap:3,alignItems:"center",flexShrink:0}} data-noprint>
                        <button onClick={e=>{e.stopPropagation();setMkMatch(kans.id);}} style={{padding:"3px 10px",fontSize:10,fontWeight:500,color:C.geel,background:C.geel+"18",border:`1px solid ${C.geel}33`,borderRadius:2,cursor:"pointer",textTransform:"uppercase",letterSpacing:0.5,fontFamily:F}}>Match →</button>
                        <button onClick={e=>{e.stopPropagation();setEKans(kans.id);}} style={{fontSize:10,background:C.lichtgrijs,border:"none",borderRadius:3,padding:"3px 6px",cursor:"pointer",color:C.grijs,fontFamily:F}}>✎</button>
                      </div>
                    </div>
                    {!isKC&&<>
                      <div style={{fontSize:10,color:C.txtSecondary,fontWeight:300,marginTop:2}}>{kans.omvang&&`${kans.omvang}m² · `}{kans.type}</div>
                      {kans.adres&&<div style={{fontSize:10,marginTop:1,fontWeight:300}}>{mp?<a href={mp} target="_blank" rel="noopener noreferrer" style={{color:C.blauw,textDecoration:"none"}}>📍 {kans.adres}</a>:<span style={{color:C.txtSecondary}}>📍 {kans.adres}</span>}</div>}
                    </>}
                  </div>;
                })}
                {ck.length===0&&<div style={{fontSize:10,color:C.zachtgrijs,fontStyle:"italic"}}>Geen kansen</div>}
              </div>;
            })}
            {unmatched.filter(k=>!kcs.find(c=>c.id===k.cid)).length>0&&<div style={{marginBottom:14}}>
              <div style={{fontSize:12,color:C.grijs,fontStyle:"italic",marginBottom:4}}>Geen categorie</div>
              {unmatched.filter(k=>!kcs.find(c=>c.id===k.cid)).map(kans=>(
                <div key={kans.id} draggable
                  onDragStart={()=>{setDraggingKans(kans.id);setDragging(null);}}
                  onDragEnd={()=>{setDraggingKans(null);setDragOver(null);}}
                  style={{padding:"8px 10px",marginBottom:4,borderRadius:3,border:`1px solid ${C.zachtgrijs}`,cursor:"grab",opacity:draggingKans===kans.id?0.4:1}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontWeight:500,fontSize:12}}>{kans.name||"Naamloos"}</span>
                    <div style={{display:"flex",gap:3}} data-noprint>
                      <button onClick={()=>setMkMatch(kans.id)} style={{padding:"3px 10px",fontSize:10,fontWeight:500,color:C.geel,background:C.geel+"18",border:`1px solid ${C.geel}33`,borderRadius:2,cursor:"pointer",textTransform:"uppercase",letterSpacing:0.5,fontFamily:F}}>Match →</button>
                      <button onClick={()=>setEKans(kans.id)} style={{fontSize:10,background:C.lichtgrijs,border:"none",borderRadius:3,padding:"3px 6px",cursor:"pointer",color:C.grijs,fontFamily:F}}>✎</button>
                    </div>
                  </div>
                  <div style={{fontSize:10,color:C.grijs,fontWeight:300}}>{kans.omvang&&`${kans.omvang}m² · `}{kans.type}</div>
                </div>
              ))}
            </div>}
            <button onClick={addKC} data-noprint style={{...bS(C.lichtgrijs,C.grijs),fontSize:10,padding:"4px 10px",width:"100%",marginTop:4}}>+ Categorie</button>
          </div>
        </div>

        {/* ═══ RIGHT: KANBAN ═══ */}
        <div style={{flex:1,overflowX:"auto",display:"flex"}}>
          {STAGES.map(stage=>{
            const sm=ms.filter(m=>m.stage===stage.id).sort((a,b)=>a.so-b.so);
            const isDT=dragOver===stage.id;
            const allC=sm.length>0&&sm.every(m=>m.col);
            return <div key={stage.id}
              onDragOver={e=>{e.preventDefault();setDragOver(stage.id);setDragKansen(false);}}
              onDragLeave={()=>setDragOver(null)}
              onDrop={e=>{
                if(draggingKans){
                  // Kans dropped on pipeline → open match creator for that stage
                  setMkMatchStage(stage.id);
                  setMkMatch(draggingKans);
                  setDraggingKans(null);setDragOver(null);
                } else if(dragging&&ms.find(m=>m.id===dragging)){
                  const dragMatch=ms.find(m=>m.id===dragging);
                  if(dragMatch.stage===stage.id){
                    const maxSo=Math.max(...ms.filter(m=>m.stage===stage.id).map(m=>m.so),0);
                    setMs(p=>p.map(m=>m.id===dragging?{...m,so:maxSo+1}:m));
                  } else {
                    moveM(dragging,stage.id);
                  }
                  setDragging(null);setDragOver(null);
                }
              }}
              style={{flex:1,minWidth:200,display:"flex",flexDirection:"column",borderRight:`1px solid ${C.zachtgrijs}`,background:isDT?`${stage.color}12`:"transparent",transition:"background 0.15s"}}>

              <div style={{padding:"14px 14px 10px",borderBottom:`3px solid ${stage.color}`,background:C.panelBg,height:88,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:15,fontWeight:600,color:stage.color,lineHeight:1.2}}>{stage.label}</span>
                      {sm.length>0&&<button onClick={()=>colAll(stage.id,!allC)} data-noprint style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:C.grijs,fontFamily:F,lineHeight:1,flexShrink:0}}>{allC?"▸":"▾"}</button>}
                    </div>
                    <div style={{fontSize:10,color:C.grijs,marginTop:3,fontWeight:300}}>{stage.sub}</div>
                  </div>
                  <div style={{fontSize:24,fontWeight:300,color:stage.color,flexShrink:0}}>{sm.length}</div>
                </div>
                {stage.needsMin2?<div style={{fontSize:8,color:C.grijs,fontWeight:300,fontStyle:"italic"}}>Min. 2 koppelingen</div>:<div style={{height:12}}/>}
              </div>

              <div style={{flex:1,overflowY:"auto",padding:"8px 8px 50px"}}>
                {sm.map(match=>{
                  const kans=kansen.find(k=>k.id===match.kid);if(!kans)return null;
                  const al=aLevel(match);const tl=totalL(match);
                  const il=indivL(match);const iDevs=devs.filter(d=>il.includes(d.id));
                  const hlM=matchHl(match.id);const isSel=selMatch===match.id;
                  const mp=maps(kans.adres);const isC=match.col;
                  const bc={rood:C.rood,oranje:C.oranje,ok:C.zachtgrijs};
                  const bgc={rood:`${C.rood}18`,oranje:`${C.oranje}18`,ok:C.kaart};

                  return <div key={match.id} draggable
                    onDragStart={()=>setDragging(match.id)} onDragEnd={()=>{setDragging(null);setDragOver(null);setDragKansen(false);}}
                    onClick={()=>{clr();setSelMatch(isSel?null:match.id);}}
                    style={{
                      padding:isC?"8px 12px":14,marginBottom:8,borderRadius:4,cursor:"grab",transition:"all 0.12s",
                      background:bgc[al],border:`1px solid ${C.zachtgrijs}`,borderLeft:`5px solid ${bc[al]}`,
                      opacity:hlM===false?0.15:dragging===match.id?0.4:1,
                      boxShadow:isSel?`0 0 0 2px ${stage.color},0 2px 12px rgba(0,0,0,0.06)`:"0 1px 2px rgba(0,0,0,0.02)",
                    }}>
                    <div onClick={e=>{e.stopPropagation();updM(match.id,{col:!isC});}} style={{display:"flex",alignItems:"flex-start",gap:6,cursor:"pointer"}}>
                      <span style={{fontSize:14,color:C.grijs,lineHeight:1.4,flexShrink:0}}>{isC?"▸":"▾"}</span>
                      <span style={{fontWeight:500,fontSize:14,lineHeight:1.3,flex:1,minWidth:0}}>{kans.name}</span>
                      {isC&&tl>0&&<span style={{fontSize:10,color:C.grijs,flexShrink:0,marginTop:3}}>({tl})</span>}
                      <span style={{padding:"2px 8px",fontSize:9,fontWeight:500,color:stage.color,background:stage.bg,border:`1px solid ${stage.color}33`,borderRadius:2,textTransform:"uppercase",letterSpacing:0.5,flexShrink:0,whiteSpace:"nowrap",marginTop:1}}>{stage.short}</span>
                    </div>

                    {!isC&&<>
                      <div style={{fontSize:11,color:C.grijs,marginTop:4,fontWeight:300}}>{kans.omvang&&`${kans.omvang}m² · `}{kans.type}</div>
                      {kans.adres&&<div style={{fontSize:11,marginTop:2,fontWeight:300}}>{mp?<a href={mp} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{color:C.blauw,textDecoration:"none"}}>📍 {kans.adres}</a>:<span style={{color:C.grijs}}>📍 {kans.adres}</span>}</div>}
                      {kans.contact&&<div style={{fontSize:11,color:C.grijs,marginTop:1,fontWeight:300}}>👤 {kans.contact}</div>}
                      {match.notitie&&<div style={{fontSize:11,color:C.grijs,marginTop:2,fontStyle:"italic",fontWeight:300}}>{match.notitie.length>50?match.notitie.substring(0,50)+"…":match.notitie}</div>}

                      <div style={{borderTop:`1px solid ${C.zachtgrijs}`,paddingTop:8,marginTop:6}}>
                        <div style={{marginBottom:5}}>
                          <span style={{fontSize:11,fontWeight:500,textTransform:"uppercase",letterSpacing:0.5,color:al==="rood"?C.rood:al==="oranje"?C.oranje:C.zwart}}>
                            {stage.needsMin2?(tl===0?"⚠ Geen match":tl===1?"⚠ 1 match":`✓ ${tl} matches`):`${tl} gekoppeld`}
                          </span>
                        </div>
                        {iDevs.length>0&&<div style={{display:"flex",flexDirection:"column",gap:3,marginBottom:3}}>
                          {iDevs.map(d=>{const dt=dts.find(t=>t.id===d.tid);return <div key={d.id} style={{display:"flex",alignItems:"center",gap:5,fontSize:11}}>
                            <Badge s={dt?.short} sz={18}/><span>{d.name}</span>
                            <span onClick={e=>{e.stopPropagation();togML(match.id,d.id);}} data-noprint style={{cursor:"pointer",opacity:0.3,fontSize:10}}>✕</span>
                          </div>;})}
                        </div>}
                        {(match.coals||[]).map((c,ci)=>{
                          const mb=c.map(id=>devs.find(d=>d.id===id)).filter(Boolean);
                          return <div key={ci} onClick={e=>{e.stopPropagation();setCoalM({mid:match.id,idx:ci});}} style={{padding:"5px 7px",marginTop:3,borderRadius:3,background:`${C.geel}08`,border:`1.5px dashed ${C.geel}55`,fontSize:11,cursor:"pointer"}}>
                            <div style={{fontWeight:500,color:C.geel,marginBottom:4,display:"flex",justifyContent:"space-between"}}>
                              <span>Coalitie <span style={{fontSize:8,fontWeight:300,color:C.grijs}}>(klik om te bewerken)</span></span><span onClick={e=>{e.stopPropagation();setCfDel({type:"coal",mid:match.id,idx:ci});}} data-noprint style={{cursor:"pointer",color:C.grijs,fontSize:11}}>✕</span>
                            </div>
                            <div style={{display:"flex",flexDirection:"column",gap:3}}>
                              {mb.map(m=>{const dt=dts.find(t=>t.id===m.tid);return <div key={m.id} style={{display:"flex",alignItems:"center",gap:4}}><Badge s={dt?.short} sz={18}/><span>{m.name}</span></div>;})}
                            </div>
                          </div>;
                        })}
                        <div style={{borderTop:`1px solid ${C.zachtgrijs}`,marginTop:6,paddingTop:6,display:"flex",gap:5}} data-noprint>
                          <button onClick={e=>{e.stopPropagation();setCoalM({mid:match.id,idx:null});}} style={{fontSize:11,background:C.lichtgrijs,border:"none",borderRadius:3,padding:"3px 8px",cursor:"pointer",color:C.txtPrimary,fontFamily:F}}>+ coalitie</button>
                          <button onClick={e=>{e.stopPropagation();setEMatch(match.id);}} style={{fontSize:11,background:C.lichtgrijs,border:"none",borderRadius:3,padding:"3px 8px",cursor:"pointer",color:C.txtPrimary,fontFamily:F}}>✎ bewerk</button>
                        </div>
                      </div>
                    </>}
                  </div>;
                })}
                {stage.addLabel&&<button onClick={()=>setMkMatchStage(stage.id)} data-noprint style={{width:"100%",padding:9,background:"transparent",border:`2px dashed ${C.zachtgrijs}`,borderRadius:4,cursor:"pointer",color:C.grijs,fontSize:11,fontFamily:F,marginTop:4}}>{stage.addLabel}</button>}
              </div>
            </div>;
          })}
        </div>
      </div>

      <div style={{padding:"8px 24px",borderTop:`1px solid ${C.zachtgrijs}`,background:C.footerBg,display:"flex",justifyContent:"space-between"}}>
        <div style={{fontSize:9,color:C.grijs,fontWeight:300}}><span style={{color:C.geel,fontWeight:500}}>/ </span>ARD / AtelierRuimDenkers — De Koppelbaas</div>
        <div style={{fontSize:9,color:C.grijs,fontWeight:300}}>Willem Buytewechstraat 45, Rotterdam</div>
      </div>

      {/* ═══ MODALS ═══ */}
      <MkMatchModal open={!!mkMatch} kans={kansen.find(k=>k.id===mkMatch)} devs={devs} dts={dts} onClose={()=>{setMkMatch(null);setMkMatchStage(null);}} onSave={(kid,dIds)=>mkM(kid,dIds,mkMatchStage||"matches")}/>

      {/* Pipeline kans picker: pick a kans, then open dev picker */}
      <Modal open={!!mkMatchStage&&!mkMatch} onClose={()=>setMkMatchStage(null)} title={`Kans kiezen — ${STAGES.find(s=>s.id===mkMatchStage)?.label||""}`} w={440}>
        <p style={{fontSize:12,color:C.grijs,marginBottom:10,fontWeight:300}}>Kies een kans om een match te maken.</p>
        <div style={{maxHeight:300,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
          {unmatched.map(kans=>{
            return <div key={kans.id} onClick={()=>setMkMatch(kans.id)} style={{padding:"8px 10px",borderRadius:3,border:`1px solid ${C.kaartBorder}`,cursor:"pointer",background:C.kaart}}>
              <div style={{fontWeight:500,fontSize:13}}>{kans.name||"Naamloos"}</div>
              <div style={{fontSize:10,color:C.grijs,fontWeight:300}}>{kans.omvang&&`${kans.omvang}m² · `}{kans.type}</div>
            </div>;
          })}
        </div>
      </Modal>

      <Modal open={!!eMatch} onClose={()=>setEMatch(null)} title="Match bewerken" w={480}>
        {edMatch&&(()=>{const kans=kansen.find(k=>k.id===edMatch.kid);return <div>
          <div style={{padding:10,background:C.lichtgrijs,borderRadius:3,marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:10,color:C.grijs,textTransform:"uppercase",letterSpacing:1,fontWeight:500,marginBottom:3}}>Kans</div>
              <div style={{fontSize:14,fontWeight:500}}>{kans?.name||"?"}</div>
              <div style={{fontSize:11,color:C.grijs,fontWeight:300}}>{kans?.omvang&&`${kans.omvang}m² · `}{kans?.type}</div>
            </div>
            <button onClick={()=>{setEMatch(null);setEKans(kans?.id);}} data-noprint style={{...bS(C.lichtgrijs,C.grijs),fontSize:10,padding:"4px 10px",border:`1px solid ${C.zachtgrijs}`}}>Bewerk kans →</button>
          </div>
          <Fl label="Notitie"><textarea style={{...iS,minHeight:50,resize:"vertical"}} value={edMatch.notitie||""} onChange={e=>updM(edMatch.id,{notitie:e.target.value})}/></Fl>
          <Fl label="Fase"><select style={iS} value={edMatch.stage} onChange={e=>updM(edMatch.id,{stage:e.target.value})}>{STAGES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></Fl>
          <div style={{borderTop:`1px solid ${C.zachtgrijs}`,paddingTop:14,marginTop:14}}>
            <Fl label="Ontwikkelaars"><div style={{maxHeight:180,overflowY:"auto",border:`1px solid ${C.zachtgrijs}`,borderRadius:3,padding:6}}>
              {devs.map(dev=>{const linked=edMatch.links.includes(dev.id);const inC=coalIds(edMatch).has(dev.id);const dt=dts.find(t=>t.id===dev.tid);
                return <div key={dev.id} onClick={()=>{if(!inC)togML(edMatch.id,dev.id);}} style={{display:"flex",alignItems:"center",gap:7,padding:"5px",cursor:inC?"default":"pointer",borderRadius:3,fontSize:13,background:linked?`${BC}10`:inC?`${C.geel}08`:"transparent",opacity:inC?0.5:1}}>
                  <div style={{width:15,height:15,borderRadius:2,border:`2px solid ${linked?BC:inC?C.geel:C.zachtgrijs}`,background:linked?BC:inC?C.geel:"transparent",color:C.wit,fontSize:9,display:"flex",alignItems:"center",justifyContent:"center"}}>{(linked||inC)&&"✓"}</div>
                  <Badge s={dt?.short} sz={18}/><span style={{fontWeight:linked?500:300}}>{dev.name}</span>
                  {inC&&<span style={{fontSize:10,color:C.geel,marginLeft:"auto"}}>coalitie</span>}
                </div>;
              })}
            </div></Fl>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:14}}>
            <button onClick={()=>setCfDel({type:"match",id:edMatch.id})} style={{...bS(`${C.rood}15`,C.rood),fontSize:11}}>Verwijder</button>
            <button onClick={()=>setEMatch(null)} style={bS(C.zwart)}>Klaar</button>
          </div>
        </div>;})()}
      </Modal>

      <Modal open={!!eDev} onClose={()=>setEDev(null)} title="Ontwikkelaar" w={400}>
        {edDev&&<div>
          <Fl label="Naam"><input style={iS} value={edDev.name} onChange={e=>setDevs(p=>p.map(d=>d.id===edDev.id?{...d,name:e.target.value}:d))}/></Fl>
          <Fl label="Type"><select style={iS} value={edDev.tid} onChange={e=>setDevs(p=>p.map(d=>d.id===edDev.id?{...d,tid:e.target.value}:d))}><option value="">— Geen —</option>{sDts.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}</select></Fl>
          <Fl label="Schaal"><input style={iS} value={edDev.schaal} onChange={e=>setDevs(p=>p.map(d=>d.id===edDev.id?{...d,schaal:e.target.value}:d))}/></Fl>
          <Fl label="Contact"><input style={iS} value={edDev.contact||""} onChange={e=>setDevs(p=>p.map(d=>d.id===edDev.id?{...d,contact:e.target.value}:d))}/></Fl>
          <Fl label="Notitie"><textarea style={{...iS,minHeight:40,resize:"vertical"}} value={edDev.notitie||""} onChange={e=>setDevs(p=>p.map(d=>d.id===edDev.id?{...d,notitie:e.target.value}:d))}/></Fl>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:14}}>
            <button onClick={()=>setCfDel({type:"dev",id:edDev.id})} style={{...bS(`${C.rood}15`,C.rood),fontSize:11}}>Verwijder</button>
            <button onClick={()=>setEDev(null)} style={bS(C.zwart)}>Klaar</button>
          </div>
        </div>}
      </Modal>

      <Modal open={!!eKans} onClose={()=>setEKans(null)} title="Kans" w={460}>
        {edKans&&<div>
          <Fl label="Naam"><input style={iS} value={edKans.name} onChange={e=>setKansen(p=>p.map(k=>k.id===edKans.id?{...k,name:e.target.value}:k))}/></Fl>
          <Fl label="Gebied"><select style={iS} value={edKans.cid||""} onChange={e=>setKansen(p=>p.map(k=>k.id===edKans.id?{...k,cid:e.target.value}:k))}><option value="">— Geen —</option>{sKcs.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></Fl>
          <Fl label="Adres"><input style={iS} value={edKans.adres} onChange={e=>setKansen(p=>p.map(k=>k.id===edKans.id?{...k,adres:e.target.value}:k))}/></Fl>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Fl label="Omvang (m²)"><input style={iS} value={edKans.omvang} onChange={e=>setKansen(p=>p.map(k=>k.id===edKans.id?{...k,omvang:e.target.value}:k))}/></Fl>
            <Fl label="Functie"><select style={iS} value={edKans.type} onChange={e=>setKansen(p=>p.map(k=>k.id===edKans.id?{...k,type:e.target.value}:k))}>{FUNCTIE.map(t=><option key={t}>{t}</option>)}</select></Fl>
          </div>
          <Fl label="Contact"><input style={iS} value={edKans.contact} onChange={e=>setKansen(p=>p.map(k=>k.id===edKans.id?{...k,contact:e.target.value}:k))}/></Fl>
          <Fl label="Notitie"><textarea style={{...iS,minHeight:40,resize:"vertical"}} value={edKans.notitie} onChange={e=>setKansen(p=>p.map(k=>k.id===edKans.id?{...k,notitie:e.target.value}:k))}/></Fl>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:14}}>
            <button onClick={()=>setCfDel({type:"kans",id:edKans.id})} style={{...bS(`${C.rood}15`,C.rood),fontSize:11}}>Verwijder</button>
            <button onClick={()=>setEKans(null)} style={bS(C.zwart)}>Klaar</button>
          </div>
        </div>}
      </Modal>

      <Modal open={!!eDT} onClose={()=>setEDT(null)} title={eDT==="new"?"Categorie toevoegen":"Categorie bewerken"} w={360}>
        {eDT==="new"?<NewDTForm onSave={saveDT} onCancel={()=>setEDT(null)}/>
        :edDT&&<div>
          <Fl label="Label"><input style={iS} value={edDT.label} onChange={e=>setDts(p=>p.map(t=>t.id===edDT.id?{...t,label:e.target.value}:t))}/></Fl>
          <Fl label="Afkorting (2)"><input style={iS} maxLength={2} value={edDT.short} onChange={e=>setDts(p=>p.map(t=>t.id===edDT.id?{...t,short:e.target.value.toUpperCase()}:t))}/></Fl>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:14}}>
            <button onClick={()=>setCfDel({type:"dt",id:edDT.id})} style={{...bS(`${C.rood}15`,C.rood),fontSize:11}}>Verwijder</button>
            <button onClick={()=>setEDT(null)} style={bS(C.zwart)}>Klaar</button>
          </div>
        </div>}
      </Modal>

      <Modal open={!!eKC} onClose={()=>setEKC(null)} title={eKC==="new"?"Categorie toevoegen":"Categorie bewerken"} w={360}>
        {eKC==="new"?<NewKCForm onSave={saveKC} onCancel={()=>setEKC(null)}/>
        :edKC&&<div>
          <Fl label="Naam"><input style={iS} value={edKC.label} onChange={e=>setKcs(p=>p.map(c=>c.id===edKC.id?{...c,label:e.target.value}:c))}/></Fl>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:14}}>
            <button onClick={()=>setCfDel({type:"kc",id:edKC.id})} style={{...bS(`${C.rood}15`,C.rood),fontSize:11}}>Verwijder</button>
            <button onClick={()=>setEKC(null)} style={bS(C.zwart)}>Klaar</button>
          </div>
        </div>}
      </Modal>

      <Modal open={!!cfDel} onClose={()=>setCfDel(null)} title="Bevestig verwijderen" w={380}>
        {cfDel&&<div>
          <p style={{fontSize:13,fontWeight:300,lineHeight:1.5,marginBottom:14}}>
            {cfDel.type==="dev"&&`"${devs.find(d=>d.id===cfDel.id)?.name}" verwijderen?`}
            {cfDel.type==="kans"&&`"${kansen.find(k=>k.id===cfDel.id)?.name}" verwijderen? Matches worden ook verwijderd.`}
            {cfDel.type==="match"&&"Match verwijderen?"}
            {cfDel.type==="coal"&&"Coalitie verwijderen?"}
            {cfDel.type==="dt"&&'Type verwijderen? Ontwikkelaars → "geen categorie".'}
            {cfDel.type==="kc"&&'Gebied verwijderen? Kansen → "geen categorie".'}
          </p>
          <div style={{display:"flex",justifyContent:"flex-end",gap:6}}>
            <button onClick={()=>setCfDel(null)} style={bS(C.lichtgrijs,C.grijs)}>Annuleer</button>
            <button onClick={()=>{
              if(cfDel.type==="dev")rmDev(cfDel.id);
              else if(cfDel.type==="kans")rmKans(cfDel.id);
              else if(cfDel.type==="match")rmM(cfDel.id);
              else if(cfDel.type==="coal")rmCoal(cfDel.mid,cfDel.idx);
              else if(cfDel.type==="dt")rmDT(cfDel.id);
              else if(cfDel.type==="kc")rmKC(cfDel.id);
            }} style={bS(C.rood)}>Verwijder</button>
          </div>
        </div>}
      </Modal>

      <CoalModal open={!!coalM} devs={devs} dts={dts} onClose={()=>setCoalM(null)} onSave={ids=>{if(coalM)saveCoal(coalM.mid,coalM.idx,ids);}} init={coalInit}/>

      <Modal open={showAl} onClose={()=>setShowAl(false)} title={`Alerts (${alarms.length})`} w={500}>
        {alarms.length===0?<div style={{textAlign:"center",padding:20,color:C.groen}}><div style={{fontSize:28,marginBottom:6}}>✓</div><div style={{fontSize:14,fontWeight:500}}>Alles gekoppeld</div></div>
        :<div style={{display:"flex",flexDirection:"column",gap:6}}>
          {alarms.map((a,i)=>(
            <div key={i} style={{padding:"10px 12px",borderRadius:4,fontSize:12,fontWeight:300,background:a.lv==="rood"?`${C.rood}06`:`${C.oranje}08`,border:`1px solid ${a.lv==="rood"?`${C.rood}22`:`${C.oranje}33`}`,display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:a.lv==="rood"?C.rood:C.oranje,flexShrink:0}}/>
              <span style={{flex:1}}>{a.msg}</span>
              <button onClick={()=>{setEMatch(a.m.id);setShowAl(false);}} style={{...bS(C.wit,C.grijs),fontSize:10,padding:"3px 10px",border:`1px solid ${C.zachtgrijs}`}}>→</button>
            </div>
          ))}
        </div>}
      </Modal>
    </div>
  );
}
