module.exports=[22556,t=>{"use strict";var e=t.i(43793);async function n(){let t=(0,e.getSql)();return await t`
    SELECT * FROM group_departures WHERE is_active = true ORDER BY created_at ASC
  `}async function a(){let t=(0,e.getSql)();return await t`SELECT * FROM group_departures ORDER BY created_at ASC`}async function i(t){let n=(0,e.getSql)();return(await n`
    SELECT * FROM group_departures WHERE id = ${t} LIMIT 1
  `)[0]??null}async function r(t){let n=(0,e.getSql)(),a=t.seatsLeft??t.totalSeats;return(await n`
    INSERT INTO group_departures (destination, date, duration, price, seats_left, total_seats, status)
    VALUES (
      ${t.destination}, ${t.date}, ${t.duration||null}, ${t.price||null},
      ${a}, ${t.totalSeats}, ${t.status||"guaranteed"}
    )
    RETURNING *
  `)[0]}async function s(t,n){let a=await i(t);if(!a)return null;let r=(0,e.getSql)();return(await r`
    UPDATE group_departures SET
      destination = ${n.destination??a.destination},
      date = ${n.date??a.date},
      duration = ${n.duration??a.duration},
      price = ${n.price??a.price},
      total_seats = ${n.totalSeats??a.total_seats},
      seats_left = ${n.seatsLeft??a.seats_left},
      status = ${n.status??a.status},
      is_active = ${n.isActive??a.is_active},
      updated_at = now()
    WHERE id = ${t}
    RETURNING *
  `)[0]??null}async function o(t){let n=(0,e.getSql)();await n`DELETE FROM group_departures WHERE id = ${t}`}async function l(t,n){let a=(0,e.getSql)();return(await a`
    UPDATE group_departures
    SET
      seats_left = seats_left - ${n},
      status = CASE WHEN seats_left - ${n} <= 0 THEN 'sold-out' ELSE status END,
      updated_at = now()
    WHERE id = ${t} AND seats_left >= ${n}
    RETURNING *
  `)[0]??null}async function u(t,n){let a=(0,e.getSql)();return(await a`
    UPDATE group_departures
    SET
      seats_left = LEAST(seats_left + ${n}, total_seats),
      status = CASE WHEN status = 'sold-out' AND seats_left + ${n} > 0 THEN 'limited-seats' ELSE status END,
      updated_at = now()
    WHERE id = ${t}
    RETURNING *
  `)[0]??null}t.s(["createDeparture",0,r,"decrementSeats",0,l,"deleteDeparture",0,o,"getDepartureById",0,i,"listActiveDepartures",0,n,"listAllDepartures",0,a,"restoreSeats",0,u,"updateDeparture",0,s])},93384,t=>{"use strict";t.s(["formatMoney",0,function(t){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(Math.round(t))},"packageSnapshot",0,function(t){return{source:"package",id:t.id,title:t.title,destination:t.title,category:t.category,duration:t.duration,tagline:t.tagline,overview:t.overview,heroImage:t.heroImage||t.image,bestTime:t.bestTime,startingPoint:t.startingPoint,groupSize:t.groupSize,themes:t.themes,highlights:t.highlights,itinerary:t.itinerary,inclusions:t.inclusions,exclusions:t.exclusions,gallery:t.gallery}},"totalTravellers",0,function(t){return t.adults+t.childrenWithBed+t.childrenWithoutBed+t.infants}])},61745,t=>{"use strict";var e=t.i(43793),n=t.i(22556),a=t.i(93384);let i="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";async function r(){let t=(0,e.getSql)();for(let e=0;e<5;e++){let e=function(){let t="";for(let e=0;e<6;e++)t+=i[Math.floor(Math.random()*i.length)];return`BKG-${t}`}();if(0===(await t`SELECT 1 FROM bookings WHERE booking_code = ${e} LIMIT 1`).length)return e}throw Error("Could not generate a unique booking code.")}class s extends Error{constructor(){super("This departure is sold out."),this.name="SoldOutError"}}async function o(t){let i=t.destination,o=t.travelDate,l=t.packageTitle;if(t.departureId){let e=await (0,n.getDepartureById)(t.departureId);if(!e||e.seats_left<=0)throw new s;i=i||e.destination,o=o||e.date,l=l||e.destination}let u=(0,e.getSql)(),d=await r(),c=`QT-${d.replace("BKG-","")}`,E=t.travellers||{adults:Math.max(1,t.travellersCount||1),childrenWithBed:0,childrenWithoutBed:0,infants:0},g=t.rooms||{singleRooms:0,doubleRooms:1,tripleRooms:0},_=JSON.stringify(t.selectedAddons||[]),f=JSON.stringify(t.pricingSnapshot||{}),S=JSON.stringify(t.packageSnapshot||{}),{party:p}=t,$=t.status||"new",R=(await u`
    INSERT INTO bookings (
      booking_code, type, user_id, agent_id, package_id, package_title, departure_id, destination,
      travel_date, travellers_count, traveller_names, budget, special_requirements,
      contact_name, contact_email, contact_phone, booking_source, departure_city,
      duration_label, adults, children_with_bed, children_without_bed, infants,
      room_configuration, selected_addons, pricing_snapshot, package_snapshot,
      terms_accepted, quotation_number, price_amount, status, booked_for,
      booker_name, booker_email, booker_phone, booker_relation, notify_booker, agent_reference
    ) VALUES (
      ${d}, ${t.type}, ${t.userId||null}, ${t.agentId||null},
      ${t.packageId||null},
      ${l||null}, ${t.departureId||null}, ${i||null},
      ${o||null}, ${t.travellersCount??null}, ${t.travellerNames||null},
      ${t.budget||null}, ${t.specialRequirements||null}, ${p.contact.name},
      ${p.contact.email}, ${p.contact.phone}, ${t.bookingSource||"package"},
      ${t.departureCity||null}, ${t.durationLabel||null}, ${E.adults},
      ${E.childrenWithBed}, ${E.childrenWithoutBed}, ${E.infants},
      ${JSON.stringify(g)}::jsonb, ${_}::jsonb, ${f}::jsonb,
      ${S}::jsonb, ${!!t.termsAccepted}, ${c},
      ${t.pricingSnapshot?.total?(0,a.formatMoney)(t.pricingSnapshot.total):null},
      ${$}, ${p.bookedFor}, ${p.booker?.name||null},
      ${p.booker?.email||null}, ${p.booker?.phone||null},
      ${p.relation||null}, ${p.notifyBooker}, ${t.agentReference||null}
    )
    RETURNING *
  `)[0];return await u`
    INSERT INTO booking_status_history (booking_id, from_status, to_status, note, changed_by)
    VALUES (
      ${R.id}, NULL, ${$},
      ${t.createdNote||"Request submitted"}, ${t.createdBy||"system"}
    )
  `,R}async function l(t){let n=(0,e.getSql)();return(await n`SELECT * FROM bookings WHERE id = ${t} LIMIT 1`)[0]??null}async function u(t){let e=await l(t);if(!e)return null;let[n,a,i]=await Promise.all([$(t),m(t),T(t)]);return{...e,history:n,documents:a,notifications:i}}async function d(t){let n=(0,e.getSql)();return await n`
    SELECT * FROM bookings WHERE user_id = ${t} ORDER BY created_at DESC
  `}async function c(t){let n=(0,e.getSql)();return await n`
    SELECT * FROM bookings
    WHERE agent_id = ${t} OR agent_id IS NULL
    ORDER BY created_at DESC
  `}async function E(){let t=(0,e.getSql)();return await t`SELECT * FROM bookings ORDER BY created_at DESC`}async function g(t,a,i,r){let o=(0,e.getSql)(),u=await l(t);if(!u)return null;if(u.departure_id&&"confirmed"===a&&"confirmed"!==u.status){if(!await (0,n.decrementSeats)(u.departure_id,u.travellers_count||1))throw new s}else u.departure_id&&"confirmed"===u.status&&("cancelled"===a||"rejected"===a)&&await (0,n.restoreSeats)(u.departure_id,u.travellers_count||1);let d=await o`
    UPDATE bookings SET status = ${a}, updated_at = now()
    WHERE id = ${t}
    RETURNING *
  `;return await o`
    INSERT INTO booking_status_history (booking_id, from_status, to_status, note, changed_by)
    VALUES (${t}, ${u.status}, ${a}, ${r||null}, ${i})
  `,d[0]??null}async function _(t,n,a){let i=(0,e.getSql)(),r=await i`
    UPDATE bookings SET price_amount = ${n}, updated_at = now()
    WHERE id = ${t}
    RETURNING *
  `;return r[0]?(await g(t,"quoted",a,`Price set to ${n}`),l(t)):r[0]??null}async function f(t,n,a){let i=(0,e.getSql)(),r=await i`
    UPDATE bookings SET payment_status = ${n}, updated_at = now()
    WHERE id = ${t}
    RETURNING *
  `;return r[0]&&"received"===n?(await g(t,"confirmed",a,"Payment received"),l(t)):r[0]??null}async function S(t,n,a){let i=(0,e.getSql)(),r=await i`
    UPDATE bookings SET agent_id = ${n}, updated_at = now()
    WHERE id = ${t}
    RETURNING *
  `;return r[0]&&"new"===r[0].status?(await g(t,"reviewing",a,"Assigned to agent"),l(t)):r[0]??null}async function p(t,n){let a=(0,e.getSql)();return(await a`
    UPDATE bookings SET internal_remarks = ${n}, updated_at = now()
    WHERE id = ${t}
    RETURNING *
  `)[0]??null}async function $(t){let n=(0,e.getSql)();return await n`
    SELECT * FROM booking_status_history WHERE booking_id = ${t} ORDER BY created_at ASC
  `}async function R(t,n,a,i){let r=(0,e.getSql)();return(await r`
    INSERT INTO booking_documents (booking_id, doc_type, url, uploaded_by)
    VALUES (${t}, ${n}, ${a}, ${i})
    RETURNING *
  `)[0]}async function m(t){let n=(0,e.getSql)();return await n`
    SELECT * FROM booking_documents WHERE booking_id = ${t} ORDER BY created_at DESC
  `}async function h(t,n,a){let i=(0,e.getSql)();return(await i`
    INSERT INTO booking_notifications (booking_id, channel, message)
    VALUES (${t}, ${n}, ${a})
    RETURNING *
  `)[0]}async function T(t){let n=(0,e.getSql)();return await n`
    SELECT * FROM booking_notifications WHERE booking_id = ${t} ORDER BY created_at DESC
  `}async function y(t){let n=(0,e.getSql)();return(await n`
    UPDATE bookings
    SET brochure_sent_at = now(), quotation_status = 'sent', updated_at = now()
    WHERE id = ${t}
    RETURNING *
  `)[0]??null}t.s(["SoldOutError",0,s,"addDocument",0,R,"addNotification",0,h,"assignAgent",0,S,"createBooking",0,o,"getBookingById",0,l,"getBookingDetail",0,u,"listAll",0,E,"listForAgent",0,c,"listForUser",0,d,"markBrochureSent",0,y,"setPaymentStatus",0,f,"setPricing",0,_,"setRemarks",0,p,"updateStatus",0,g])},93695,(t,e,n)=>{e.exports=t.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},66680,(t,e,n)=>{e.exports=t.x("node:crypto",()=>require("node:crypto"))},2972,t=>{"use strict";var e=t.i(66680);let n="bandhan_admin_session";function a(){return process.env.ADMIN_PASSWORD||"bandhan@admin"}function i(){let t=process.env.ADMIN_SESSION_SECRET||"bandhan-admin-session-secret";return e.default.createHash("sha256").update(`${a()}::${t}`).digest("hex")}function r(t){if(!t)return!1;let n=i();return t.length===n.length&&e.default.timingSafeEqual(Buffer.from(t),Buffer.from(n))}t.s(["ADMIN_COOKIE",0,n,"SESSION_MAX_AGE",0,28800,"getAdminPassword",0,a,"isValidToken",0,r,"requireAdmin",0,function(t){let e=(t.headers.get("cookie")||"").split(";").map(t=>t.trim()).find(t=>t.startsWith(`${n}=`));return r(e?decodeURIComponent(e.slice(n.length+1)):null)},"sessionToken",0,i])},33236,t=>{"use strict";var e=t.i(43793);async function n(t,n,a,i){let r=(0,e.getSql)();return(await r`
    INSERT INTO agents (name, email, password_hash, phone)
    VALUES (${t}, ${n.toLowerCase()}, ${a}, ${i||null})
    RETURNING id, name, email, phone, status, created_at
  `)[0]}async function a(t){let n=(0,e.getSql)();return(await n`
    SELECT id, name, email, phone, status, password_hash, created_at
    FROM agents
    WHERE email = ${t.toLowerCase()}
    LIMIT 1
  `)[0]??null}async function i(t){let n=(0,e.getSql)();return(await n`
    SELECT id, name, email, phone, status, created_at
    FROM agents
    WHERE id = ${t}
    LIMIT 1
  `)[0]??null}async function r(){let t=(0,e.getSql)();return await t`
    SELECT id, name, email, phone, status, created_at
    FROM agents
    ORDER BY created_at DESC
  `}async function s(t,n){let a=(0,e.getSql)();return(await a`
    UPDATE agents SET status = ${n} WHERE id = ${t}
    RETURNING id, name, email, phone, status, created_at
  `)[0]??null}t.s(["createAgent",0,n,"findAgentByEmail",0,a,"findAgentById",0,i,"listAgents",0,r,"setAgentStatus",0,s])},18309,t=>{"use strict";var e=t.i(66680);t.i(82037);let n=process.env.AUTH_SECRET||"bandhan-user-auth-dev-secret";function a(t){return e.default.createHmac("sha256",`agent:${n}`).update(t).digest("hex")}t.s(["AGENT_COOKIE",0,"bandhan_agent_session","agentSessionCookieOptions",0,function(){return{httpOnly:!0,sameSite:"lax",path:"/",maxAge:604800,secure:!0}},"signAgentSession",0,function(t){return`${t}.${a(t)}`},"verifyAgentSession",0,function(t){if(!t)return null;let n=t.lastIndexOf(".");if(n<=0)return null;let i=t.slice(0,n),r=t.slice(n+1),s=a(i),o=Buffer.from(r),l=Buffer.from(s);return o.length!==l.length?null:e.default.timingSafeEqual(o,l)?i:null}])},34468,t=>{"use strict";var e=t.i(2972),n=t.i(18309),a=t.i(33236);async function i(t){var i;let r;if((0,e.requireAdmin)(t))return{kind:"admin",label:"admin"};let s=(0,n.verifyAgentSession)((i=n.AGENT_COOKIE,(r=(t.headers.get("cookie")||"").split(";").map(t=>t.trim()).find(t=>t.startsWith(`${i}=`)))?decodeURIComponent(r.slice(i.length+1)):null));if(!s)return null;let o=await (0,a.findAgentById)(s);return o&&"active"===o.status?{kind:"agent",id:o.id,label:`agent:${o.name}`}:null}t.s(["getActor",0,i])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__086j-ie._.js.map