/* ALÉA · perfiles, recomendaciones y diario optativo */
(()=>{
'use strict';
const $=s=>document.querySelector(s),el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
let answers={country:'PA',face:'mixta',faceSensitive:'no',faceConcerns:[],hair:'liso',thickness:'medio',porosity:'no_se',frizz:'no',scalp:'normal',hairGoals:[],oral:'normal',oralGoals:[],makeup:'no',bodyGoals:[],goals:[],periodProduct:'toallas',hormonal:'no_se',budget:'medio',consentCycle:false,notify:false};
let currentStep=0,initialized=false,demo=false,user=null,client=null,events=[],offers=[],selectedDate=null,calMonth=new Date(),setupComplete=false,lastUserId=null;const initialAnswers=JSON.stringify(answers);
const steps=[
{title:'¿Dónde realizas tus compras?',desc:'Así priorizamos tiendas de tu país.',items:[['País','country',['PA:🇵🇦 Panamá','CO:🇨🇴 Colombia','MX:🇲🇽 México','CR:🇨🇷 Costa Rica','ES:🇪🇸 España','US:🇺🇸 Estados Unidos','OT:🌎 Otro']]]},
{title:'Conozcamos tu piel',desc:'Responde según cómo se siente la piel de tu rostro.',items:[['Tipo de piel','face',['seca:Seca','grasa:Grasa','mixta:Mixta','normal:Normal','sensible:Sensible','no_se:No lo sé']],['¿Tu piel reacciona con facilidad?','faceSensitive',['si:Sí','no:No','no_se:No lo sé']],['¿Qué deseas mejorar?','faceConcerns',['sequedad:Sequedad','acne:Brotes','manchas:Tono desigual','brillo:Brillo','textura:Textura','proteccion:Protección solar'],true]]},
{title:'Hablemos de tu cabello',desc:'La textura y el cuero cabelludo ayudan a elegir mejor.',items:[['Forma natural','hair',['liso:Liso','ondulado:Ondulado','rizado:Rizado','afro:Afro / muy rizado']],['Grosor de cada hebra','thickness',['fino:Fino','medio:Medio','grueso:Grueso']],['Porosidad','porosity',['baja:Baja','media:Media','alta:Alta','no_se:No lo sé']],['¿Tienes frizz?','frizz',['si:Sí','no:No']],['Cuero cabelludo','scalp',['seco:Seco','normal:Normal','graso:Graso','sensible:Sensible']],['Objetivos para tu cabello','hairGoals',['hidratacion:Hidratar','definicion:Definir rizos','frizz:Controlar frizz','rotura:Reducir rotura','volumen:Dar volumen'],true]]},
{title:'Sonrisa y cuidado bucal',desc:'Tus respuestas orientan sugerencias, no sustituyen al dentista.',items:[['Sensibilidad de dientes o encías','oral',['sensible:Sensibles','normal:Sin molestias','no_se:No lo sé']],['Qué quieres cuidar','oralGoals',['higiene:Higiene diaria','manchas:Manchas superficiales','sensibilidad:Sensibilidad','aliento:Aliento fresco','encias:Encías'],true]]},
{title:'Tus hábitos de cuidado',desc:'Incluimos maquillaje, cuerpo e higiene cotidiana.',items:[['¿Usas maquillaje?','makeup',['diario:A diario','ocasional:A veces','no:No']],['Intereses corporales','bodyGoals',['hidratacion:Hidratación','sensibilidad:Piel delicada','higiene:Higiene cotidiana','oidos:Higiene externa del oído','desmaquillar:Desmaquillante','toallitas:Toallitas húmedas'],true],['Presupuesto orientativo','budget',['economico:Económico','medio:Intermedio','premium:Premium']]]},
{title:'Cuidados para tu ciclo (opcional)',desc:'Solo guardaremos fechas íntimas si tú lo autorizas.',items:[['Producto menstrual que prefieres','periodProduct',['toallas:Toallas sanitarias','tampones:Tampones','copa:Copa menstrual','ropa:Ropa menstrual','sin_preferencia:Sin preferencia']],['¿Utilizas anticonceptivo hormonal?','hormonal',['si:Sí','no:No','no_se:Prefiero no decirlo']],['¿Quieres guardar registros de ciclo e intimidad?','consentCycle',['si:Sí, autorizo','no:No, prefiero omitir']],['¿Mostrar recordatorios dentro de ALÉA?','notify',['si:Sí','no:No']]]}
];
const catalog=[
{id:'kotex36',title:'Kotex Nocturna Maxi Comfort 36 unidades',cat:'periodo',tags:['toallas'],country:'PA',store:'Súper Xtra',url:'https://www.superxtra.com/protectores-diarios-femeninos-kotex-36-und-multiestilo-regulares/p',why:'Protección menstrual nocturna para quien prefiere toallas.',image:null},
{id:'sensodyne',title:'Sensodyne Rápido Alivio 100 g',cat:'bucal',tags:['sensible','sensibilidad'],country:'PA',store:'Consultar Súper Xtra',url:'https://www.superxtra.com/cuidado-personal-y-belleza/higiene-bucal',why:'Pasta dental formulada para dientes sensibles; consulta con tu odontólogo si el dolor persiste.',image:'https://mercologo.com/images/thumbnails/2667/2667/detailed/6/SENSODYNE_RAPIDO_ALIVIO.png',reference:true},
{id:'hairfood',title:'Garnier Hair Food Manteca de Cacao · Shampoo Rizos 300 ml',cat:'cabello',tags:['rizado','frizz'],country:'PA',store:'Farmacias Arrocha',url:'https://arrocha.com/products/garnier-shampoo-para-rizos-hair-food-manteca-de-cacao-300ml',why:'Opción de lavado para cabello rizado; elige según tu cuero cabelludo.',image:'https://www.garnier-centroamerica.com/-/media/project/loreal/brand-sites/garnier/usa/latam/es/prd-haircare/shampoo-rizos/1-shampoo-cruelty-free.png?hash=C0F6062580890AA928E151B5DC39E1C8&rev=eaf8397ba9a949eaa75791f5ef2550a5&w=1200',reference:true},
{id:'pantenerizos',title:'Pantene Rizos Definidos Shampoo 400 ml',cat:'cabello',tags:['rizado','ondulado'],country:'PA',store:'Farmacias Arrocha',url:'https://arrocha.com/products/pantene-shampoo-rizos-definidos-400ml',why:'Producto específico para rizos y ondas, según tus preferencias.',image:'https://f.fcdn.app/imgs/73824a/www.farmacenter.com.py/farmpy/7330/original/catalogo/10002339_10002339_1/2000-2000/pantene-rizos-definidos-sha-fr-x-400-ml-unica.jpg',reference:true},
{id:'garnier',title:'Garnier Agua Micelar Todo en 1 400 ml',cat:'rostro',tags:['makeup','sensible'],country:'PA',store:'Farmacias Arrocha',url:'https://arrocha.com/products/agua-micelar-garnier-todo-en-1-400-ml',why:'Desmaquilla y retira impurezas sin frotar; útil para una rutina facial suave.',image:'https://www.garnier.com.mx/-/media/project/loreal/brand-sites/garnier/usa/mx/es-mx/skin-active/agua-micelar-todo-en-1/1.jpg?hash=685A4E74023A21D4DCA9F920CC524613&rev=334ec3a5c9064ccb983deb11b24478c1&w=1200',reference:true},
{id:'garnieracne',title:'Garnier Anti Acné Agua Micelar 400 ml',cat:'rostro',tags:['acne','grasa','mixta'],country:'PA',store:'Súper Xtra',url:'https://www.superxtra.com/agua-micelar-acido-salicilico-garnier-frasco-400-ml-7509552875416/p',why:'Agua micelar para piel con tendencia a brotes; suspende si produce irritación.',image:'https://lafrancoar.vtexassets.com/arquivos/ids/165178/Agua-Micelar-Garnier-Acido-Salicilico-400ml.jpg?v=638876010904600000',reference:true},
{id:'listerine',title:'Listerine Total Care 500 ml',cat:'bucal',tags:['higiene','aliento'],country:'PA',store:'Súper Xtra',url:'https://www.superxtra.com/listerine-total-care-12x500-ml-7702035833839/p',why:'Enjuague para complementar el cepillado, no lo reemplaza.',image:'https://static.beautytocare.com/cdn-cgi/image/width%3D1600%2Cheight%3D1600%2Cf%3Dauto/media/catalog/product/l/i/listerine-total-care-mouthwash-500ml.jpg',reference:true}
];
const stores=[
{title:'Súper 99',url:'https://www.super99.com/',country:'PA'},
{title:'Súper Xtra',url:'https://www.superxtra.com/',country:'PA'},
{title:'Arrocha',url:'https://arrocha.com/',country:'PA'},
{title:'Farmacias El Javillo',url:'https://farmaciaseljavillo.com/',country:'PA'},
{title:'Supermercados Rey',url:'https://www.smrey.com/ca/farmacia/00400001',country:'PA'},
{title:'El Machetazo',url:'https://www.elmachetazo.com/farmacia',country:'PA'},
{title:'El Fuerte',url:'https://elfuerte.com.pa/collections/farmacia',country:'PA'},
{title:'Stevens',url:'https://stevens.com.pa/belleza',country:'PA'},
{title:'Conway',url:'https://conwayclick.com/salud',country:'PA'}
];
const suggestions=[
{cat:'rostro',title:'Limpiador facial suave',benefit:'Limpieza sin resecar ni irritar.',tags:[]},
{cat:'rostro',title:'Crema hidratante no comedogénica',benefit:'Hidrata sin sensación pesada; ajusta textura a tu piel.',tags:['grasa','mixta','acne']},
{cat:'rostro',title:'Hidratante para piel sensible',benefit:'Prioriza fórmulas sin perfume.',tags:['sensible']},
{cat:'rostro',title:'Protector solar FPS 30+ de amplio espectro',benefit:'Protección solar diaria.',tags:[]},
{cat:'cabello',title:'Champú según tu cuero cabelludo',benefit:'Equilibra limpieza sin resecar.',tags:[]},
{cat:'cabello',title:'Acondicionador hidratante',benefit:'Para suavidad y desenredo.',tags:[]},
{cat:'cabello',title:'Crema de definición de rizos',benefit:'Ayuda a definir rizos u ondas.',tags:['rizado','afro','ondulado']},
{cat:'cabello',title:'Sérum ligero antifrizz',benefit:'Aporta control del frizz, sin abusar de aceites pesados.',tags:['frizz']},
{cat:'bucal',title:'Pasta dental con flúor',benefit:'Higiene diaria; consulta opciones para dientes sensibles.',tags:[]},
{cat:'bucal',title:'Cepillo de cerdas suaves e hilo dental',benefit:'Cuidado cotidiano de encías y espacios interdentales.',tags:[]},
{cat:'bucal',title:'Consulta por manchas y sensibilidad',benefit:'Evita blanqueamientos intensos sin valoración si hay sensibilidad.',tags:['manchas','sensibilidad']},
{cat:'cuerpo',title:'Hidratante corporal suave',benefit:'Para piel seca, sensible o después de la ducha.',tags:[]},
{cat:'cuerpo',title:'Toallitas sin perfume para uso externo',benefit:'Uso ocasional; no son necesarias para la higiene vaginal.',tags:['toallitas']},
{cat:'cuerpo',title:'Higiene externa del oído',benefit:'Limpia solo el pabellón; evita introducir hisopos en el conducto.',tags:['oidos']},
{cat:'rostro',title:'Agua micelar o bálsamo desmaquillante',benefit:'Retira maquillaje suavemente, sin frotar.',tags:['makeup']},
{cat:'periodo',title:'Productos menstruales según tu preferencia',benefit:'Considera la absorción, comodidad e indicaciones de uso.',tags:[]}
];
function text(tag,txt,cls){let x=el(tag,cls,txt);return x}
function btn(t,fn,cls='ap-primary'){let b=el('button',cls,t);b.type='button';b.onclick=fn;return b}
function put(p,...children){children.forEach(x=>p.append(x));return p}
function showAlert(msg){let d=$('#alea-smart-notice');if(d){d.textContent=msg;d.hidden=false;}else alert(msg)}
async function getUser(){if(!client)return null;try{const {data}=await client.auth.getUser();return data?.user||null}catch{return null}}
async function readProfile(){user=await getUser();if(!user)return;let {data,error}=await client.from('alea_profiles').select('answers').eq('user_id',user.id).maybeSingle();if(!error&&data?.answers){answers={...answers,...data.answers};setupComplete=true}else if(error){setupComplete=false;showAlert('Pendiente de activar las tablas privadas en Supabase. Las respuestas no pueden guardarse aún.')}}
async function storeProfile(){if(!user||!client)return false;const data={user_id:user.id,answers};const {error}=await client.from('alea_profiles').upsert(data,{onConflict:'user_id'});if(error){showAlert('No pudimos guardar tu perfil en Supabase: '+error.message);return false}return true}
function isPositive(k){return answers[k]===true||answers[k]==='si'}
function renderWizard(){
let modal=$('#alea-pro');if(!modal){modal=el('div');modal.id='alea-pro';document.body.append(modal)}
modal.hidden=false;modal.replaceChildren();
const shell=el('div','ap-shell'),head=el('div','ap-head'),content=steps[currentStep];
put(head,text('span','ALÉA · PERFIL PERSONAL','ap-kicker'),btn('Omitir por ahora',()=>{modal.hidden=true;enhance()},'ap-secondary'));
shell.append(head);
const progress=el('div','ap-progress');steps.forEach((_,i)=>progress.append(el('i',i<=currentStep?'on':'')));shell.append(progress,text('div','PASO '+(currentStep+1)+' DE '+steps.length,'ap-kicker'),text('h1',content.title),text('p',content.desc));
for(const [label,key,opts,multi] of content.items){
shell.append(text('label',label));const box=el('div','ap-row');
for(const option of opts){let [v,label]=option.split(':');let selected=multi?(answers[key]||[]).includes(v):(key==='consentCycle'?isPositive(key)=== (v==='si'):key==='notify'?isPositive(key)=== (v==='si'):answers[key]===v);let b=el('button','ap-option'+(selected?' selected':''),label);b.type='button';b.onclick=()=>{if(multi){let list=Array.isArray(answers[key])?[...answers[key]]:[];answers[key]=list.includes(v)?list.filter(x=>x!==v):[...list,v]}else answers[key]=(key==='consentCycle'||key==='notify')?v==='si':v;renderWizard()};box.append(b)}shell.append(box)}
if(currentStep===steps.length-1)shell.append(text('p','Tus datos de ciclo e intimidad son opcionales. Podrás modificarlos y eliminarlos desde tu cuenta.','ap-kicker'));
const nav=el('div','ap-actions');if(currentStep>0)nav.append(btn('Atrás',()=>{currentStep--;renderWizard()},'ap-secondary'));
nav.append(btn(currentStep===steps.length-1?'Guardar preferencias':'Continuar',async()=>{if(currentStep<steps.length-1){currentStep++;renderWizard();return;}if(!user){setupComplete=true;modal.hidden=true;syncCountry();enhance();return}if(await storeProfile()){setupComplete=true;modal.hidden=true;syncCountry();enhance()} }));shell.append(nav);modal.append(shell);
}
async function loadEvents(){if(!user||!client||!isPositive('consentCycle')){events=[];return}let r=await client.from('alea_cycle_events').select('id,event_date,kind,detail').order('event_date',{ascending:false}).limit(240);if(r.error){showAlert('No se puede cargar el calendario privado: '+r.error.message);return}events=r.data||[]}
async function addEvent(date,kind,detail){if(!isPositive('consentCycle')){showAlert('Activa primero el consentimiento para guardar los registros íntimos en tu perfil.');return}if(!user||!client){events.unshift({id:'demo-'+Date.now(),event_date:date,kind,detail});renderCycle();showAlert('Demostración: este registro no quedará guardado al salir.');return}const {error}=await client.from('alea_cycle_events').insert({user_id:user.id,event_date:date,kind,detail});if(error){showAlert('Error al guardar: '+error.message);return}await loadEvents();renderCycle()}
async function deleteEvent(id){if(!id)return;if(!user||!client){events=events.filter(e=>e.id!==id);renderCycle();return}const {error}=await client.from('alea_cycle_events').delete().eq('id',id).eq('user_id',user.id);if(error)showAlert(error.message);else{await loadEvents();renderCycle()}}
function saveLocalCycle(){let v=$('#periodDate')?.value;if(v&&!events.some(e=>e.kind==='period_start'&&e.event_date===v))events.push({event_date:v,kind:'period_start',id:'existing'});}
function cycleStats(){
const dates=[...new Set(events.filter(e=>e.kind==='period_start').map(e=>e.event_date))].sort().reverse();
if(!dates.length)return null;
const last=new Date(dates[0]+'T12:00:00'),now=new Date();now.setHours(12,0,0,0);
const diffs=dates.slice(0,4).map((d,i)=>i<dates.length-1?Math.round((new Date(d+'T12:00:00')-new Date(dates[i+1]+'T12:00:00'))/86400000):null).filter(x=>x>=20&&x<=45);
const avg=diffs.length>=2?Math.round(diffs.reduce((a,b)=>a+b,0)/diffs.length):Math.min(45,Math.max(20,Number($('#cycleDays')?.value)||28));
const elapsed=Math.floor((now-last)/86400000),cycleDay=((elapsed%avg)+avg)%avg+1,remaining=elapsed>=0?((avg-(elapsed%avg))%avg||avg):null;
return {last:dates[0],avg,cycleDay,remaining,cycles:dates.length,reliability:diffs.length>=2?'historial':'orientación inicial',allowFertile:answers.hormonal==='no'&&diffs.length>=2&&avg>=21&&avg<=35&&elapsed>=0};
}
function dateISO(d){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function offset(iso,days){let d=new Date(iso+'T12:00:00');d.setDate(d.getDate()+days);return dateISO(d)}
function createTag(txt,cls='as-chip'){return text('span',txt,cls)}
function renderCycle(){
let root=$('#alea-cycle-pro');if(!root)return;root.replaceChildren();const stats=cycleStats();
const card=el('div','as-panel');card.append(text('h3','🌸 Diario de mi ciclo'),text('p','Una herramienta opcional para tus cuidados. Los cálculos son aproximados.'));
const info=el('div','as-panel');if(stats){info.append(text('h3','Próximo período en ~'+stats.remaining+' días'),text('p','Día '+stats.cycleDay+' del ciclo · '+stats.reliability));if(stats.remaining<=4)info.append(text('div','Prepara tus productos menstruales favoritos: '+answers.periodProduct+'. Revisa existencias antes de comprar.','as-warning'));if(stats.allowFertile)info.append(text('p','Ventana fértil aproximada: podría ocurrir alrededor de los días '+(stats.avg-19)+' a '+(stats.avg-11)+'. No confirma ovulación ni permite inferir días seguros.','as-note'))}
else info.append(text('p','Registra el comienzo del último período para mostrar un calendario estimado.'));
root.append(info);
const cal=el('div','as-panel'),bar=el('div','row');let m=calMonth;put(bar,btn('‹',()=>{calMonth=new Date(m.getFullYear(),m.getMonth()-1,1);renderCycle()},'as-chip'),text('strong',m.toLocaleDateString('es-PA',{month:'long',year:'numeric'})),btn('›',()=>{calMonth=new Date(m.getFullYear(),m.getMonth()+1,1);renderCycle()},'as-chip'));cal.append(bar);let grid=el('div','as-grid');for(const wd of ['L','M','M','J','V','S','D'])grid.append(text('div',wd,'as-note'));
const first=new Date(m.getFullYear(),m.getMonth(),1),pad=(first.getDay()+6)%7,length=new Date(m.getFullYear(),m.getMonth()+1,0).getDate();for(let i=0;i<pad;i++)grid.append(el('span'));
for(let d=1;d<=length;d++){let dt=dateISO(new Date(m.getFullYear(),m.getMonth(),d));let period=events.some(e=>e.event_date===dt&&e.kind==='period_start');
let idx=stats?Math.floor((new Date(dt+'T12:00:00')-new Date(stats.last+'T12:00:00'))/86400000):0;
let day=stats?((idx%stats.avg)+stats.avg)%stats.avg+1:0;
let fertile=stats?.allowFertile&&day>=stats.avg-19&&day<=stats.avg-12;
let ov=stats?.allowFertile&&day===stats.avg-14;
let intimate=events.some(e=>e.event_date===dt&&e.kind==='intimacy');
let b=btn(intimate?String(d)+'•':String(d),()=>{selectedDate=dt;renderCycle()},'as-day'+(period?' period':'')+(fertile?' fertile':'')+(ov?' ovulation':'')+(dt===selectedDate?' active':'')+(dt===dateISO(new Date())?' today':''));grid.append(b)}cal.append(grid,text('p','Rosa = inicio del período · Lila = ventana estimada (si hay suficientes datos) · • = intimidad registrada.','as-note'));
const sel=selectedDate||dateISO(new Date());cal.append(text('p','Fecha seleccionada: '+sel,'as-note'));
const actions=el('div','as-chips');for(const [name,kind,detail] of [['🌸 Inició mi período','period_start',''],['Dolor menstrual','symptom','dolor'],['Cansancio','symptom','cansancio'],['Ánimo sensible','symptom','animo'],['Intimidad (opcional)','intimacy','registrado']])actions.append(btn(name,()=>addEvent(sel,kind,detail),'as-chip'));cal.append(actions);root.append(cal);
if(events.length){let history=el('div','as-panel');history.append(text('h3','Mi historial'));for(let e of [...events].sort((a,b)=>b.event_date.localeCompare(a.event_date)).slice(0,15)){let line=el('div','row');line.style.cssText='padding:9px 0;border-bottom:1px solid #eee';line.append(text('span',e.event_date+' · '+({period_start:'Inicio del período',symptom:'Síntoma',intimacy:'Intimidad'}[e.kind]||'Registro')+' '+(e.detail||''),'as-note'));if(e.id!=='existing')line.append(btn('Eliminar',()=>deleteEvent(e.id),'as-chip'));history.append(line)}root.append(history)}
root.append(text('p','Las fases y posibles fechas fértiles varían; ALÉA no identifica fertilidad ni es anticonceptivo. Si hay ciclos irregulares, evita interpretar la predicción como clínica.','as-warning'));
}
function offerFor(id){let p=offers.filter(o=>o.product_id===id).sort((a,b)=>String(b.checked_at).localeCompare(String(a.checked_at)))[0];if(!p)return null;let age=Date.now()-new Date(p.checked_at).getTime();return age>=0&&age<48*3600000&&p.available===true&&Number.isFinite(Number(p.price))&&Number(p.price)>0?p:null}
function renderOffer(p){let row=el('div','as-product');if(p.image){let img=el('img','as-thumb');img.src=p.image;img.alt='Fotografía referencial de '+p.title;img.loading='lazy';img.referrerPolicy='no-referrer';img.onerror=()=>img.replaceWith(el('div','as-placeholder','🛍️'));row.append(img)}else row.append(el('div','as-placeholder','🛍️'));
let data=el('div','as-details');data.append(text('b',p.title),text('p',p.why));let offer=offerFor(p.id);if(offer){data.append(text('div',offer.currency==='USD'?'B/. '+Number(offer.price).toFixed(2):offer.currency+' '+offer.price,'as-price'),text('p','Verificado '+new Date(offer.checked_at).toLocaleString('es-PA')+' · confirma disponibilidad por sucursal','as-verify'))}else data.append(text('p','Precio y existencia sin verificación reciente','as-verify'));
if(p.reference)data.append(text('p','Imagen referencial, el empaque puede variar.','as-verify'));
let a=el('a','as-buy','Verificar en '+p.store);a.href=p.url;a.rel='noopener noreferrer';a.target='_blank';data.append(a);row.append(data);return row}
function selectedSuggestions(){let selected=suggestions.filter(p=>p.cat!=='periodo');return selected.filter(p=>{if(!p.tags.length)return true;return p.tags.some(t=>[answers.face,answers.hair,answers.frizz,answers.oral,...answers.faceConcerns,...answers.hairGoals,...answers.oralGoals,...answers.bodyGoals,answers.makeup==='no'?'': 'makeup'].includes(t))})}
function renderRecs(){
let r=$('#alea-smart-recs');if(!r)return;r.replaceChildren();
let bar=el('div','as-panel');bar.append(text('h3','Tu cuidado personalizado ✨'),text('p','Piel '+answers.face+' · cabello '+answers.hair+' · objetivo '+(answers.goals?.join(', ')||'cuidado integral')));bar.append(btn('Editar mi cuestionario',()=>{currentStep=0;renderWizard()},'as-chip'));r.append(bar);
for(const p of selectedSuggestions()){let card=el('div','as-panel');card.append(text('strong',p.title),text('p',p.benefit));r.append(card)}
let products=catalog.filter(p=>answers.country==='PA'&&(p.id==='garnier'&&answers.makeup!=='no'||p.id==='garnieracne'&&(answers.faceConcerns||[]).includes('acne')||p.id==='sensodyne'&&answers.oral==='sensible'||p.id==='listerine'&&(answers.oralGoals||[]).includes('aliento')||p.id==='hairfood'&&['rizado','afro','ondulado'].includes(answers.hair)||p.id==='pantenerizos'&&answers.hair==='rizado'));if(products.length){r.append(text('div','Productos encontrados en comercios:','as-label'));products.forEach(p=>r.append(renderOffer(p)))}
r.append(text('p','Las recomendaciones son orientativas: evita productos que te causen reacción y consulta a profesionales si hay síntomas persistentes.','as-note'));
}
function renderStore(){
let root=$('#alea-smart-store');if(!root)return;root.replaceChildren();let p=el('div','as-panel');
p.append(text('h3','🛒 Buscar por necesidades'),text('p','Mostramos imágenes de referencia y precio únicamente cuando existe una verificación reciente de una oferta individual. Las tiendas pueden variar por ubicación.'));
const chips=el('div','as-chips');let categories=['rostro','cabello','cuerpo','bucal','periodo'];
let current=root.dataset.category||'rostro';
for(const c of categories)chips.append(btn(({rostro:'Rostro',cabello:'Cabello',cuerpo:'Cuerpo',bucal:'Boca',periodo:'Período'})[c],()=>{root.dataset.category=c;renderStore()},'as-chip'+(current===c?' selected':'')));p.append(chips);root.append(p);
const generic=suggestions.filter(s=>s.cat===current);
generic.forEach(s=>{let card=el('div','as-panel');card.append(text('strong',s.title),text('p',s.benefit));root.append(card)});
let actual=catalog.filter(x=>x.cat===current&&x.country===answers.country);if(actual.length){root.append(text('div','Productos y fichas concretas','as-label'));actual.forEach(x=>root.append(renderOffer(x)))}
if(answers.country==='PA'){root.append(text('div','Tiendas de Panamá','as-label'));let box=el('div','as-panel'),links=el('div','as-chips');for(const s of stores){let a=el('a','as-chip',s.title);a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';links.append(a)}box.append(links,text('p','Las tiendas no tienen integraciones automáticas confirmadas: visita la ficha para comprobar precio, foto y stock de tu sucursal.','as-note'));root.append(box)}
else root.append(text('p','Todavía no tenemos integraciones verificadas de comercios para tu país. No mostraremos ofertas de Panamá como si fueran locales.','as-warning'))}
async function loadOffers(){try{let r=await fetch('./data/ofertas.json?v='+Date.now(),{cache:'no-store'});if(r.ok){let data=await r.json();offers=Array.isArray(data)?data:[]}}catch{}}
function mount(){
if(initialized)return;initialized=true;
let style=el('link');style.rel='stylesheet';style.href='./alea-pro.css';document.head.append(style);
let intro=$('#rutina'),rec=el('div');rec.id='alea-smart-recs';rec.className='';intro.append(rec);
let product=$('#productos'),shop=el('div');shop.id='alea-smart-store';product.append(shop);
let cycle=$('#ciclo'),diary=el('div');diary.id='alea-cycle-pro';cycle.append(diary);
const style2=el('style');style2.textContent='#rutina>.card,#rutina>#recommendations,#rutina>h2,#productos>#productGrid,#productos>label.field,#ciclo>.card,#ciclo>#phaseResult{display:none!important}';document.head.append(style2);
let notice=el('div','as-warning');notice.id='alea-smart-notice';notice.hidden=true;product.prepend(notice);
let profile=$('#perfil .card');if(profile)profile.append(btn('Editar mi cuestionario',()=>{currentStep=0;renderWizard()},'outline wide'));
const profileTools=el('div','as-panel');profileTools.append(text('h3','Privacidad y tus registros'),text('p','Puedes borrar tu cuestionario y diario. La contraseña y cuenta se gestionan mediante Supabase Auth.'));profileTools.append(btn('Borrar mi diario del ciclo',async()=>{if(!confirm('¿Eliminar definitivamente todos los eventos menstruales e íntimos guardados?'))return;if(!user||!client){events=[];renderCycle();return}const {error}=await client.from('alea_cycle_events').delete().eq('user_id',user.id);if(error)showAlert(error.message);else{events=[];renderCycle();showAlert('Historial eliminado.')}},'ap-secondary'));profileTools.append(text('p','','as-note'));profileTools.append(btn('Borrar cuestionario personal',async()=>{if(!confirm('¿Eliminar definitivamente las respuestas de cuidado?'))return;if(!user||!client){answers=JSON.parse(initialAnswers);setupComplete=false;return}const {error}=await client.from('alea_profiles').delete().eq('user_id',user.id);if(error)showAlert(error.message);else{answers=JSON.parse(initialAnswers);setupComplete=false;showAlert('Respuestas borradas.');enhance();}},'ap-secondary'));let a=el('a','as-buy','Cómo protegemos tus datos');a.href='./privacidad.html';profileTools.append(a);$('#perfil').append(profileTools);
const country=$('#country');if(country)country.addEventListener('change',async()=>{answers.country=country.value;await storeProfile();renderStore();renderRecs()});
const nav=$('.nav');if(nav){let link=btn('🌸 Ciclo',()=>{document.querySelector('[data-page="ciclo"]')?.click();},'pill');link.style.cssText='position:fixed;right:16px;bottom:88px;z-index:12;box-shadow:0 4px 15px #0002';document.querySelector('.wrap').append(link)}
}
function renderHome(){
const host=$('#inicio .hero');if(!host)return;let existing=$('#alea-home-pro');if(existing)existing.remove();
let box=el('div','as-panel');box.id='alea-home-pro';let stats=cycleStats();
if(stats&&isPositive('consentCycle')){box.append(text('strong','🌷 Cuidado para tu fase del ciclo'));box.append(text('p',stats.remaining<=4?'Se acerca la fecha estimada de tu período. Prepara '+answers.periodProduct+' y revisa opciones en tu país.':'Tus registros de ciclo son optativos; puedes consultarlos sin cambiar tu rutina personal.'));if(stats.remaining<=4&&isPositive('notify'))box.append(text('div','Aviso personal de ALÉA: prepara tus productos favoritos.','as-warning'));}
else box.append(text('p','Completa el cuestionario para crear tus recomendaciones, sin necesidad de registrar datos menstruales.'));
box.append(btn('Editar mi cuestionario',()=>{currentStep=0;renderWizard()},'as-chip'));host.after(box);
}
function syncCountry(){let sel=$('#country');if(sel&&sel.value!==answers.country){sel.value=answers.country;sel.dispatchEvent(new Event('change'))}}
async function enhance(){mount();syncCountry();renderRecs();renderStore();renderCycle();renderHome()}
async function start(){
if(!$('#app')||$('#app').classList.contains('hidden'))return;client=window.ALEA_SDK||null;const who=await getUser();demo=!who;if(who?.id!==lastUserId){answers=JSON.parse(initialAnswers);events=[];setupComplete=false;lastUserId=who?.id||null}
await readProfile();await loadOffers();await loadEvents();saveLocalCycle();enhance();
if(!setupComplete){currentStep=0;renderWizard()}
}
window.addEventListener('DOMContentLoaded',()=>{const a=$('#app');if(!a)return;new MutationObserver(()=>{if(!a.classList.contains('hidden'))start()}).observe(a,{attributes:true,attributeFilter:['class']});if(!a.classList.contains('hidden'))start()});
})();