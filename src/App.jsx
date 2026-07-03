import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar
} from "recharts";
import {
  Fish, Anchor, ShieldCheck, FileText, Users, MapPin, BarChart3,
  Settings, LogOut, Search, Bell, Download, Plus, Upload, AlertTriangle,
  CheckCircle2, Clock, X, ChevronRight, Menu, Home, Ship,
  Waves, CreditCard, TrendingUp, Calendar, Eye, Smartphone, ArrowUpRight,
  Landmark, BadgeCheck, FolderOpen, QrCode, ScanLine, Radio, ArrowLeft,
  ArrowRight, ChevronLeft, Printer, IdCard, Activity, RefreshCw
} from "lucide-react";

/* ============================== THEME — OCEAN ============================== */
const T = {
  bg: "#EAF3F8",
  panel: "#FFFFFF",
  panelAlt: "#F0F8FB",
  ink: "#0A2A3C",
  inkSoft: "#4C6C7C",
  inkFaint: "#8FACB9",
  line: "#D7E7EF",
  deep: "#062641",
  deepAlt: "#0A3B5C",
  blue: "#0E76A8",
  blueLight: "#2FA8C9",
  cyan: "#3FC6DA",
  cyanPale: "#DFF6FA",
  amber: "#E3A93B",
  amberDark: "#B9821F",
  amberPale: "#FBF0DA",
  coral: "#D9564A",
  coralPale: "#FBE6E3",
  success: "#1E8A6E",
  successPale: "#E1F5EE",
  gold: "#E3A93B",
};

const FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');";
const F_DISPLAY = "'Space Grotesk', sans-serif";
const F_BODY = "'Inter', sans-serif";
const F_MONO = "'IBM Plex Mono', monospace";

const qrUrl = (text, size=180) => `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&color=0A2A3C&bgcolor=ffffff&data=${encodeURIComponent(text)}`;

/* ============================== MOCK DATA ============================== */
const FIRST = ["Otieno","Achieng","Wanjiru","Njoroge","Mumbi","Kiptoo","Adhiambo","Barasa","Chebet","Odhiambo","Nekesa","Kamau","Wafula","Auma","Kiplagat","Nyambura","Owino","Cherono","Wekesa","Atieno","Juma","Akoth","Were","Nafula"];
const LAST = ["Onyango","Omondi","Kariuki","Mwangi","Ochieng","Njuguna","Simiyu","Wanyama","Kiprotich","Muthoni","Otieno","Akinyi","Kimani","Odongo","Were","Wafula","Mboya"];
const SUBCOUNTIES = { "Kwale":["Nyando","Kisumu Central","Nyakach"], "Mombasa":["Suba North","Suba South","Rangwe"], "Kilifi":["Bondo","Rarieda"], "Lamu":["Nyatike","Suna East"], "Tana River":["Bunyala","Budalangi"] };
const BMUS = [
  { name: "Shimoni BMU", county: "Kwale", x: 22, y: 40 }, { name: "Diani BMU", county: "Kwale", x: 27, y: 33 },
  { name: "Msambweni BMU", county: "Kwale", x: 15, y: 78 }, { name: "Likoni BMU", county: "Mombasa", x: 20, y: 86 },
  { name: "Old Town BMU", county: "Mombasa", x: 33, y: 65 }, { name: "Mtwapa BMU", county: "Kilifi", x: 40, y: 58 },
  { name: "Watamu BMU", county: "Kilifi", x: 48, y: 24 }, { name: "Malindi BMU", county: "Lamu", x: 55, y: 30 },
  { name: "Faza BMU", county: "Lamu", x: 68, y: 18 }, { name: "Kipini BMU", county: "Tana River", x: 76, y: 14 },
];
const COUNTIES = [...new Set(BMUS.map(b=>b.county))];
const SPECIES = [
  { name: "Nile Perch", price: 380 }, { name: "Nile Tilapia", price: 320 },
  { name: "Omena (Silver Cyprinid)", price: 180 }, { name: "African Catfish", price: 260 },
  { name: "Mudfish", price: 210 },
];
const GEAR = ["Gillnet","Longline","Beach Seine","Cast Net","Fish Trap"];
const VESSEL_TYPES = ["Wooden Canoe","Fibreglass Boat","Motorized Boat","Trawler"];
const DOC_TYPES = ["National ID","Fishing License","Coxswain Certificate","Vessel Registration Certificate","Payment Receipt","Other Supporting Record"];
const RANGERS = ["Ranger P. Odhiambo","Ranger G. Kiptoo","Ranger L. Nekesa","Ranger S. Barasa"];

function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function pad(n,len){ return String(n).padStart(len,"0"); }
function fmtDate(d){ return d.toISOString().slice(0,10); }
function daysAgo(n){ const d = new Date(); d.setDate(d.getDate()-n); return d; }
function daysFromNow(n){ const d = new Date(); d.setDate(d.getDate()+n); return d; }
function fmtKES(n){ return "KES " + n.toLocaleString("en-KE"); }
const bmuFor = (name) => BMUS.find(b=>b.name===name);

const FISHERS = Array.from({length: 36}).map((_,i)=>{
  const bmu = rand(BMUS);
  const status = rand(["Active","Active","Active","Pending","Expired"]);
  return {
    id: `FSH-${pad(i+1,4)}`,
    name: `${rand(FIRST)} ${rand(LAST)}`,
    gender: rand(["Male","Female"]),
    county: bmu.county,
    subcounty: rand(SUBCOUNTIES[bmu.county]),
    bmu: bmu.name,
    landingSite: `${bmu.name.replace(" BMU","")} Landing Site`,
    phone: `+254 7${randInt(10,99)} ${randInt(100,999)} ${randInt(100,999)}`,
    nationalId: `${randInt(20000000,39999999)}`,
    dateRegistered: fmtDate(daysAgo(randInt(60,1500))),
    membershipStatus: status,
    membershipExpiry: fmtDate(status==="Expired" ? daysAgo(randInt(5,120)) : daysFromNow(randInt(10,300))),
    vesselsCount: randInt(0,2),
  };
});

const VESSELS = Array.from({length: 28}).map((_,i)=>{
  const owner = rand(FISHERS);
  const status = rand(["Active","Active","Pending Renewal","Expired"]);
  const countyCode = owner.county.slice(0,3).toUpperCase();
  return {
    id: `VSL-${pad(i+1,4)}`,
    regNo: `${countyCode}/VSL/${randInt(1000,9999)}`,
    owner: owner.name, ownerId: owner.id, bmu: owner.bmu, county: owner.county,
    type: rand(VESSEL_TYPES),
    engine: rand(["Non-motorized","8HP Outboard","15HP Outboard","25HP Outboard","40HP Inboard"]),
    capacity: `${randInt(2,10)} persons`,
    regStatus: status,
    expiryDate: fmtDate(status==="Expired" ? daysAgo(randInt(5,90)) : daysFromNow(randInt(10,280))),
  };
});

const MONTHS = ["Feb","Mar","Apr","May","Jun","Jul"];
const CATCHES = Array.from({length: 70}).map((_,i)=>{
  const fisher = rand(FISHERS);
  const sp = rand(SPECIES);
  const qty = randInt(8,140);
  return {
    id: `CAT-${pad(i+1,4)}`, date: fmtDate(daysAgo(randInt(0,175))),
    county: fisher.county, bmu: fisher.bmu, landingSite: fisher.landingSite,
    species: sp.name, gearType: rand(GEAR), quantityKg: qty, estValue: qty*sp.price, fisher: fisher.name,
  };
});

const PATROLS = Array.from({length: 20}).map((_,i)=>{
  const bmu = rand(BMUS);
  return {
    id: `PTL-${pad(i+1,3)}`, date: fmtDate(daysAgo(randInt(0,120))), ranger: rand(RANGERS),
    bmu: bmu.name, county: bmu.county, type: rand(["Routine Patrol","Joint Operation","Night Patrol","Water Patrol"]),
    findings: rand(["No infractions observed along shoreline.","Two undersized-mesh gillnets confiscated.","Vessel registration spot-check completed, all compliant.","Beach seine activity flagged for follow-up.","Routine sweep, landing site orderly."]),
    status: rand(["Completed","Follow-up Required"]),
  };
});
const INCIDENTS = Array.from({length: 16}).map((_,i)=>{
  const bmu = rand(BMUS);
  return { id: `INC-${pad(i+1,3)}`, date: fmtDate(daysAgo(randInt(0,150))), type: rand(["Illegal Gear Use","Undersized Nets","Poaching","Boundary Dispute","Unregistered Vessel"]), bmu: bmu.name, county: bmu.county, severity: rand(["Low","Medium","High"]), status: rand(["Open","Under Investigation","Resolved"]), reportedBy: rand(RANGERS) };
});
const INSPECTIONS = Array.from({length: 18}).map((_,i)=>{
  const v = rand(VESSELS);
  return { id: `INS-${pad(i+1,3)}`, date: fmtDate(daysAgo(randInt(0,140))), bmu: v.bmu, subject: `${v.regNo} — ${v.owner}`, ranger: rand(RANGERS), result: rand(["Compliant","Compliant","Non-Compliant"]), notes: rand(["Documents verified on site.","Gear specification matches license.","Missing coxswain certificate.","All checks passed."]) };
});
const CONSERVATION = Array.from({length: 12}).map((_,i)=>{
  const bmu = rand(BMUS);
  return { id: `OBS-${pad(i+1,3)}`, date: fmtDate(daysAgo(randInt(0,160))), bmu: bmu.name, observation: rand(["Breeding-ground disturbance","Water hyacinth spread","Juvenile fish in catch","Shoreline erosion","Illegal beach-seine sighting"]), severity: rand(["Low","Medium","High"]), ranger: rand(RANGERS) };
});
const DOCUMENTS = Array.from({length: 42}).map((_,i)=>{
  const owner = rand(FISHERS);
  return { id: `DOC-${pad(i+1,4)}`, owner: owner.name, ownerId: owner.id, bmu: owner.bmu, type: rand(DOC_TYPES), fileName: `${owner.id.toLowerCase()}-${rand(["scan","copy","upload"])}.pdf`, uploadDate: fmtDate(daysAgo(randInt(1,600))), status: rand(["Verified","Verified","Pending","Expired"]) };
});
const PAYMENTS = Array.from({length: 34}).map((_,i)=>{
  const isVessel = i % 2 === 0;
  const owner = isVessel ? rand(VESSELS) : rand(FISHERS);
  return { id: `PAY-${pad(i+1,4)}`, payer: isVessel ? owner.owner : owner.name, bmu: owner.bmu, type: isVessel ? "Vessel Registration Fee" : "BMU Membership Fee", amount: isVessel ? randInt(1500,4500) : randInt(500,2000), dueDate: fmtDate(daysFromNow(randInt(-60,120))), status: rand(["Paid","Paid","Unpaid","Pending","Expired","Renewed"]) };
});

