/* Original application and misconception questions, mapped in CURRICULUM.md. */
(function(){
 const Q=window.PhysicsQuestions,pick=a=>a[Math.floor(Math.random()*a.length)],n=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
 const num=(s,k,p,a,u,e)=>({station:s,skill:k,prompt:p,type:'number',answer:[a],fields:[{label:'Your answer',unit:u}],explanation:e,hint:'Identify the physical relationship, then track the units.'});
 const mc=(s,k,p,a,w,e)=>{const options=Q.shuffle([a,...w]);return {station:s,skill:k,prompt:p,type:'choice',options,answer:options.indexOf(a),explanation:e,hint:'Check what the statement means physically, rather than matching familiar words.'};};
 const extra={
 1:[
 ()=>{const a=n(12,95);return num(1,'magnitude',`A length is ${a} cm. What is its numerical magnitude when expressed in metres?`,a/100,'m',`The same quantity can have a different numerical magnitude: ${a}/100 m.`);},
 ()=>{const b=pick([['amount of substance','mol'],['temperature','K'],['current','A'],['mass','kg']]);return mc(1,'base-units',`A lab report records ${b[0]}. Choose its correct SI unit symbol.`,b[1],['C','g','mole'].filter(x=>x!==b[1]),'SI symbols and names must be distinguished; kelvin is K and amount of substance uses mol.');},
 ()=>{const b=pick([['acceleration = change in velocity ÷ time','m/s²',['m/s','s/m²','m²/s']],['force = mass × acceleration','kg m/s²',['kg m/s','kg/m²','m/s²']],['pressure = force ÷ area','N/m²',['N m²','N/m','m²/N']]]);return mc(1,'derived-units',`Given ${b[0]}, deduce the unit.`,b[1],b[2],'Substitute the units into the supplied relationship; divide by every denominator factor.');},
 ()=>mc(1,'base-derived','A pupil says a newton is an SI base unit because it has a special name. Evaluate this claim.','False: a newton combines kg, m and s.',['True: all named units are base units.','True: force is mass.','False: force has no unit.'],'A special unit name does not make it a base unit: N = kg m/s².'),
 ()=>{const b=pick([['distance','metre'],['time','second'],['mass','kilogram']]);return mc(1,'quantity-unit',`A student writes “The physical quantity is ${b[1]}.” What is the error?`,`The quantity is ${b[0]}; ${b[1]} is a unit.`,['Every unit is a physical quantity.','Only numbers are physical quantities.','Units and quantities are interchangeable.'],'Name what is measured separately from the unit used to express it.');}
 ],
 2:[
 ()=>{const a=n(2,90);return num(2,'prefix-down',`A sensor draws ${a} µA. Convert this to A.`,a*1e-6,'A',`Micro is 10⁻⁶, so multiply ${a} by 10⁻⁶.`);},
 ()=>{const a=n(2,95);return num(2,'prefix-up',`A pulse lasts ${a/1000} s. Express the duration in µs.`,a*1000,'µs','Divide seconds by 10⁻⁶ to count microseconds.');},
 ()=>{const a=n(2,95);return num(2,'prefix-to-prefix',`A transmitter operates at ${a} GHz. Express this in MHz.`,a*1000,'MHz','Giga = 10⁹ and mega = 10⁶; the ratio is 1,000.');},
 ()=>{const b=pick([['typical atom',1e-10],['human height',1],['Earth diameter',1e7],['thickness of paper',1e-4],['length of a classroom',10]]);return mc(2,'standard-form',`Which order of magnitude in metres is reasonable for the ${b[0]}?`,String(b[1]),[String(b[1]*1e3),String(b[1]*1e-3),String(b[1]*1e6)],'An order of magnitude is an approximate power-of-ten scale, not an exact measurement.');},
 ()=>{const b=pick([['nano','n','10⁻⁹'],['deci','d','10⁻¹'],['tera','T','10¹²'],['giga','G','10⁹'],['centi','c','10⁻²'],['kilo','k','10³']]);return mc(2,'prefix-symbols',`Which symbol represents ${b[0]} (${b[2]})?`,b[1],['M','m','µ'],`The prefix ${b[0]} uses ${b[1]}. Capitalisation matters.`);}
 ],
 3:[
 ()=>{const a=n(2,40),b=n(2,30);return num(3,'area',`A rectangular detector is ${a} cm by ${b} cm. Find its area in m².`,a*b/1e4,'m²',`Area = ${a*b} cm². Divide by 100², not 100.`);},
 ()=>{const a=n(2,8),b=n(2,8),c=n(2,8);return num(3,'volume',`A block is ${a} cm × ${b} cm × ${c} cm. Find its volume in m³.`,a*b*c/1e6,'m³','Multiply the three lengths, then divide by 100³.');},
 ()=>{const v=n(10,80),rho=n(2,9),mass=v*rho;return num(3,'density',`A solid has mass ${mass} g and displaces ${v} cm³ of water. Determine its density in kg/m³.`,rho*1000,'kg/m³',`${mass}/${v} = ${rho} g/cm³ = ${rho*1000} kg/m³.`);},
 ()=>{const min=n(2,20),sec=n(1,59);return num(3,'time-conversion',`A timer shows ${min} minutes ${sec} seconds. Give the elapsed time in seconds.`,min*60+sec,'s','Minutes use base 60: multiply the minutes by 60, then add the seconds.');},
 ()=>{const a=n(2,30);return mc(3,'area-reverse',`A pupil converts ${a} m² to cm² by multiplying by 100. Diagnose the error.`,`Multiply by 10,000 because both lengths change units.`,['Multiply by 100 because area has one unit.','Divide by 100 because centimetres are smaller.','Multiply by 1,000,000 because area is cubic.'],'1 m² = (100 cm) × (100 cm) = 10,000 cm².');}
 ],
 4:[
 ()=>{const t=n(20,80);return mc(4,'instrument-selection',`A stone cannot fit into a measuring cylinder. Which method can determine its volume?`,'Collect displaced water from a filled overflow can and measure that volume.',['Read its mass and call it volume.','Measure only its longest side.','Use a stopwatch to time its fall.'],'For a fully submerged non-porous object, the displaced water volume equals its volume.');},
 ()=>{const m=n(20,80);return mc(4,'range',`A sample has mass about ${m} g. Balance A: 0–10 g, 0.001 g steps. Balance B: 0–100 g, 0.1 g steps. Which is suitable?`,'B: its range includes the sample mass.',['A: finer steps override its range limit.','Both: resolution is the only constraint.','Neither: balances measure length.'],'An out-of-range instrument is unsuitable regardless of its finer resolution.');},
 ()=>{const a=n(2,9);return num(4,'resolution',`A digital gauge displays in ${a/100} mm steps. How many steps correspond to ${a} mm?`,100,'steps',`${a} ÷ ${a/100} = 100 display steps.`);},
 ()=>{const ref=n(20,80);return mc(4,'accuracy-precision',`A balance gives ${ref+2}.0 g every time for a ${ref}.0 g reference. What should repeated averaging do?`,'It will not remove the consistent +2.0 g bias.',['It must make the mean equal the reference.','It changes the instrument resolution.','It removes every measurement error.'],'Averaging repeated identical biased readings cannot correct a systematic offset.');},
 ()=>mc(4,'reasoning','Which plan best measures the thickness of a thin sheet with a ruler?','Measure a tightly stacked set of 100 sheets, then divide by 100.',['Measure one sheet and invent extra decimals.','Add 100 to one reading.','Measure the stack and multiply by 100.'],'Measuring a larger total reduces the fractional effect of the ruler resolution; avoid gaps and compression.')
 ],
 5:[
 ()=>{const z=n(1,5),r=n(30,90);return num(5,'ruler-offset',`A digital length gauge reads +${z/10} mm when closed. It shows ${r/10} mm for a sample. Find the corrected length.`,(r-z)/10,'mm','Corrected reading = observed reading − zero reading. A positive zero error is subtracted.');},
 ()=>{const a=n(1,5),i=n(1,9);return num(5,'scale-reading',`A scale starts at ${a} A and ends at ${a+2} A with 10 equal intervals. A pointer is at interval ${i} after the start. Read it.`,a+i*.2,'A','Each interval is 2/10 = 0.2 A. Add the starting value.');},
 ()=>{const start=n(20,30),v=n(5,15);return num(5,'meniscus',`A submerged stone raises a cylinder reading from ${start} cm³ to ${start+v} cm³. Find the stone volume.`,v,'cm³','Subtract the initial water reading from the final reading; do not use the final reading alone.');},
 ()=>mc(5,'parallax','A pupil changes eye position and the apparent pointer reading shifts. What is the best correction?','View the pointer perpendicular to the scale; align pointer and reflection if a mirror is provided.',['Average any two arbitrary viewing angles.','Add one division to every reading.','Replace the unit symbol.'],'Parallax is a geometry error; correct the line of sight rather than guessing an offset.'),
 ()=>{const start=n(1,8),step=pick([.1,.2,.5]),spaces=n(4,12),end=start+step*spaces;return num(5,'scale-interval',`There are ${spaces+1} marks, including both endpoints, from ${start} V to ${end.toFixed(1)} V. Find one interval.`,step,'V',`${spaces+1} marks bound ${spaces} spaces. Divide the endpoint difference by ${spaces}.`);}
 ],
 6:[
 ()=>{const cycles=n(2,8);return num(6,'full-cycle',`Starting at the left extreme, a bob travels to the right extreme and back ${cycles} times. How many full oscillations is this?`,cycles,'oscillations','Extreme to opposite extreme and back is one complete cycle.');},
 ()=>{const t=pick([1.2,1.5,1.8,2.1]),cycles=n(10,30);return num(6,'period',`A pendulum completes ${cycles} oscillations in ${(t*cycles).toFixed(1)} s. Predict the time for ${cycles+5} oscillations at the same period.`,t*(cycles+5),'s',`First find T = total time / cycles = ${t} s, then multiply by ${cycles+5}.`);},
 ()=>{const intervals=n(5,20),t=pick([1.2,1.6,2]);return num(6,'centre-crossings',`A bob passes the centre heading right on crossing 1 and again heading right on crossing ${intervals+1}. The elapsed time is ${(intervals*t).toFixed(1)} s. Find its period.`,t,'s','Here only same-direction crossings are counted. Each interval is a full period; subtract one from the number of crossings.');},
 ()=>{const cycles=pick([10,20,40]);return mc(6,'timing-method',`Start/stop uncertainty is about 0.2 s. What happens to its fractional effect when timing ${cycles} cycles instead of one?`,`It is smaller because the measured total time is longer.`,['It becomes exactly zero.','It is larger solely because more cycles are counted.','The period increases by the number of cycles.'],'The approximate absolute timing uncertainty is similar while the total interval grows.');},
 ()=>mc(6,'pendulum-length','A bob is replaced by a larger bob while the suspension-to-centre distance is kept fixed. Which measurement defines the pendulum length?','Suspension point to the new bob’s centre.',['String length alone.','Suspension to the lowest surface.','Diameter of the bob alone.'],'Pendulum length locates the centre of the bob relative to the pivot, not just the string.')
 ],
 7:[
 ()=>mc(7,'scalar-vector','A runner returns to the start after a lap. Which statement can be correct?','Distance is non-zero while displacement is zero.',['Distance and displacement must both be zero.','Distance is a vector.','Displacement has magnitude only.'],'Distance counts the path travelled; displacement is the directed change from start to finish.'),
 ()=>{const a=n(3,12),b=n(2,8),sum=a+b;return num(7,'same-direction',`A resultant of ${sum} N east is produced by two eastward forces. One is ${a} N. Find the other.`,b,'N','For same-direction vectors, add magnitudes; work backwards by subtraction.');},
 ()=>{const b=n(2,8),r=n(2,9);return num(7,'opposite-direction',`A ${b+r} N eastward force and an unknown westward force produce a ${r} N eastward resultant. Find the westward force magnitude.`,b,'N','East minus west equals the eastward resultant. Rearrange to find the missing magnitude.');},
 ()=>mc(7,'balanced','Two equal-length vector arrows point at right angles. Do they cancel?','No: zero resultant requires equal magnitude and opposite directions.',['Yes: equal magnitude is sufficient.','Yes: right angles always cancel.','No: vectors can never cancel.'],'Equal magnitude alone is insufficient. Direction determines the vector sum.'),
 ()=>{const scale=pick([2,4,5]),k=n(1,3),swap=Math.random()<.5,a=(swap?4:3)*k,b=(swap?3:4)*k,q=num(7,'arrow-scale',`Use the head-to-tail grid drawing. Each grid square represents 1 cm, and 1 cm represents ${scale} N. Determine the resultant magnitude and its angle north of east, to the nearest whole degree.`,5*k*scale,'N','The resultant joins the starting tail to the final tip. Measure its length and angle. Do not add the two path lengths.');q.answer=[5*k*scale,Math.round(Math.atan2(b,a)*180/Math.PI)];q.fields.push({label:'Angle north of east',unit:'degrees'});q.tolerances=[scale*.2,1];q.diagram={kind:'vector-grid',a,b,scale};return q;}

 ]};
 // One foundation and one transfer question for each family, shuffled together.
 Q.qualification=id=>Q.shuffle(Q.templates[id].flatMap((fn,i)=>[fn(),extra[id][i]() ]));
 Q.boss=()=>Q.shuffle([1,2,3,4,5,6,7].flatMap(id=>extra[id].map(fn=>fn())));
 Q.session=ids=>Q.shuffle(ids.flatMap(id=>Q.templates[id].map((fn,i)=>(Math.random()<.5?fn:extra[id][i])())));
 Q.depth=extra;
})();