/* aggregates */
const catchByMonth = MONTHS.map((m,idx)=>{
  const total = CATCHES.filter(c=>{ const dm = new Date(c.date).getMonth(); return dm === (new Date().getMonth()-(5-idx)+12)%12; }).reduce((s,c)=>s+c.quantityKg,0);
  return { month: m, kg: total || randInt(800,2200) };
});
const revenueByMonth = MONTHS.map((m,idx)=>({ month:m, kes: randInt(60000,180000) + idx*8000 }));
const catchBySpecies = SPECIES.map(sp=>({ name: sp.name.split(" (")[0], kg: CATCHES.filter(c=>c.species===sp.name).reduce((s,c)=>s+c.quantityKg,0) }));
const membershipDist = ["Active","Pending","Expired"].map(s=>({ name: s, value: FISHERS.filter(f=>f.membershipStatus===s).length }));
const countyStats = COUNTIES.map(c=>({ county: c, fishers: FISHERS.filter(f=>f.county===c).length, bmus: BMUS.filter(b=>b.county===c).length, catchKg: CATCHES.filter(ca=>ca.county===c).reduce((s,ca)=>s+ca.quantityKg,0), compliance: randInt(72,98) }));
const PIE_COLORS = [T.blue, T.amber, T.coral, T.cyan, T.success];

const STATIONS = BMUS.map(b=>({ ...b, activity: rand(["High","Medium","Low"]), lastReport: `${randInt(2,55)} min ago`, todaysCatchKg: randInt(120,980), rangerOnSite: Math.random()>0.4 }));
const ACTIVITY_POOL = [
  { icon: Fish, tone:"blue", text: (b)=>`Catch of ${randInt(20,90)}kg logged at ${b}` },
  { icon: CheckCircle2, tone:"success", text: (b)=>`Membership renewed at ${b}` },
  { icon: ShieldCheck, tone:"blue", text: (b)=>`Routine patrol completed near ${b}` },
  { icon: CreditCard, tone:"amber", text: (b)=>`Vessel registration fee paid — ${b}` },
  { icon: FileText, tone:"cyan", text: (b)=>`Document uploaded for review — ${b}` },
  { icon: AlertTriangle, tone:"coral", text: (b)=>`Compliance flag raised at ${b}` },
  { icon: QrCode, tone:"blue", text: (b)=>`Member card verified at ${b}` },
];
function makeActivity(i){
  const bmu = rand(BMUS).name;
  const type = rand(ACTIVITY_POOL);
  return { id: `EVT-${Date.now()}-${i}`, icon: type.icon, tone: type.tone, text: type.text(bmu), time: i===0?"Just now":`${randInt(1,50)} min ago` };
}
const INITIAL_ACTIVITY = Array.from({length:8}).map((_,i)=>makeActivity(i+1));

/* ============================== TOAST CONTEXT ============================== */
const ToastCtx = createContext(()=>{});
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = (msg, tone="success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t=>[...t, { id, msg, tone }]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)), 3600);
  };
  const toneColor = { success:T.success, blue:T.blue, coral:T.coral, amber:T.amberDark };
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div style={{ position:"fixed", bottom:20, right:20, zIndex:200, display:"flex", flexDirection:"column", gap:8 }}>
        {toasts.map(t=>(
          <div key={t.id} style={{ background:T.deep, color:"#fff", padding:"12px 16px", borderRadius:10, display:"flex", alignItems:"center", gap:9, fontFamily:F_BODY, fontSize:13, fontWeight:600, boxShadow:"0 8px 24px rgba(6,38,65,0.35)", minWidth:220, borderLeft:`3px solid ${toneColor[t.tone]}` }}>
            <CheckCircle2 size={16} color={toneColor[t.tone]} /> {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
const useToast = () => useContext(ToastCtx);

/* ============================== SMALL UI ATOMS ============================== */
function Stamp({ label, tone="blue" }) {
  const tones = { blue:{c:T.blue,b:T.cyanPale}, amber:{c:T.amberDark,b:T.amberPale}, coral:{c:T.coral,b:T.coralPale}, success:{c:T.success,b:T.successPale}, ink:{c:T.inkSoft,b:T.panelAlt} };
  const p = tones[tone];
  return <span style={{ fontFamily:F_MONO, fontSize:10.5, letterSpacing:"0.09em", fontWeight:600, color:p.c, background:p.b, border:`1px solid ${p.c}55`, borderRadius:20, padding:"3px 9px", textTransform:"uppercase", display:"inline-flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>{label}</span>;
}
const STATUS_TONE = {
  Active:"blue", Paid:"success", Verified:"success", Compliant:"success", Completed:"success", Resolved:"success", Renewed:"success",
  Pending:"amber", "Pending Renewal":"amber", "Under Investigation":"amber", "Follow-up Required":"amber",
  Expired:"coral", Unpaid:"coral", Open:"coral", "Non-Compliant":"coral",
  Low:"blue", Medium:"amber", High:"coral",
};
function Card({ children, style, pad=20 }) { return <div style={{ background:T.panel, border:`1px solid ${T.line}`, borderRadius:14, padding:pad, ...style }}>{children}</div>; }
function SectionHeader({ eyebrow, title, action }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:16, flexWrap:"wrap", gap:10 }}>
      <div>
        {eyebrow && <div style={{ fontFamily:F_MONO, fontSize:11, letterSpacing:"0.12em", color:T.blueLight, textTransform:"uppercase", marginBottom:4 }}>{eyebrow}</div>}
        <h2 style={{ fontFamily:F_DISPLAY, fontSize:21, fontWeight:600, color:T.ink, margin:0 }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}
function Btn({ children, icon:Icon, tone="blue", onClick, small, disabled }) {
  const tones = { blue:{bg:T.deep,fg:"#fff"}, amber:{bg:T.amber,fg:"#2A1B06"}, ghost:{bg:"transparent",fg:T.ink,border:`1px solid ${T.line}`} };
  const p = tones[tone];
  return (
    <button disabled={disabled} onClick={onClick} style={{ display:"inline-flex", alignItems:"center", gap:7, background:disabled?"#B9C7CE":p.bg, color:p.fg, border:p.border||"none", borderRadius:9, padding:small?"7px 12px":"9px 16px", fontFamily:F_BODY, fontWeight:600, fontSize:small?12.5:13.5, cursor:disabled?"not-allowed":"pointer", boxShadow: tone==="blue"&&!disabled?"0 2px 8px rgba(6,38,65,0.25)":"none" }}>
      {Icon && <Icon size={small?14:15} />}{children}
    </button>
  );
}
function KPI({ icon:Icon, label, value, delta, tone="blue" }) {
  const c = { blue:T.blue, amber:T.amberDark, coral:T.coral, success:T.success }[tone];
  return (
    <Card pad={18} style={{ flex:"1 1 200px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ width:36, height:36, borderRadius:9, background:`${c}17`, display:"flex", alignItems:"center", justifyContent:"center" }}><Icon size={18} color={c} /></div>
        {delta && <span style={{ fontFamily:F_MONO, fontSize:11.5, color:T.success, display:"flex", alignItems:"center", gap:2 }}><ArrowUpRight size={12}/>{delta}</span>}
      </div>
      <div style={{ fontFamily:F_DISPLAY, fontSize:26, fontWeight:700, color:T.ink, marginTop:14 }}>{value}</div>
      <div style={{ fontFamily:F_BODY, fontSize:12.5, color:T.inkSoft, marginTop:2 }}>{label}</div>
    </Card>
  );
}
function Table({ columns, rows, renderRow }) {
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", minWidth:640 }}>
        <thead><tr>{columns.map(c=>(<th key={c} style={{ textAlign:"left", fontFamily:F_MONO, fontSize:10.5, letterSpacing:"0.08em", textTransform:"uppercase", color:T.inkFaint, padding:"0 14px 10px", borderBottom:`1px solid ${T.line}`, whiteSpace:"nowrap" }}>{c}</th>))}</tr></thead>
        <tbody>{rows.map((r,i)=>renderRow(r,i))}</tbody>
      </table>
    </div>
  );
}
function Td({ children, mono, style, onClick }) { return <td onClick={onClick} style={{ padding:"12px 14px", borderBottom:`1px solid ${T.line}`, fontFamily: mono?F_MONO:F_BODY, fontSize:13, color:T.ink, cursor: onClick?"pointer":"default", ...style }}>{children}</td>; }
function Tabs({ items, active, onChange }) {
  return (
    <div style={{ display:"flex", gap:4, background:T.panelAlt, padding:4, borderRadius:10, border:`1px solid ${T.line}`, width:"fit-content", marginBottom:18, flexWrap:"wrap" }}>
      {items.map(it=>(<button key={it} onClick={()=>onChange(it)} style={{ padding:"7px 14px", borderRadius:7, border:"none", cursor:"pointer", fontFamily:F_BODY, fontWeight:600, fontSize:12.5, background: active===it ? T.deep : "transparent", color: active===it ? "#fff" : T.inkSoft }}>{it}</button>))}
    </div>
  );
}
function Avatar({ name, size=44 }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", background:T.cyanPale, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F_DISPLAY, fontWeight:700, fontSize:size*0.35, color:T.blue, flexShrink:0 }}>{name.split(" ").map(w=>w[0]).join("")}</div>;
}
function Pulse({ color=T.success }) {
  return (
    <span style={{ position:"relative", display:"inline-flex", width:8, height:8 }}>
      <span style={{ position:"absolute", inset:0, borderRadius:"50%", background:color, opacity:0.5, animation:"pulseRing 1.6s ease-out infinite" }} />
      <span style={{ position:"absolute", inset:0, borderRadius:"50%", background:color }} />
    </span>
  );
}

/* ============================== WAVE COASTLINE MAP ============================== */
function StationsMap() {
  const [hover, setHover] = useState(null);
  const actColor = { High:T.success, Medium:T.amber, Low:T.coral };
  return (
    <Card pad={0} style={{ overflow:"hidden", position:"relative" }}>
      <div style={{ padding:"16px 20px 0" }}>
        <SectionHeader eyebrow="Live network" title="Reporting stations" action={<span style={{ display:"flex", alignItems:"center", gap:6, fontFamily:F_MONO, fontSize:11, color:T.success }}><Pulse/> LIVE</span>} />
      </div>
      <div style={{ position:"relative", height:280, background:`linear-gradient(160deg, ${T.deepAlt} 0%, ${T.blue} 55%, ${T.cyan} 100%)`, margin:"0 20px 20px", borderRadius:12, overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, opacity:0.5, backgroundImage:"radial-gradient(circle at 20% 30%, rgba(255,255,255,0.18), transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.12), transparent 50%)" }} />
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position:"absolute", inset:0 }}>
          <path d="M0,50 C15,35 25,55 35,45 C50,30 60,55 70,40 C82,28 90,38 100,30" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" fill="none" />
          <path d="M0,62 C18,50 28,66 40,58 C55,46 65,64 78,52 C88,44 94,50 100,42" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none" />
        </svg>
        {STATIONS.map(s=>(
          <div key={s.name} onMouseEnter={()=>setHover(s)} onMouseLeave={()=>setHover(null)} style={{ position:"absolute", left:`${s.x}%`, top:`${s.y}%`, transform:"translate(-50%,-50%)", cursor:"pointer" }}>
            <span style={{ position:"relative", display:"flex" }}>
              <span style={{ position:"absolute", inset:-6, borderRadius:"50%", background:actColor[s.activity], opacity:0.35, animation:"pulseRing 1.8s ease-out infinite" }} />
              <span style={{ width:10, height:10, borderRadius:"50%", background:actColor[s.activity], border:"2px solid white" }} />
            </span>
          </div>
        ))}
        {hover && (
          <div style={{ position:"absolute", left:`${hover.x}%`, top:`${hover.y}%`, transform: hover.x>60?"translate(-105%,-110%)":"translate(6%,-110%)", background:"#fff", borderRadius:9, padding:"10px 12px", width:180, boxShadow:"0 10px 24px rgba(0,0,0,0.25)", zIndex:5 }}>
            <div style={{ fontFamily:F_BODY, fontWeight:700, fontSize:12.5, color:T.ink }}>{hover.name}</div>
            <div style={{ fontFamily:F_BODY, fontSize:11, color:T.inkFaint, marginBottom:6 }}>{hover.county} County</div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.inkSoft }}><span>Today's catch</span><b style={{ color:T.ink }}>{hover.todaysCatchKg}kg</b></div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.inkSoft }}><span>Last report</span><b style={{ color:T.ink }}>{hover.lastReport}</b></div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.inkSoft }}><span>Ranger on site</span><b style={{ color: hover.rangerOnSite?T.success:T.coral }}>{hover.rangerOnSite?"Yes":"No"}</b></div>
          </div>
        )}
        <div style={{ position:"absolute", bottom:10, left:12, display:"flex", gap:12 }}>
          {["High","Medium","Low"].map(l=>(<div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontFamily:F_MONO, fontSize:9.5, color:"#fff", opacity:0.9 }}><span style={{ width:7, height:7, borderRadius:"50%", background:actColor[l] }} />{l} activity</div>))}
        </div>
      </div>
    </Card>
  );
}

function LiveActivityFeed() {
  const [events, setEvents] = useState(INITIAL_ACTIVITY);
  useEffect(()=>{
    const iv = setInterval(()=>{ setEvents(e=>[makeActivity(0), ...e].slice(0,10)); }, 7000);
    return ()=>clearInterval(iv);
  },[]);
  const toneColor = { blue:T.blue, success:T.success, amber:T.amberDark, coral:T.coral, cyan:T.blueLight };
  return (
    <Card pad={0}>
      <div style={{ padding:"16px 20px 0" }}>
        <SectionHeader eyebrow="Activity stream" title="Live feed" action={<span style={{ display:"flex", alignItems:"center", gap:6, fontFamily:F_MONO, fontSize:11, color:T.success }}><Pulse/> LIVE</span>} />
      </div>
      <div style={{ padding:"4px 12px 16px", maxHeight:280, overflowY:"auto" }}>
        {events.map((e,i)=>(
          <div key={e.id} style={{ display:"flex", gap:10, padding:"9px 8px", borderBottom: i<events.length-1?`1px solid ${T.line}`:"none" }}>
            <div style={{ width:28, height:28, borderRadius:8, background:`${toneColor[e.tone]}17`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><e.icon size={13} color={toneColor[e.tone]} /></div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:F_BODY, fontSize:12.5, color:T.ink, lineHeight:1.35 }}>{e.text}</div>
              <div style={{ fontFamily:F_MONO, fontSize:10.5, color:T.inkFaint, marginTop:2 }}>{e.time}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ============================== QR MEMBER CARD + VERIFY ============================== */
function MemberCardModal({ fisher, onClose }) {
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(6,38,65,0.55)", zIndex:60, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"min(400px,94vw)" }}>
        <div style={{ background:`linear-gradient(135deg, ${T.deep}, ${T.blue})`, borderRadius:18, padding:"22px 22px 0", color:"#fff", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-40, right:-40, width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", position:"relative" }}>
            <div>
              <div style={{ fontFamily:F_MONO, fontSize:10, letterSpacing:"0.14em", opacity:0.75, textTransform:"uppercase" }}>Official Registry Member Card</div>
              <div style={{ fontFamily:F_DISPLAY, fontWeight:700, fontSize:18, marginTop:4 }}>Lake Fisheries Registry</div>
            </div>
            <Waves size={22} color={T.amber} />
          </div>
          <div style={{ display:"flex", gap:14, marginTop:18, alignItems:"center", position:"relative" }}>
            <div style={{ width:60, height:60, borderRadius:"50%", background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F_DISPLAY, fontWeight:700, fontSize:20, border:"2px solid rgba(255,255,255,0.4)" }}>{fisher.name.split(" ").map(w=>w[0]).join("")}</div>
            <div>
              <div style={{ fontFamily:F_DISPLAY, fontWeight:700, fontSize:17 }}>{fisher.name}</div>
              <div style={{ fontFamily:F_MONO, fontSize:11.5, opacity:0.85 }}>{fisher.id}</div>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:18, paddingBottom:18, position:"relative" }}>
            <div style={{ fontFamily:F_BODY, fontSize:11.5 }}>
              <div style={{ opacity:0.7 }}>BMU</div><div style={{ fontWeight:600, marginBottom:8 }}>{fisher.bmu}</div>
              <div style={{ opacity:0.7 }}>County</div><div style={{ fontWeight:600, marginBottom:8 }}>{fisher.county}</div>
              <div style={{ opacity:0.7 }}>Valid until</div><div style={{ fontWeight:600 }}>{fisher.membershipExpiry}</div>
            </div>
            <div style={{ background:"#fff", padding:6, borderRadius:8, height:"fit-content" }}>
              <img src={qrUrl(`FISHER|${fisher.id}|${fisher.name}|${fisher.bmu}`,120)} alt="QR code" width={100} height={100} style={{ display:"block" }} />
            </div>
          </div>
          <svg viewBox="0 0 400 20" style={{ width:"100%", display:"block" }}><path d="M0,10 Q50,20 100,10 T200,10 T300,10 T400,10 V20 H0 Z" fill="rgba(255,255,255,0.12)" /></svg>
        </div>
        <div style={{ background:T.panel, borderRadius:"0 0 18px 18px", padding:14, display:"flex", justifyContent:"space-between", alignItems:"center", border:`1px solid ${T.line}`, borderTop:"none" }}>
          <Stamp label={fisher.membershipStatus} tone={STATUS_TONE[fisher.membershipStatus]} />
          <div style={{ display:"flex", gap:8 }}>
            <Btn small tone="ghost" icon={Printer}>Print</Btn>
            <Btn small icon={X} onClick={onClose}>Close</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerifyPage() {
  const [query, setQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const toast = useToast();
  const [log, setLog] = useState(Array.from({length:6}).map((_,i)=>{
    const f = rand(FISHERS);
    return { id:`VER-${pad(i+1,3)}`, fisher:f.name, fisherId:f.id, time: fmtDate(daysAgo(randInt(0,10))), by: rand(RANGERS), outcome: f.membershipStatus==="Active" ? "Valid" : "Flagged" };
  }));

  const runVerify = (fisher) => {
    setScanning(true); setResult(null);
    setTimeout(()=>{
      setScanning(false); setResult(fisher);
      setLog(l=>[{ id:`VER-${pad(l.length+1,3)}`, fisher:fisher.name, fisherId:fisher.id, time:fmtDate(new Date()), by:"You (this session)", outcome: fisher.membershipStatus==="Active"?"Valid":"Flagged" }, ...l]);
      toast(`Verified ${fisher.name} — ${fisher.membershipStatus}`, fisher.membershipStatus==="Active"?"success":"coral");
    }, 1200);
  };

  const matches = query.length>1 ? FISHERS.filter(f=>f.name.toLowerCase().includes(query.toLowerCase()) || f.id.toLowerCase().includes(query.toLowerCase())).slice(0,5) : [];

  return (
    <div>
      <SectionHeader eyebrow="Identity & membership check" title="Verify member QR code" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }} className="grid-2">
        <Card>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
            <div style={{ width:36, height:36, borderRadius:9, background:T.cyanPale, display:"flex", alignItems:"center", justifyContent:"center" }}><ScanLine size={18} color={T.blue} /></div>
            <div style={{ fontFamily:F_BODY, fontWeight:600, fontSize:13.5 }}>Scan or search a member card</div>
          </div>
          <div style={{ border:`2px dashed ${T.line}`, borderRadius:12, padding:"26px 16px", textAlign:"center", background:T.panelAlt, marginBottom:14 }}>
            {scanning ? (
              <>
                <RefreshCw size={26} color={T.blue} style={{ animation:"spin 1s linear infinite" }} />
                <div style={{ fontFamily:F_BODY, fontSize:12.5, color:T.inkSoft, marginTop:10 }}>Reading QR code…</div>
              </>
            ) : (
              <>
                <QrCode size={30} color={T.blueLight} />
                <div style={{ fontFamily:F_BODY, fontSize:12.5, color:T.inkSoft, marginTop:10 }}>Point a device camera at the member's card, or search below</div>
                <div style={{ marginTop:12 }}><Btn small icon={ScanLine} onClick={()=>runVerify(rand(FISHERS))}>Simulate scan</Btn></div>
              </>
            )}
          </div>
          <div style={{ position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, background:T.panelAlt, border:`1px solid ${T.line}`, borderRadius:8, padding:"8px 11px" }}>
              <Search size={14} color={T.inkFaint} />
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search fisher name or ID…" style={{ border:"none", outline:"none", background:"transparent", fontFamily:F_BODY, fontSize:13, width:"100%" }} />
            </div>
            {matches.length>0 && (
              <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, background:"#fff", border:`1px solid ${T.line}`, borderRadius:9, boxShadow:"0 10px 24px rgba(0,0,0,0.1)", zIndex:5 }}>
                {matches.map(f=>(
                  <div key={f.id} onClick={()=>{ setQuery(""); runVerify(f); }} style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 11px", cursor:"pointer", borderBottom:`1px solid ${T.line}` }}>
                    <Avatar name={f.name} size={26} />
                    <div><div style={{ fontFamily:F_BODY, fontSize:12.5, fontWeight:600 }}>{f.name}</div><div style={{ fontFamily:F_MONO, fontSize:10.5, color:T.inkFaint }}>{f.id} · {f.bmu}</div></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card style={{ display:"flex", flexDirection:"column", justifyContent: result ? "flex-start":"center" }}>
          {!result && !scanning && <div style={{ textAlign:"center", color:T.inkFaint, fontFamily:F_BODY, fontSize:13, padding:"30px 10px" }}><IdCard size={26} style={{ marginBottom:8 }}/><div>Verification result will appear here.</div></div>}
          {scanning && <div style={{ textAlign:"center", color:T.inkFaint, fontFamily:F_BODY, fontSize:13, padding:"30px 10px" }}>Checking registry…</div>}
          {result && (
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background: result.membershipStatus==="Active"?T.successPale:T.coralPale, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <CheckCircle2 size={22} color={result.membershipStatus==="Active"?T.success:T.coral} />
                </div>
                <div>
                  <div style={{ fontFamily:F_DISPLAY, fontWeight:700, fontSize:16 }}>{result.membershipStatus==="Active" ? "Membership Valid" : "Membership Flagged"}</div>
                  <div style={{ fontFamily:F_MONO, fontSize:11, color:T.inkFaint }}>Verified just now</div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10, background:T.panelAlt, borderRadius:10, padding:12, marginBottom:12 }}>
                <Avatar name={result.name} />
                <div><div style={{ fontFamily:F_BODY, fontWeight:600, fontSize:13.5 }}>{result.name}</div><div style={{ fontFamily:F_MONO, fontSize:10.5, color:T.inkFaint }}>{result.id}</div></div>
                <div style={{ marginLeft:"auto" }}><Stamp label={result.membershipStatus} tone={STATUS_TONE[result.membershipStatus]} /></div>
              </div>
              <div style={{ display:"grid", gap:8 }}>
                {[["BMU",result.bmu],["County",result.county],["Landing site",result.landingSite],["Membership expiry",result.membershipExpiry],["Vessels linked",result.vesselsCount]].map(([k,v])=>(
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:12.5 }}><span style={{ color:T.inkFaint }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span></div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
      <Card pad={0}>
        <div style={{ padding:16, borderBottom:`1px solid ${T.line}`, fontFamily:F_BODY, fontWeight:600, fontSize:13.5 }}>Recent verifications</div>
        <Table columns={["ID","Fisher","Verified by","Date","Outcome"]} rows={log} renderRow={(r,i)=>(
          <tr key={i}><Td mono>{r.id}</Td><Td>{r.fisher} <span style={{ color:T.inkFaint, fontFamily:F_MONO, fontSize:10.5 }}>({r.fisherId})</span></Td><Td>{r.by}</Td><Td mono>{r.time}</Td><Td><Stamp label={r.outcome} tone={r.outcome==="Valid"?"success":"coral"} /></Td></tr>
        )} />
      </Card>
    </div>
  );
}

/* ============================== WIZARD (multi-step forms) ============================== */
function Field({ label, value, onChange, type="text", options }) {
  return (
    <div>
      <label style={{ fontFamily:F_BODY, fontSize:11.5, color:T.inkSoft, fontWeight:600 }}>{label}</label>
      {type==="select" ? (
        <select value={value} onChange={e=>onChange(e.target.value)} style={{ width:"100%", marginTop:5, border:`1px solid ${T.line}`, borderRadius:8, padding:"9px 11px", fontFamily:F_BODY, fontSize:13, background:T.panelAlt, color:T.ink }}>
          <option value="">Select…</option>
          {options.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={type==="date"?"dd/mm/yyyy":""} style={{ width:"100%", marginTop:5, border:`1px solid ${T.line}`, borderRadius:8, padding:"9px 11px", fontFamily:F_BODY, fontSize:13, background:T.panelAlt, color:T.ink, boxSizing:"border-box" }} />
      )}
    </div>
  );
}
function Wizard({ title, subtitle, steps, onClose, onDone }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const set = (k,v) => setData(d=>({ ...d, [k]:v }));
  const last = step === steps.length - 1;
  const pct = Math.round(((step+1)/steps.length)*100);
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(6,38,65,0.5)", zIndex:60, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:T.panel, borderRadius:16, width:"min(520px,95vw)", overflow:"hidden" }}>
        <div style={{ padding:"20px 24px 0" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontFamily:F_MONO, fontSize:10.5, color:T.blueLight, letterSpacing:"0.1em", textTransform:"uppercase" }}>{subtitle}</div>
              <h3 style={{ fontFamily:F_DISPLAY, fontSize:18, margin:"3px 0 0" }}>{title}</h3>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer" }}><X size={18} color={T.inkSoft} /></button>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:16, marginBottom:8 }}>
            {steps.map((s,i)=>(
              <div key={s.name} style={{ flex:1, textAlign:"center", position:"relative" }}>
                <div style={{ width:24, height:24, margin:"0 auto", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F_MONO, fontSize:11, fontWeight:700, background: i<=step ? T.blue : T.panelAlt, color: i<=step ? "#fff" : T.inkFaint, border: i<=step ? "none" : `1px solid ${T.line}` }}>{i<step ? <CheckCircle2 size={13}/> : i+1}</div>
                <div style={{ fontFamily:F_BODY, fontSize:10.5, color: i===step?T.ink:T.inkFaint, marginTop:5, fontWeight: i===step?600:500 }}>{s.name}</div>
              </div>
            ))}
          </div>
          <div style={{ height:5, background:T.panelAlt, borderRadius:4, marginBottom:20 }}>
            <div style={{ height:"100%", width:`${pct}%`, background:T.blue, borderRadius:4, transition:"width .25s" }} />
          </div>
        </div>
        <div style={{ padding:"0 24px", minHeight:170 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {steps[step].fields.map(f=>(
              <div key={f.key} style={{ gridColumn: f.wide ? "span 2" : "span 1" }}>
                <Field label={f.label} type={f.type} options={f.options} value={data[f.key]||""} onChange={v=>set(f.key,v)} />
              </div>
            ))}
          </div>
          {last && (
            <div style={{ marginTop:14, background:T.panelAlt, borderRadius:10, padding:12, fontFamily:F_BODY, fontSize:12, color:T.inkSoft }}>
              Review the details above, then submit to save this record to the registry.
            </div>
          )}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", padding:20 }}>
          <Btn tone="ghost" small icon={ChevronLeft} disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))}>Back</Btn>
          {!last ? (
            <Btn small icon={ChevronRight} onClick={()=>setStep(s=>Math.min(steps.length-1,s+1))}>Next step</Btn>
          ) : (
            <Btn small icon={CheckCircle2} onClick={()=>{ onDone && onDone(data); onClose(); }}>Submit record</Btn>
          )}
        </div>
      </div>
    </div>
  );
}
const CATCH_STEPS = [
  { name:"Location", fields:[
    { key:"landingSite", label:"Landing site", type:"select", options: BMUS.map(b=>b.name.replace(" BMU"," Landing Site")) },
    { key:"date", label:"Date", type:"date" },
  ]},
  { name:"Catch details", fields:[
    { key:"species", label:"Species", type:"select", options: SPECIES.map(s=>s.name) },
    { key:"gear", label:"Gear type", type:"select", options: GEAR },
    { key:"qty", label:"Quantity (kg)", type:"number" },
    { key:"fisher", label:"Fisher", type:"select", options: FISHERS.slice(0,10).map(f=>f.name) },
  ]},
  { name:"Review", fields:[] },
];
const FISHER_STEPS = [
  { name:"Personal", fields:[
    { key:"name", label:"Full name", type:"text", wide:true },
    { key:"gender", label:"Gender", type:"select", options:["Male","Female"] },
    { key:"nationalId", label:"National ID", type:"text" },
    { key:"phone", label:"Phone number", type:"text" },
  ]},
  { name:"BMU & location", fields:[
    { key:"county", label:"County", type:"select", options: COUNTIES },
    { key:"bmu", label:"BMU", type:"select", options: BMUS.map(b=>b.name) },
    { key:"landingSite", label:"Landing site", type:"text", wide:true },
  ]},
  { name:"Documents", fields:[
    { key:"idDoc", label:"National ID upload", type:"text" },
    { key:"license", label:"Fishing license upload", type:"text" },
  ]},
  { name:"Review", fields:[] },
];

/* ============================== NAV CONFIG ============================== */
const NAV = [
  { key:"dashboard", label:"Dashboard", icon:Home, roles:["Admin","County Fisheries Officer","BMU Manager","Ranger","Fisher"] },
  { key:"fishers", label:"Fishers", icon:Users, roles:["Admin","County Fisheries Officer","BMU Manager"] },
  { key:"vessels", label:"BMUs & Vessels", icon:Ship, roles:["Admin","County Fisheries Officer","BMU Manager"] },
  { key:"catch", label:"Fisheries Data", icon:Fish, roles:["Admin","County Fisheries Officer","BMU Manager"] },
  { key:"patrol", label:"Patrol & Compliance", icon:ShieldCheck, roles:["Admin","County Fisheries Officer","Ranger"] },
  { key:"verify", label:"Verify Member", icon:QrCode, roles:["Admin","County Fisheries Officer","BMU Manager","Ranger"] },
  { key:"documents", label:"Documents", icon:FolderOpen, roles:["Admin","BMU Manager","Fisher"] },
  { key:"payments", label:"Payments", icon:CreditCard, roles:["Admin","BMU Manager","Fisher"] },
  { key:"county", label:"County Oversight", icon:Landmark, roles:["Admin","County Fisheries Officer"] },
  { key:"reports", label:"Reports & Analytics", icon:BarChart3, roles:["Admin","County Fisheries Officer","BMU Manager","Ranger"] },
  { key:"profile", label:"My Profile", icon:BadgeCheck, roles:["Fisher"] },
  { key:"settings", label:"Settings", icon:Settings, roles:["Admin"] },
];
const ROLES = [
  { name:"Admin", desc:"Platform, counties, BMUs & permissions", icon:Settings },
  { name:"County Fisheries Officer", desc:"County-level oversight & reporting", icon:Landmark },
  { name:"BMU Manager", desc:"Fisher & vessel registration, renewals", icon:Anchor },
  { name:"Ranger", desc:"Patrols, inspections & compliance", icon:ShieldCheck },
  { name:"Fisher", desc:"My profile, vessels & documents", icon:Fish },
];
/* ============================== LOGIN ============================== */

function LoginScreen({ onSelect }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at top left, rgba(63,198,218,0.15), transparent 35%),
          radial-gradient(circle at bottom right, rgba(255,193,7,0.08), transparent 30%),
          linear-gradient(160deg, ${T.deep} 0%, ${T.deepAlt} 55%, ${T.blue} 100%)
        `,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 18px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 940,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                background: T.amber,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              }}
            >
              <Waves size={22} color={T.deep} />
            </div>

            <span
              style={{
                fontFamily: F_MONO,
                fontSize: 12,
                letterSpacing: "0.18em",
                color: "#BFE3EE",
                textTransform: "uppercase",
              }}
            >
              Lake County Fisheries Registry
            </span>
          </div>

          <h1
            style={{
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: "clamp(28px,4vw,42px)",
              color: "#fff",
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            One ledger for every fisher,
            <br />
            vessel, patrol and catch.
          </h1>

          <p
            style={{
              color: "#9FCBDB",
              fontFamily: F_BODY,
              fontSize: 14.5,
              marginTop: 14,
              maxWidth: 540,
              marginInline: "auto",
            }}
          >
            Live registration, QR-verified membership cards, patrol tracking
            and county-level reporting — all in one platform. Select a role to
            preview its workspace.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
            gap: 12,
          }}
        >
          {ROLES.map((r) => (
            <button
              key={r.name}
              onClick={() => onSelect(r.name)}
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16,
                padding: "20px 16px",
                textAlign: "left",
                cursor: "pointer",
                color: "#fff",
                transition: "all 0.25s ease",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "rgba(63,198,218,0.16)";
                e.currentTarget.style.transform =
                  "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.08)";
                e.currentTarget.style.transform =
                  "translateY(0px)";
              }}
            >
              <r.icon size={20} color={T.amber} />

              <div
                style={{
                  fontFamily: F_DISPLAY,
                  fontWeight: 600,
                  fontSize: 15.5,
                  marginTop: 14,
                }}
              >
                {r.name}
              </div>

              <div
                style={{
                  fontFamily: F_BODY,
                  fontSize: 12,
                  color: "#9FCBDB",
                  marginTop: 5,
                  lineHeight: 1.4,
                }}
              >
                {r.desc}
              </div>

              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  color: T.amber,
                  fontFamily: F_BODY,
                  fontWeight: 600,
                }}
              >
                Enter workspace
                <ChevronRight size={14} />
              </div>
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 22,
            marginTop: 34,
            flexWrap: "wrap",
          }}
        >
          {[
            ["Installable PWA", Smartphone],
            ["QR member verification", QrCode],
            ["PDF & CSV export", FileText],
            ["Live station feed", Activity],
          ].map(([t, Icon]) => (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                color: "#8FC0D3",
                fontFamily: F_BODY,
                fontSize: 12.5,
              }}
            >
              <Icon size={14} />
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================== SHELL ============================== */
function Sidebar({ role, view, setView, mobileOpen, setMobileOpen, onLogout }) {
  const items = NAV.filter(n=>n.roles.includes(role));
  return (
    <>
      {mobileOpen && <div onClick={()=>setMobileOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:30 }} className="lg-hide" />}
      <aside style={{ width:250, background:T.deep, color:"#fff", display:"flex", flexDirection:"column", position:"fixed", top:0, bottom:0, left: mobileOpen ? 0 : undefined, zIndex:35, transform: mobileOpen ? "translateX(0)" : undefined }} className={mobileOpen ? "sidebar-mobile-open" : "sidebar"}>
        <div style={{ padding:"22px 20px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ width:34, height:34, borderRadius:9, background:T.amber, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Waves size={17} color={T.deep} /></div>
          <div><div style={{ fontFamily:F_DISPLAY, fontWeight:700, fontSize:14.5, lineHeight:1.1 }}>Lake Fisheries</div><div style={{ fontFamily:F_MONO, fontSize:9.5, letterSpacing:"0.1em", color:"#8FC0D3", textTransform:"uppercase" }}>Registry Platform</div></div>
          <button onClick={()=>setMobileOpen(false)} style={{ marginLeft:"auto", background:"none", border:"none", color:"#fff", display:"none" }} className="close-btn"><X size={18}/></button>
        </div>
        <nav style={{ flex:1, padding:"14px 12px", overflowY:"auto" }}>
          {items.map(it=>{
            const active = view===it.key;
            return (
              <button key={it.key} onClick={()=>{ setView(it.key); setMobileOpen(false); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:11, padding:"10px 12px", marginBottom:3, background: active ? "rgba(63,198,218,0.16)" : "transparent", borderLeft: active ? `3px solid ${T.amber}` : "3px solid transparent", border:"none", borderRadius:8, cursor:"pointer", textAlign:"left", color: active ? "#fff" : "#AFCEDB", fontFamily:F_BODY, fontWeight: active?600:500, fontSize:13.5 }}>
                <it.icon size={16} color={active ? T.amber : "#6E9DAF"} />{it.label}
              </button>
            );
          })}
        </nav>
        <div style={{ padding:14, borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:10, padding:12, marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:11.5, color:"#9FCBDB", fontFamily:F_BODY, fontWeight:600 }}><Smartphone size={13}/> Install as app</div>
            <div style={{ fontSize:11, color:"#6E9DAF", marginTop:3, fontFamily:F_BODY }}>Works offline on phones &amp; tablets.</div>
          </div>
          <button onClick={onLogout} style={{ width:"100%", display:"flex", alignItems:"center", gap:9, background:"none", border:"none", color:"#AFCEDB", fontFamily:F_BODY, fontSize:13, cursor:"pointer", padding:"8px 12px" }}><LogOut size={15}/> Switch role</button>
        </div>
      </aside>
    </>
  );
}
function Topbar({ role, view, setMobileOpen, onQuickAdd }) {
  const label = (NAV.find(n=>n.key===view)||{}).label || "Dashboard";
  const [menu, setMenu] = useState(false);
  return (
    <div style={{ position:"sticky", top:0, zIndex:20, background:`${T.bg}F5`, backdropFilter:"blur(6px)", borderBottom:`1px solid ${T.line}`, padding:"14px 22px", display:"flex", alignItems:"center", gap:14 }}>
      <button onClick={()=>setMobileOpen(true)} className="menu-btn" style={{ background:"none", border:`1px solid ${T.line}`, borderRadius:8, padding:7, display:"none" }}><Menu size={17} color={T.ink}/></button>
      <div>
        <div style={{ fontFamily:F_MONO, fontSize:10.5, letterSpacing:"0.1em", color:T.inkFaint, textTransform:"uppercase" }}>{role}</div>
        <div style={{ fontFamily:F_DISPLAY, fontWeight:600, fontSize:17, color:T.ink }}>{label}</div>
      </div>
      <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10, position:"relative" }}>
        <div className="search-wrap" style={{ display:"flex", alignItems:"center", gap:7, background:T.panel, border:`1px solid ${T.line}`, borderRadius:9, padding:"7px 12px" }}>
          <Search size={14} color={T.inkFaint} />
          <input placeholder="Search records…" style={{ border:"none", outline:"none", fontFamily:F_BODY, fontSize:13, background:"transparent", width:140 }} />
        </div>
        <button onClick={()=>setMenu(m=>!m)} style={{ background:T.deep, border:"none", borderRadius:9, padding:"8px 10px", display:"flex", alignItems:"center", gap:5, color:"#fff", cursor:"pointer" }}><Plus size={15}/></button>
        {menu && (
          <div style={{ position:"absolute", top:"calc(100% + 8px)", right:78, background:"#fff", border:`1px solid ${T.line}`, borderRadius:10, boxShadow:"0 10px 24px rgba(0,0,0,0.12)", width:190, zIndex:40, overflow:"hidden" }}>
            {[["Register fisher",Users,"fisher"],["Log catch",Fish,"catch"],["Log patrol",ShieldCheck,"patrol"],["Verify member",QrCode,"verify"]].map(([t,Icon,k])=>(
              <button key={t} onClick={()=>{ setMenu(false); onQuickAdd(k); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"10px 12px", background:"none", border:"none", cursor:"pointer", fontFamily:F_BODY, fontSize:12.5, color:T.ink, borderBottom:`1px solid ${T.line}` }}><Icon size={14} color={T.blue}/>{t}</button>
            ))}
          </div>
        )}
        <button style={{ background:T.panel, border:`1px solid ${T.line}`, borderRadius:9, padding:8, position:"relative" }}>
          <Bell size={15} color={T.ink} /><span style={{ position:"absolute", top:5, right:5, width:6, height:6, borderRadius:"50%", background:T.coral }} />
        </button>
        <div style={{ width:34, height:34, borderRadius:"50%", background:T.cyanPale, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F_DISPLAY, fontWeight:700, fontSize:13, color:T.blue }}>{role.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
      </div>
    </div>
  );
}

/* ============================== PAGES ============================== */
function Dashboard({ role, openWizard }) {
  const scopedFishers = role==="BMU Manager" ? FISHERS.filter(f=>f.bmu===FISHERS[0].bmu) : FISHERS;
  const activeMembers = scopedFishers.filter(f=>f.membershipStatus==="Active").length;
  const totalCatch = CATCHES.reduce((s,c)=>s+c.quantityKg,0);
  const openIncidents = INCIDENTS.filter(i=>i.status!=="Resolved").length;
  const revenue = PAYMENTS.filter(p=>p.status==="Paid").reduce((s,p)=>s+p.amount,0);

  return (
    <div>
      <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:22 }}>
        <KPI icon={Users} label="Registered fishers" value={scopedFishers.length} delta="+4 this month" tone="blue" />
        <KPI icon={BadgeCheck} label="Active BMU memberships" value={activeMembers} delta="+2 this week" tone="success" />
        <KPI icon={Fish} label="Catch recorded (kg)" value={totalCatch.toLocaleString()} delta="6 mo trend" tone="amber" />
        <KPI icon={AlertTriangle} label="Open compliance cases" value={openIncidents} tone="coral" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:16, marginBottom:16 }} className="grid-2">
        <StationsMap />
        <LiveActivityFeed />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:16, marginBottom:16 }} className="grid-2">
        <Card>
          <SectionHeader eyebrow="Fisheries monitoring" title="Catch volume — last 6 months" />
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={catchByMonth}>
              <CartesianGrid stroke={T.line} vertical={false} />
              <XAxis dataKey="month" tick={{ fontFamily:F_MONO, fontSize:11, fill:T.inkFaint }} axisLine={{stroke:T.line}} tickLine={false} />
              <YAxis tick={{ fontFamily:F_MONO, fontSize:11, fill:T.inkFaint }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontFamily:F_BODY, fontSize:12.5, borderRadius:8, border:`1px solid ${T.line}` }} />
              <Line type="monotone" dataKey="kg" stroke={T.blue} strokeWidth={2.5} dot={{ r:3, fill:T.blue }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionHeader eyebrow="Membership" title="Status breakdown" />
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie data={membershipDist} dataKey="value" nameKey="name" innerRadius={48} outerRadius={74} paddingAngle={3}>
                {membershipDist.map((e,i)=><Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontFamily:F_BODY, fontSize:12.5, borderRadius:8, border:`1px solid ${T.line}` }} />
              <Legend wrapperStyle={{ fontFamily:F_BODY, fontSize:12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }} className="grid-3">
        <Card>
          <SectionHeader eyebrow="Species mix" title="Catch by species" />
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={catchBySpecies} layout="vertical" margin={{ left:10 }}>
              <CartesianGrid stroke={T.line} horizontal={false} />
              <XAxis type="number" tick={{ fontFamily:F_MONO, fontSize:10, fill:T.inkFaint }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={70} tick={{ fontFamily:F_BODY, fontSize:10.5, fill:T.ink }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontFamily:F_BODY, fontSize:12.5, borderRadius:8, border:`1px solid ${T.line}` }} />
              <Bar dataKey="kg" fill={T.amber} radius={[0,5,5,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionHeader eyebrow="Revenue" title="Fee collection trend" />
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={revenueByMonth}>
              <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.blueLight} stopOpacity={0.5}/><stop offset="100%" stopColor={T.blueLight} stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid stroke={T.line} vertical={false} />
              <XAxis dataKey="month" tick={{ fontFamily:F_MONO, fontSize:10, fill:T.inkFaint }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily:F_MONO, fontSize:10, fill:T.inkFaint }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontFamily:F_BODY, fontSize:12.5, borderRadius:8, border:`1px solid ${T.line}` }} formatter={(v)=>fmtKES(v)} />
              <Area type="monotone" dataKey="kes" stroke={T.blue} fill="url(#rev)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionHeader eyebrow="Compliance" title="County score" />
          <ResponsiveContainer width="100%" height={190}>
            <RadialBarChart innerRadius="30%" outerRadius="100%" data={countyStats} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="compliance" background cornerRadius={6}>{countyStats.map((e,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}</RadialBar>
              <Tooltip contentStyle={{ fontFamily:F_BODY, fontSize:11.5, borderRadius:8 }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function FishersPage({ openWizard }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState(null);
  const [cardFor, setCardFor] = useState(null);
  const filtered = FISHERS.filter(f => (status==="All" || f.membershipStatus===status) && (f.name.toLowerCase().includes(q.toLowerCase()) || f.bmu.toLowerCase().includes(q.toLowerCase())));
  return (
    <div>
      <SectionHeader eyebrow="Registration & membership" title="Fisher registry" action={<Btn icon={Plus} onClick={()=>openWizard("fisher")}>Register fisher</Btn>} />
      <Card pad={0}>
        <div style={{ display:"flex", gap:10, padding:16, borderBottom:`1px solid ${T.line}`, flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, background:T.panelAlt, border:`1px solid ${T.line}`, borderRadius:8, padding:"7px 11px", flex:"1 1 220px" }}>
            <Search size={14} color={T.inkFaint} />
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name or BMU…" style={{ border:"none", outline:"none", background:"transparent", fontFamily:F_BODY, fontSize:13, width:"100%" }} />
          </div>
          {["All","Active","Pending","Expired"].map(s=>(<button key={s} onClick={()=>setStatus(s)} style={{ padding:"7px 12px", borderRadius:8, border:`1px solid ${status===s?T.deep:T.line}`, background:status===s?T.deep:"transparent", color:status===s?"#fff":T.inkSoft, fontFamily:F_BODY, fontSize:12.5, fontWeight:600, cursor:"pointer" }}>{s}</button>))}
        </div>
        <Table columns={["Fisher","National ID","County / BMU","Landing Site","Vessels","Membership","Expiry",""]} rows={filtered.slice(0,18)} renderRow={(f,i)=>(
          <tr key={i} style={{ cursor:"pointer" }}>
            <Td onClick={()=>setSelected(f)}><div style={{ display:"flex", alignItems:"center", gap:9 }}><Avatar name={f.name} size={30} /><div><div style={{ fontWeight:600 }}>{f.name}</div><div style={{ fontFamily:F_MONO, fontSize:11, color:T.inkFaint }}>{f.id}</div></div></div></Td>
            <Td mono>{f.nationalId}</Td>
            <Td>{f.county}<div style={{ fontSize:11.5, color:T.inkFaint }}>{f.bmu}</div></Td>
            <Td>{f.landingSite}</Td>
            <Td>{f.vesselsCount}</Td>
            <Td><Stamp label={f.membershipStatus} tone={STATUS_TONE[f.membershipStatus]} /></Td>
            <Td mono style={{ color:T.inkSoft }}>{f.membershipExpiry}</Td>
            <Td><div style={{ display:"flex", gap:10 }}><Eye size={15} color={T.inkFaint} onClick={()=>setSelected(f)} style={{cursor:"pointer"}} /><QrCode size={15} color={T.blue} onClick={()=>setCardFor(f)} style={{cursor:"pointer"}} /></div></Td>
          </tr>
        )} />
      </Card>

      {selected && (
        <div onClick={()=>setSelected(null)} style={{ position:"fixed", inset:0, background:"rgba(6,38,65,0.45)", zIndex:50, display:"flex", justifyContent:"flex-end" }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"min(420px,92vw)", background:T.panel, height:"100%", padding:24, overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <span style={{ fontFamily:F_MONO, fontSize:11, color:T.inkFaint }}>{selected.id}</span>
              <button onClick={()=>setSelected(null)} style={{ background:"none", border:"none" }}><X size={18} color={T.inkSoft} /></button>
            </div>
            <Avatar name={selected.name} size={56} />
            <h3 style={{ fontFamily:F_DISPLAY, fontSize:20, margin:"12px 0 4px" }}>{selected.name}</h3>
            <Stamp label={selected.membershipStatus} tone={STATUS_TONE[selected.membershipStatus]} />
            <div style={{ marginTop:20, display:"grid", gap:12 }}>
              {[["Gender",selected.gender],["Phone",selected.phone],["National ID",selected.nationalId],["County",selected.county],["Sub-county",selected.subcounty],["BMU",selected.bmu],["Landing site",selected.landingSite],["Registered",selected.dateRegistered],["Membership expiry",selected.membershipExpiry],["Vessels linked",selected.vesselsCount]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", borderBottom:`1px solid ${T.line}`, paddingBottom:8 }}><span style={{ fontFamily:F_BODY, fontSize:12.5, color:T.inkFaint }}>{k}</span><span style={{ fontFamily:F_BODY, fontSize:13, fontWeight:600, color:T.ink }}>{v}</span></div>
              ))}
            </div>
            <div style={{ marginTop:20, display:"flex", gap:8, flexWrap:"wrap" }}>
              <Btn small icon={IdCard} onClick={()=>setCardFor(selected)}>View ID card</Btn>
              <Btn small tone="ghost" icon={Download}>Export profile</Btn>
            </div>
          </div>
        </div>
      )}
      {cardFor && <MemberCardModal fisher={cardFor} onClose={()=>setCardFor(null)} />}
    </div>
  );
}

function BMUVesselsPage() {
  const [tab, setTab] = useState("BMUs");
  return (
    <div>
      <SectionHeader eyebrow="Membership & vessel registration" title="BMUs & vessel registry" action={<Btn icon={Plus}>Register vessel</Btn>} />
      <Tabs items={["BMUs","Vessels"]} active={tab} onChange={setTab} />
      {tab==="BMUs" ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14 }}>
          {BMUS.map(b=>{
            const members = FISHERS.filter(f=>f.bmu===b.name);
            const active = members.filter(m=>m.membershipStatus==="Active").length;
            const vessels = VESSELS.filter(v=>v.bmu===b.name).length;
            return (
              <Card key={b.name}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:T.cyanPale, display:"flex", alignItems:"center", justifyContent:"center" }}><Anchor size={17} color={T.blue} /></div>
                  <Stamp label={b.county} tone="ink" />
                </div>
                <div style={{ fontFamily:F_DISPLAY, fontWeight:600, fontSize:15.5, marginTop:12 }}>{b.name}</div>
                <div style={{ display:"flex", gap:18, marginTop:12 }}>
                  <div><div style={{ fontFamily:F_DISPLAY, fontSize:19, fontWeight:700 }}>{members.length}</div><div style={{ fontSize:11.5, color:T.inkFaint }}>Fishers</div></div>
                  <div><div style={{ fontFamily:F_DISPLAY, fontSize:19, fontWeight:700 }}>{active}</div><div style={{ fontSize:11.5, color:T.inkFaint }}>Active members</div></div>
                  <div><div style={{ fontFamily:F_DISPLAY, fontSize:19, fontWeight:700 }}>{vessels}</div><div style={{ fontSize:11.5, color:T.inkFaint }}>Vessels</div></div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card pad={0}>
          <Table columns={["Reg. No.","Owner","BMU","Type","Engine","Capacity","Status","Expiry"]} rows={VESSELS} renderRow={(v,i)=>(
            <tr key={i}><Td mono style={{ fontWeight:600 }}>{v.regNo}</Td><Td>{v.owner}</Td><Td>{v.bmu}</Td><Td>{v.type}</Td><Td>{v.engine}</Td><Td>{v.capacity}</Td><Td><Stamp label={v.regStatus} tone={STATUS_TONE[v.regStatus]} /></Td><Td mono style={{ color:T.inkSoft }}>{v.expiryDate}</Td></tr>
          )} />
        </Card>
      )}
    </div>
  );
}

function FisheriesDataPage({ openWizard }) {
  return (
    <div>
      <SectionHeader eyebrow="Fisheries monitoring" title="Catch & fish-stock data" action={<Btn icon={Plus} onClick={()=>openWizard("catch")}>Log catch</Btn>} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }} className="grid-2">
        <Card>
          <SectionHeader eyebrow="Trend" title="Monthly landings (kg)" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={catchByMonth}>
              <CartesianGrid stroke={T.line} vertical={false} />
              <XAxis dataKey="month" tick={{ fontFamily:F_MONO, fontSize:11, fill:T.inkFaint }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily:F_MONO, fontSize:11, fill:T.inkFaint }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontFamily:F_BODY, fontSize:12.5, borderRadius:8 }} />
              <Bar dataKey="kg" fill={T.blue} radius={[5,5,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionHeader eyebrow="Mix" title="Species share" />
          <ResponsiveContainer width="100%" height={200}>
            <PieChart><Pie data={catchBySpecies} dataKey="kg" nameKey="name" innerRadius={44} outerRadius={72} paddingAngle={2}>{catchBySpecies.map((e,i)=><Cell key={i} fill={PIE_COLORS[i]} />)}</Pie><Tooltip contentStyle={{ fontFamily:F_BODY, fontSize:12.5, borderRadius:8 }} /></PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card pad={0}>
        <Table columns={["Date","Landing Site","BMU","Species","Gear","Qty (kg)","Est. value","Fisher"]} rows={CATCHES.slice(0,20)} renderRow={(c,i)=>(
          <tr key={i}><Td mono>{c.date}</Td><Td>{c.landingSite}</Td><Td>{c.bmu}</Td><Td>{c.species}</Td><Td>{c.gearType}</Td><Td mono>{c.quantityKg}</Td><Td mono>{fmtKES(c.estValue)}</Td><Td>{c.fisher}</Td></tr>
        )} />
      </Card>
    </div>
  );
}

function PatrolCompliancePage() {
  const [tab, setTab] = useState("Patrols");
  const data = { Patrols: PATROLS, Incidents: INCIDENTS, Inspections: INSPECTIONS, Conservation: CONSERVATION }[tab];
  return (
    <div>
      <SectionHeader eyebrow="Ranger operations" title="Patrol & compliance monitoring" action={<Btn icon={Plus}>New {tab.slice(0,-1).toLowerCase()} record</Btn>} />
      <Tabs items={["Patrols","Incidents","Inspections","Conservation"]} active={tab} onChange={setTab} />
      <Card pad={0}>
        {tab==="Patrols" && <Table columns={["ID","Date","Ranger","BMU / Area","Type","Findings","Status"]} rows={data} renderRow={(p,i)=>(<tr key={i}><Td mono>{p.id}</Td><Td mono>{p.date}</Td><Td>{p.ranger}</Td><Td>{p.bmu}</Td><Td>{p.type}</Td><Td style={{ maxWidth:260 }}>{p.findings}</Td><Td><Stamp label={p.status} tone={STATUS_TONE[p.status]} /></Td></tr>)} />}
        {tab==="Incidents" && <Table columns={["ID","Date","Type","BMU","Severity","Reported by","Status","Evidence"]} rows={data} renderRow={(p,i)=>(<tr key={i}><Td mono>{p.id}</Td><Td mono>{p.date}</Td><Td>{p.type}</Td><Td>{p.bmu}</Td><Td><Stamp label={p.severity} tone={STATUS_TONE[p.severity]} /></Td><Td>{p.reportedBy}</Td><Td><Stamp label={p.status} tone={STATUS_TONE[p.status]} /></Td><Td><Upload size={14} color={T.inkFaint} /></Td></tr>)} />}
        {tab==="Inspections" && <Table columns={["ID","Date","BMU","Subject","Ranger","Result","Notes"]} rows={data} renderRow={(p,i)=>(<tr key={i}><Td mono>{p.id}</Td><Td mono>{p.date}</Td><Td>{p.bmu}</Td><Td mono>{p.subject}</Td><Td>{p.ranger}</Td><Td><Stamp label={p.result} tone={STATUS_TONE[p.result]} /></Td><Td>{p.notes}</Td></tr>)} />}
        {tab==="Conservation" && <Table columns={["ID","Date","BMU","Observation","Severity","Ranger"]} rows={data} renderRow={(p,i)=>(<tr key={i}><Td mono>{p.id}</Td><Td mono>{p.date}</Td><Td>{p.bmu}</Td><Td>{p.observation}</Td><Td><Stamp label={p.severity} tone={STATUS_TONE[p.severity]} /></Td><Td>{p.ranger}</Td></tr>)} />}
      </Card>
    </div>
  );
}

function DocumentsPage() {
  const [filter, setFilter] = useState("All");
  const toast = useToast();
  const filtered = filter==="All" ? DOCUMENTS : DOCUMENTS.filter(d=>d.type===filter);
  return (
    <div>
      <SectionHeader eyebrow="Document & record management" title="Document store" action={<Btn icon={Upload} onClick={()=>toast("Document uploaded for review","blue")}>Upload document</Btn>} />
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {["All",...DOC_TYPES].map(t=>(<button key={t} onClick={()=>setFilter(t)} style={{ padding:"6px 12px", borderRadius:20, border:`1px solid ${filter===t?T.deep:T.line}`, background:filter===t?T.deep:T.panel, color:filter===t?"#fff":T.inkSoft, fontFamily:F_BODY, fontSize:12, fontWeight:600, cursor:"pointer" }}>{t}</button>))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:14 }}>
        {filtered.slice(0,24).map(d=>(
          <Card key={d.id} pad={16}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ width:34, height:34, borderRadius:8, background:T.amberPale, display:"flex", alignItems:"center", justifyContent:"center" }}><FileText size={16} color={T.amberDark} /></div>
              <Stamp label={d.status} tone={STATUS_TONE[d.status]} />
            </div>
            <div style={{ fontFamily:F_BODY, fontWeight:600, fontSize:13, marginTop:12 }}>{d.type}</div>
            <div style={{ fontFamily:F_MONO, fontSize:11, color:T.inkFaint, marginTop:3 }}>{d.fileName}</div>
            <div style={{ borderTop:`1px solid ${T.line}`, marginTop:12, paddingTop:10, fontSize:12, color:T.inkSoft }}><div>{d.owner}</div><div style={{ color:T.inkFaint, marginTop:2 }}>{d.bmu} · uploaded {d.uploadDate}</div></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PaymentsPage() {
  const totalPaid = PAYMENTS.filter(p=>p.status==="Paid").reduce((s,p)=>s+p.amount,0);
  const totalDue = PAYMENTS.filter(p=>p.status!=="Paid"&&p.status!=="Renewed").reduce((s,p)=>s+p.amount,0);
  const toast = useToast();
  return (
    <div>
      <SectionHeader eyebrow="Monetization" title="Fees & payment status" action={<Btn icon={Plus} onClick={()=>toast("Payment recorded")}>Record payment</Btn>} />
      <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:18 }}>
        <KPI icon={CreditCard} label="Collected this cycle" value={fmtKES(totalPaid)} tone="success" />
        <KPI icon={Clock} label="Outstanding balance" value={fmtKES(totalDue)} tone="coral" />
        <KPI icon={TrendingUp} label="Renewal rate" value="81%" delta="+3%" tone="blue" />
      </div>
      <Card pad={0}>
        <Table columns={["ID","Payer","BMU","Fee type","Amount","Due date","Status"]} rows={PAYMENTS} renderRow={(p,i)=>(<tr key={i}><Td mono>{p.id}</Td><Td>{p.payer}</Td><Td>{p.bmu}</Td><Td>{p.type}</Td><Td mono>{fmtKES(p.amount)}</Td><Td mono>{p.dueDate}</Td><Td><Stamp label={p.status} tone={STATUS_TONE[p.status]} /></Td></tr>)} />
      </Card>
    </div>
  );
}

function CountyOversightPage() {
  const toast = useToast();
  return (
    <div>
      <SectionHeader eyebrow="County-level oversight" title="County & BMU performance" action={<Btn icon={Download} tone="ghost" onClick={()=>toast("Summary exported")}>Export summary</Btn>} />
      <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:16, marginBottom:16 }} className="grid-2">
        <Card>
          <SectionHeader eyebrow="Comparison" title="Fishers registered by county" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={countyStats}>
              <CartesianGrid stroke={T.line} vertical={false} />
              <XAxis dataKey="county" tick={{ fontFamily:F_BODY, fontSize:11, fill:T.inkFaint }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily:F_MONO, fontSize:11, fill:T.inkFaint }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontFamily:F_BODY, fontSize:12.5, borderRadius:8 }} />
              <Bar dataKey="fishers" fill={T.blue} radius={[5,5,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionHeader eyebrow="Compliance" title="Average score" />
          <ResponsiveContainer width="100%" height={220}>
            <RadialBarChart innerRadius="35%" outerRadius="100%" data={countyStats} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="compliance" background cornerRadius={6}>{countyStats.map((e,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}</RadialBar>
              <Legend iconSize={8} wrapperStyle={{ fontFamily:F_BODY, fontSize:11 }} layout="vertical" verticalAlign="middle" align="right" />
              <Tooltip contentStyle={{ fontFamily:F_BODY, fontSize:12.5, borderRadius:8 }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card pad={0}>
        <Table columns={["County","BMUs","Fishers","Catch (kg)","Compliance score","Standing"]} rows={countyStats} renderRow={(c,i)=>(<tr key={i}><Td style={{ fontWeight:600 }}>{c.county}</Td><Td>{c.bmus}</Td><Td>{c.fishers}</Td><Td mono>{c.catchKg.toLocaleString()}</Td><Td mono>{c.compliance}%</Td><Td><Stamp label={c.compliance>90?"Excellent":c.compliance>80?"Good":"Needs Review"} tone={c.compliance>90?"success":c.compliance>80?"blue":"amber"} /></Td></tr>)} />
      </Card>
    </div>
  );
}

const RECENT_REPORTS = [
  { id:"RPT-2201", name:"Fisher Registration Summary — Jun 2026", range:"Monthly", format:"PDF", generated:"2 days ago" },
  { id:"RPT-2200", name:"Fisheries Catch Report — Q2 2026", range:"Quarterly", format:"CSV", generated:"5 days ago" },
  { id:"RPT-2199", name:"Compliance & Patrol Digest — Jun 2026", range:"Monthly", format:"PDF", generated:"1 week ago" },
  { id:"RPT-2198", name:"Membership Fee Collection — Q2 2026", range:"Quarterly", format:"CSV", generated:"2 weeks ago" },
];
function ReportsPage() {
  const [range, setRange] = useState("Month");
  const toast = useToast();
  return (
    <div>
      <SectionHeader eyebrow="Reporting & analytics" title="Generate reports" />
      <Card style={{ marginBottom:18 }}>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
          {["Week","Month","Quarter","Year","Custom range"].map(r=>(<button key={r} onClick={()=>setRange(r)} style={{ padding:"7px 14px", borderRadius:8, border:`1px solid ${range===r?T.deep:T.line}`, background:range===r?T.deep:"transparent", color:range===r?"#fff":T.inkSoft, fontFamily:F_BODY, fontSize:12.5, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}><Calendar size={13}/>{r}</button>))}
        </div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <Btn icon={FileText} tone="blue" onClick={()=>toast(`${range} report exported as PDF`)}>Export PDF</Btn>
          <Btn icon={Download} tone="ghost" onClick={()=>toast(`${range} report exported as CSV`)}>Export CSV</Btn>
        </div>
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:14, marginBottom:18 }}>
        {[["Fisher Registration Report",Users,"36 fishers · 5 counties"],["Vessel Registry Report",Ship,"28 vessels · 4 types"],["Fisheries Catch Report",Fish,"70 records · 5 species"],["Compliance & Patrol Report",ShieldCheck,"20 patrols · 16 incidents"],["Membership Fee Report",CreditCard,fmtKES(PAYMENTS.reduce((s,p)=>s+p.amount,0))],["Document Audit Report",FolderOpen,"42 records on file"]].map(([title,Icon,sub])=>(
          <Card key={title} pad={16}>
            <Icon size={18} color={T.blue} />
            <div style={{ fontFamily:F_BODY, fontWeight:600, fontSize:13.5, marginTop:12 }}>{title}</div>
            <div style={{ fontSize:12, color:T.inkFaint, marginTop:3 }}>{sub}</div>
            <div style={{ marginTop:12, display:"flex", gap:6 }}><Stamp label="PDF" tone="ink" /><Stamp label="CSV" tone="ink" /></div>
          </Card>
        ))}
      </div>
      <Card pad={0} style={{ marginBottom:18 }}>
        <div style={{ padding:16, borderBottom:`1px solid ${T.line}`, fontFamily:F_BODY, fontWeight:600, fontSize:13.5 }}>Recently generated reports</div>
        <Table columns={["ID","Report","Range","Format","Generated",""]} rows={RECENT_REPORTS} renderRow={(r,i)=>(<tr key={i}><Td mono>{r.id}</Td><Td>{r.name}</Td><Td>{r.range}</Td><Td><Stamp label={r.format} tone="ink"/></Td><Td>{r.generated}</Td><Td><Download size={14} color={T.blue} style={{cursor:"pointer"}} onClick={()=>toast(`${r.name} downloaded`)} /></Td></tr>)} />
      </Card>
      <Card>
        <SectionHeader eyebrow="Long-term retention" title="Archive status" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:16 }}>
          {[["Years retained","7"],["Archived records","1,204"],["Last backup","Today, 02:00"],["Storage used","3.4 GB"]].map(([k,v])=>(<div key={k}><div style={{ fontFamily:F_DISPLAY, fontSize:22, fontWeight:700 }}>{v}</div><div style={{ fontSize:12, color:T.inkFaint }}>{k}</div></div>))}
        </div>
      </Card>
    </div>
  );
}

function ProfilePage() {
  const me = FISHERS[0];
  const [cardOpen, setCardOpen] = useState(false);
  const myVessels = VESSELS.filter(v=>v.ownerId===me.id);
  const myDocs = DOCUMENTS.filter(d=>d.ownerId===me.id);
  return (
    <div>
      <SectionHeader eyebrow="My account" title="My profile" action={<Btn icon={IdCard} onClick={()=>setCardOpen(true)}>View my QR card</Btn>} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:16 }} className="grid-2">
        <Card>
          <Avatar name={me.name} size={64} />
          <h3 style={{ fontFamily:F_DISPLAY, fontSize:19, margin:"12px 0 4px" }}>{me.name}</h3>
          <Stamp label={me.membershipStatus} tone={STATUS_TONE[me.membershipStatus]} />
          <div style={{ marginTop:16, display:"grid", gap:10 }}>
            {[["Fisher ID",me.id],["Phone",me.phone],["National ID",me.nationalId],["County",me.county],["BMU",me.bmu],["Landing site",me.landingSite],["Membership expiry",me.membershipExpiry]].map(([k,v])=>(<div key={k} style={{ display:"flex", justifyContent:"space-between", borderBottom:`1px solid ${T.line}`, paddingBottom:7 }}><span style={{ fontSize:12, color:T.inkFaint }}>{k}</span><span style={{ fontSize:13, fontWeight:600 }}>{v}</span></div>))}
          </div>
        </Card>
        <div style={{ display:"grid", gap:16 }}>
          <Card pad={0}>
            <div style={{ padding:16, borderBottom:`1px solid ${T.line}`, fontFamily:F_BODY, fontWeight:600, fontSize:13.5 }}>My vessels</div>
            <Table columns={["Reg. No.","Type","Status","Expiry"]} rows={myVessels.length?myVessels:VESSELS.slice(0,2)} renderRow={(v,i)=>(<tr key={i}><Td mono>{v.regNo}</Td><Td>{v.type}</Td><Td><Stamp label={v.regStatus} tone={STATUS_TONE[v.regStatus]} /></Td><Td mono>{v.expiryDate}</Td></tr>)} />
          </Card>
          <Card pad={0}>
            <div style={{ padding:16, borderBottom:`1px solid ${T.line}`, fontFamily:F_BODY, fontWeight:600, fontSize:13.5 }}>My documents</div>
            <Table columns={["Type","File","Status","Uploaded"]} rows={myDocs.length?myDocs:DOCUMENTS.slice(0,3)} renderRow={(d,i)=>(<tr key={i}><Td>{d.type}</Td><Td mono>{d.fileName}</Td><Td><Stamp label={d.status} tone={STATUS_TONE[d.status]} /></Td><Td mono>{d.uploadDate}</Td></tr>)} />
          </Card>
        </div>
      </div>
      {cardOpen && <MemberCardModal fisher={me} onClose={()=>setCardOpen(false)} />}
    </div>
  );
}

function SettingsPage() {
  const [tab, setTab] = useState("Counties & BMUs");
  return (
    <div>
      <SectionHeader eyebrow="Platform administration" title="System settings" />
      <Tabs items={["Counties & BMUs","Users & Permissions","Fee Structures","System"]} active={tab} onChange={setTab} />
      {tab==="Counties & BMUs" && (<Card pad={0}><Table columns={["County","Sub-counties","BMUs","Fishers","Status"]} rows={COUNTIES} renderRow={(c,i)=>(<tr key={i}><Td style={{ fontWeight:600 }}>{c}</Td><Td>{SUBCOUNTIES[c].length}</Td><Td>{BMUS.filter(b=>b.county===c).length}</Td><Td>{FISHERS.filter(f=>f.county===c).length}</Td><Td><Stamp label="Active" tone="success" /></Td></tr>)} /></Card>)}
      {tab==="Users & Permissions" && (<Card pad={0}><Table columns={["Role","Users","Scope","Permissions"]} rows={[{role:"Admin", n:2, scope:"Platform-wide", perm:"Full access"},{role:"County Fisheries Officer", n:5, scope:"County", perm:"View, approve, report"},{role:"BMU Manager", n:10, scope:"BMU", perm:"Register, renew, upload"},{role:"Ranger", n:8, scope:"Assigned area", perm:"Log patrols & incidents"},{role:"Fisher", n:36, scope:"Self", perm:"View & maintain own records"}]} renderRow={(r,i)=>(<tr key={i}><Td style={{ fontWeight:600 }}>{r.role}</Td><Td>{r.n}</Td><Td>{r.scope}</Td><Td>{r.perm}</Td></tr>)} /></Card>)}
      {tab==="Fee Structures" && (<Card pad={0}><Table columns={["BMU","Membership fee","Vessel fee","Renewal cycle"]} rows={BMUS} renderRow={(b,i)=>(<tr key={i}><Td style={{ fontWeight:600 }}>{b.name}</Td><Td mono>{fmtKES(randInt(500,1500))}</Td><Td mono>{fmtKES(randInt(1500,3500))}</Td><Td>Annual</Td></tr>)} /></Card>)}
      {tab==="System" && (<div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:14 }}>{[["Automated backups","Daily · 02:00 EAT",CheckCircle2],["Data retention policy","7 years, then archived",FileText],["Offline sync (PWA)","Enabled",Smartphone],["Payment integrations","M-Pesa, Card (sandbox)",CreditCard]].map(([t,d,Icon])=>(<Card key={t} pad={16}><Icon size={17} color={T.blue} /><div style={{ fontFamily:F_BODY, fontWeight:600, fontSize:13, marginTop:10 }}>{t}</div><div style={{ fontSize:12, color:T.inkFaint, marginTop:3 }}>{d}</div></Card>))}</div>)}
    </div>
  );
}

/* ============================== APP SHELL ============================== */
function AppShell({ role, setRole }) {
  const [view, setView] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wizard, setWizard] = useState(null);
  const toast = useToast();

  const openWizard = (kind) => {
    if (kind==="verify") { setView("verify"); return; }
    if (kind==="patrol") { setView("patrol"); return; }
    setWizard(kind);
  };

  const pages = {
    dashboard: <Dashboard role={role} openWizard={openWizard} />,
    fishers: <FishersPage openWizard={openWizard} />,
    vessels: <BMUVesselsPage />,
    catch: <FisheriesDataPage openWizard={openWizard} />,
    patrol: <PatrolCompliancePage />,
    verify: <VerifyPage />,
    documents: <DocumentsPage />,
    payments: <PaymentsPage />,
    county: <CountyOversightPage />,
    reports: <ReportsPage />,
    profile: <ProfilePage />,
    settings: <SettingsPage />,
  };

  return (
    <div style={{ fontFamily:F_BODY, background:T.bg, minHeight:"100vh" }}>
      <style>{`
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        body { margin:0; }
        ::-webkit-scrollbar { width:8px; height:8px; }
        ::-webkit-scrollbar-thumb { background:#B7CBD4; border-radius:8px; }
        table tr:hover td { background:${T.panelAlt}; }
        input:focus, select:focus { outline:none; border-color:${T.blue}; }
        @keyframes pulseRing { 0%{ transform:scale(0.8); opacity:0.7; } 100%{ transform:scale(2.2); opacity:0; } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @media (max-width:1024px){
          .sidebar { display:none !important; }
          .menu-btn { display:inline-flex !important; }
          .grid-2 { grid-template-columns:1fr !important; }
          .grid-3 { grid-template-columns:1fr !important; }
          .search-wrap { display:none !important; }
        }
        @media (min-width:1025px){ .close-btn{ display:none !important; } }
      `}</style>
      <Sidebar role={role} view={view} setView={setView} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} onLogout={()=>setRole(null)} />
      <div style={{ marginLeft: 250 }} className="main-area">
        <style>{`@media (max-width:1024px){ .main-area{ margin-left:0 !important; } }`}</style>
        <Topbar role={role} view={view} setMobileOpen={setMobileOpen} onQuickAdd={openWizard} />
        <div style={{ padding:"22px", maxWidth:1360 }}>{pages[view]}</div>
      </div>
      {wizard==="catch" && <Wizard title="Log a catch record" subtitle="Fisheries data collection" steps={CATCH_STEPS} onClose={()=>setWizard(null)} onDone={()=>toast("Catch record saved to registry")} />}
      {wizard==="fisher" && <Wizard title="Register a new fisher" subtitle="Fisher registration" steps={FISHER_STEPS} onClose={()=>setWizard(null)} onDone={()=>toast("Fisher registered — pending BMU approval")} />}
    </div>
  );
}

/* ============================== APP ============================== */
export default function App() {
  const [role, setRole] = useState(null);
  if (!role) return (
    <>
      <style>{`${FONT_IMPORT} * { box-sizing:border-box; } html,body { margin:0; overflow-x:hidden; -webkit-text-size-adjust:100%; }`}</style>
      <LoginScreen onSelect={setRole} />
    </>
  );
  return (<ToastProvider><AppShell role={role} setRole={setRole} /></ToastProvider>);
}
