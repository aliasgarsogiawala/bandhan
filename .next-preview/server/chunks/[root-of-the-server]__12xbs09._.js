module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},66680,(e,t,a)=>{t.exports=e.x("node:crypto",()=>require("node:crypto"))},22556,e=>{"use strict";var t=e.i(43793);async function a(){let e=(0,t.getSql)();return await e`
    SELECT * FROM group_departures WHERE is_active = true ORDER BY created_at ASC
  `}async function r(){let e=(0,t.getSql)();return await e`SELECT * FROM group_departures ORDER BY created_at ASC`}async function n(e){let a=(0,t.getSql)();return(await a`
    SELECT * FROM group_departures WHERE id = ${e} LIMIT 1
  `)[0]??null}async function o(e){let a=(0,t.getSql)(),r=e.seatsLeft??e.totalSeats;return(await a`
    INSERT INTO group_departures (destination, date, duration, price, seats_left, total_seats, status)
    VALUES (
      ${e.destination}, ${e.date}, ${e.duration||null}, ${e.price||null},
      ${r}, ${e.totalSeats}, ${e.status||"guaranteed"}
    )
    RETURNING *
  `)[0]}async function i(e,a){let r=await n(e);if(!r)return null;let o=(0,t.getSql)();return(await o`
    UPDATE group_departures SET
      destination = ${a.destination??r.destination},
      date = ${a.date??r.date},
      duration = ${a.duration??r.duration},
      price = ${a.price??r.price},
      total_seats = ${a.totalSeats??r.total_seats},
      seats_left = ${a.seatsLeft??r.seats_left},
      status = ${a.status??r.status},
      is_active = ${a.isActive??r.is_active},
      updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `)[0]??null}async function s(e){let a=(0,t.getSql)();await a`DELETE FROM group_departures WHERE id = ${e}`}async function l(e,a){let r=(0,t.getSql)();return(await r`
    UPDATE group_departures
    SET
      seats_left = seats_left - ${a},
      status = CASE WHEN seats_left - ${a} <= 0 THEN 'sold-out' ELSE status END,
      updated_at = now()
    WHERE id = ${e} AND seats_left >= ${a}
    RETURNING *
  `)[0]??null}async function u(e,a){let r=(0,t.getSql)();return(await r`
    UPDATE group_departures
    SET
      seats_left = LEAST(seats_left + ${a}, total_seats),
      status = CASE WHEN status = 'sold-out' AND seats_left + ${a} > 0 THEN 'limited-seats' ELSE status END,
      updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `)[0]??null}e.s(["createDeparture",0,o,"decrementSeats",0,l,"deleteDeparture",0,s,"getDepartureById",0,n,"listActiveDepartures",0,a,"listAllDepartures",0,r,"restoreSeats",0,u,"updateDeparture",0,i])},93384,e=>{"use strict";e.s(["formatMoney",0,function(e){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(Math.round(e))},"packageSnapshot",0,function(e){return{source:"package",id:e.id,title:e.title,destination:e.title,category:e.category,duration:e.duration,tagline:e.tagline,overview:e.overview,heroImage:e.heroImage||e.image,bestTime:e.bestTime,startingPoint:e.startingPoint,groupSize:e.groupSize,themes:e.themes,highlights:e.highlights,itinerary:e.itinerary,inclusions:e.inclusions,exclusions:e.exclusions,gallery:e.gallery}},"totalTravellers",0,function(e){return e.adults+e.childrenWithBed+e.childrenWithoutBed+e.infants}])},61745,e=>{"use strict";var t=e.i(43793),a=e.i(22556),r=e.i(93384);let n="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";async function o(){let e=(0,t.getSql)();for(let t=0;t<5;t++){let t=function(){let e="";for(let t=0;t<6;t++)e+=n[Math.floor(Math.random()*n.length)];return`BKG-${e}`}();if(0===(await e`SELECT 1 FROM bookings WHERE booking_code = ${t} LIMIT 1`).length)return t}throw Error("Could not generate a unique booking code.")}class i extends Error{constructor(){super("This departure is sold out."),this.name="SoldOutError"}}async function s(e){let n=e.destination,s=e.travelDate,l=e.packageTitle;if(e.departureId){let t=await (0,a.getDepartureById)(e.departureId);if(!t||t.seats_left<=0)throw new i;n=n||t.destination,s=s||t.date,l=l||t.destination}let u=(0,t.getSql)(),d=await o(),c=`QT-${d.replace("BKG-","")}`,p=e.travellers||{adults:Math.max(1,e.travellersCount||1),childrenWithBed:0,childrenWithoutBed:0,infants:0},g=e.rooms||{singleRooms:0,doubleRooms:1,tripleRooms:0},E=JSON.stringify(e.selectedAddons||[]),f=JSON.stringify(e.pricingSnapshot||{}),h=JSON.stringify(e.packageSnapshot||{}),{party:m}=e,R=e.status||"new",_=(await u`
    INSERT INTO bookings (
      booking_code, type, user_id, agent_id, package_id, package_title, departure_id, destination,
      travel_date, travellers_count, traveller_names, budget, special_requirements,
      contact_name, contact_email, contact_phone, booking_source, departure_city,
      duration_label, adults, children_with_bed, children_without_bed, infants,
      room_configuration, selected_addons, pricing_snapshot, package_snapshot,
      terms_accepted, quotation_number, price_amount, status, booked_for,
      booker_name, booker_email, booker_phone, booker_relation, notify_booker, agent_reference
    ) VALUES (
      ${d}, ${e.type}, ${e.userId||null}, ${e.agentId||null},
      ${e.packageId||null},
      ${l||null}, ${e.departureId||null}, ${n||null},
      ${s||null}, ${e.travellersCount??null}, ${e.travellerNames||null},
      ${e.budget||null}, ${e.specialRequirements||null}, ${m.contact.name},
      ${m.contact.email}, ${m.contact.phone}, ${e.bookingSource||"package"},
      ${e.departureCity||null}, ${e.durationLabel||null}, ${p.adults},
      ${p.childrenWithBed}, ${p.childrenWithoutBed}, ${p.infants},
      ${JSON.stringify(g)}::jsonb, ${E}::jsonb, ${f}::jsonb,
      ${h}::jsonb, ${!!e.termsAccepted}, ${c},
      ${e.pricingSnapshot?.total?(0,r.formatMoney)(e.pricingSnapshot.total):null},
      ${R}, ${m.bookedFor}, ${m.booker?.name||null},
      ${m.booker?.email||null}, ${m.booker?.phone||null},
      ${m.relation||null}, ${m.notifyBooker}, ${e.agentReference||null}
    )
    RETURNING *
  `)[0];return await u`
    INSERT INTO booking_status_history (booking_id, from_status, to_status, note, changed_by)
    VALUES (
      ${_.id}, NULL, ${R},
      ${e.createdNote||"Request submitted"}, ${e.createdBy||"system"}
    )
  `,_}async function l(e){let a=(0,t.getSql)();return(await a`SELECT * FROM bookings WHERE id = ${e} LIMIT 1`)[0]??null}async function u(e){let t=await l(e);if(!t)return null;let[a,r,n]=await Promise.all([R(e),S(e),y(e)]);return{...t,history:a,documents:r,notifications:n}}async function d(e){let a=(0,t.getSql)();return await a`
    SELECT * FROM bookings WHERE user_id = ${e} ORDER BY created_at DESC
  `}async function c(e){let a=(0,t.getSql)();return await a`
    SELECT * FROM bookings
    WHERE agent_id = ${e} OR agent_id IS NULL
    ORDER BY created_at DESC
  `}async function p(){let e=(0,t.getSql)();return await e`SELECT * FROM bookings ORDER BY created_at DESC`}async function g(e,r,n,o){let s=(0,t.getSql)(),u=await l(e);if(!u)return null;if(u.departure_id&&"confirmed"===r&&"confirmed"!==u.status){if(!await (0,a.decrementSeats)(u.departure_id,u.travellers_count||1))throw new i}else u.departure_id&&"confirmed"===u.status&&("cancelled"===r||"rejected"===r)&&await (0,a.restoreSeats)(u.departure_id,u.travellers_count||1);let d=await s`
    UPDATE bookings SET status = ${r}, updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `;return await s`
    INSERT INTO booking_status_history (booking_id, from_status, to_status, note, changed_by)
    VALUES (${e}, ${u.status}, ${r}, ${o||null}, ${n})
  `,d[0]??null}async function E(e,a,r){let n=(0,t.getSql)(),o=await n`
    UPDATE bookings SET price_amount = ${a}, updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `;return o[0]?(await g(e,"quoted",r,`Price set to ${a}`),l(e)):o[0]??null}async function f(e,a,r){let n=(0,t.getSql)(),o=await n`
    UPDATE bookings SET payment_status = ${a}, updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `;return o[0]&&"received"===a?(await g(e,"confirmed",r,"Payment received"),l(e)):o[0]??null}async function h(e,a,r){let n=(0,t.getSql)(),o=await n`
    UPDATE bookings SET agent_id = ${a}, updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `;return o[0]&&"new"===o[0].status?(await g(e,"reviewing",r,"Assigned to agent"),l(e)):o[0]??null}async function m(e,a){let r=(0,t.getSql)();return(await r`
    UPDATE bookings SET internal_remarks = ${a}, updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `)[0]??null}async function R(e){let a=(0,t.getSql)();return await a`
    SELECT * FROM booking_status_history WHERE booking_id = ${e} ORDER BY created_at ASC
  `}async function _(e,a,r,n){let o=(0,t.getSql)();return(await o`
    INSERT INTO booking_documents (booking_id, doc_type, url, uploaded_by)
    VALUES (${e}, ${a}, ${r}, ${n})
    RETURNING *
  `)[0]}async function S(e){let a=(0,t.getSql)();return await a`
    SELECT * FROM booking_documents WHERE booking_id = ${e} ORDER BY created_at DESC
  `}async function b(e,a,r){let n=(0,t.getSql)();return(await n`
    INSERT INTO booking_notifications (booking_id, channel, message)
    VALUES (${e}, ${a}, ${r})
    RETURNING *
  `)[0]}async function y(e){let a=(0,t.getSql)();return await a`
    SELECT * FROM booking_notifications WHERE booking_id = ${e} ORDER BY created_at DESC
  `}async function w(e){let a=(0,t.getSql)();return(await a`
    UPDATE bookings
    SET brochure_sent_at = now(), quotation_status = 'sent', updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `)[0]??null}e.s(["SoldOutError",0,i,"addDocument",0,_,"addNotification",0,b,"assignAgent",0,h,"createBooking",0,s,"getBookingById",0,l,"getBookingDetail",0,u,"listAll",0,p,"listForAgent",0,c,"listForUser",0,d,"markBrochureSent",0,w,"setPaymentStatus",0,f,"setPricing",0,E,"setRemarks",0,m,"updateStatus",0,g])},91180,e=>{"use strict";var t=e.i(66680),a=e.i(82037);let r="bandhan_user_session",n=process.env.AUTH_SECRET||"bandhan-user-auth-dev-secret";function o(e){return t.default.createHmac("sha256",n).update(e).digest("hex")}async function i(){let e=await (0,a.cookies)();return function(e){if(!e)return null;let a=e.lastIndexOf(".");if(a<=0)return null;let r=e.slice(0,a),n=e.slice(a+1),i=o(r),s=Buffer.from(n),l=Buffer.from(i);return s.length!==l.length?null:t.default.timingSafeEqual(s,l)?r:null}(e.get(r)?.value)}e.s(["USER_COOKIE",0,r,"getSessionUserId",0,i,"sessionCookieOptions",0,function(){return{httpOnly:!0,sameSite:"lax",path:"/",maxAge:2592e3,secure:!0}},"signSession",0,function(e){return`${e}.${o(e)}`}])},7798,e=>{"use strict";var t=e.i(43793);async function a(e,a,r){let n=(0,t.getSql)();return(await n`
    INSERT INTO users (name, email, password_hash)
    VALUES (${e}, ${a.toLowerCase()}, ${r})
    RETURNING id, name, email
  `)[0]}async function r(e){let a=(0,t.getSql)();return(await a`
    SELECT id, name, email, password_hash
    FROM users
    WHERE email = ${e.toLowerCase()}
    LIMIT 1
  `)[0]??null}async function n(e){let a=(0,t.getSql)();return(await a`
    SELECT id, name, email
    FROM users
    WHERE id = ${e}
    LIMIT 1
  `)[0]??null}e.s(["createUser",0,a,"findUserByEmail",0,r,"findUserById",0,n])},52124,e=>{"use strict";let t=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;class a extends Error{constructor(e){super(e),this.name="PartyError"}}let r=e=>(e||"").trim().toLowerCase();function n(e,t){if(e.length<2)throw new a(`Please enter ${t}.`);return e}function o(e,r){if(!t.test(e))throw new a(`Please enter a valid ${r}.`);return e}function i(e,t){if(e.replace(/\D/g,"").length<8)throw new a(`Please enter a valid ${t}.`);return e}e.s(["PartyError",0,a,"normalizeParty",0,function(e,s={}){var l;let u="self"===(l=e.bookedFor)||"guest"===l||"client"===l?e.bookedFor:"self",d=s.allow;if(d&&!d.includes(u))throw new a("This booking journey isn't available here.");let c=e.contact||{};if("self"===u){let e=s.account;return{bookedFor:u,contact:{name:e?e.name:n((c.name||"").trim(),"the lead traveller's name"),email:e?e.email:o(r(c.email),"email address"),phone:i((c.phone||"").trim(),"phone number")},booker:null,relation:null,notifyBooker:!0}}let p="client"===u&&s.agentContact?s.agentContact:{name:n((e.booker?.name||"").trim(),"your name"),email:o(r(e.booker?.email),"email address for yourself"),phone:i((e.booker?.phone||"").trim(),"phone number for yourself")},g=r(c.email),E=(c.phone||"").trim();if(g&&!t.test(g))throw new a("Please enter a valid email address for the lead traveller.");if(E&&E.replace(/\D/g,"").length<8)throw new a("Please enter a valid phone number for the lead traveller.");return{bookedFor:u,contact:{name:n((c.name||"").trim(),"client"===u?"your client's name":"the traveller's name"),email:g||p.email,phone:E||p.phone},booker:p,relation:(e.relation||"").trim()||null,notifyBooker:!1!==e.notifyBooker}}])},95268,e=>{"use strict";var t=e.i(57881),a=e.i(42355),r=e.i(27744),n=e.i(27098),o=e.i(12444),i=e.i(38333),s=e.i(498),l=e.i(43068),u=e.i(18480),d=e.i(58604),c=e.i(71547),p=e.i(95196),g=e.i(35439),E=e.i(7777),f=e.i(58831),h=e.i(93695);e.i(50386);var m=e.i(27031),R=e.i(73763),_=e.i(43793),S=e.i(91180),b=e.i(7798),y=e.i(61745),w=e.i(52124),k=e.i(93384);async function $(e){var t,a;let r,n,o;if(!(0,_.isDbConfigured)())return R.NextResponse.json({ok:!1,error:"Booking isn't available yet — the database isn't configured."},{status:503});try{r=await e.json()}catch{return R.NextResponse.json({ok:!1,error:"Invalid request."},{status:400})}let i="customized"===r.type?"customized":"standard",s="destination"===r.bookingSource||"custom"===r.bookingSource?r.bookingSource:"package",l=await (0,S.getSessionUserId)();if("custom"===s&&!l)return R.NextResponse.json({ok:!1,error:"Please sign in to submit a customized trip request."},{status:401});let u=l?await (0,b.findUserById)(l):null;try{n=(0,w.normalizeParty)({bookedFor:r.bookedFor,contact:r.contact,booker:r.booker,relation:r.relation,notifyBooker:r.notifyBooker},{account:u,allow:["self","guest"]})}catch(e){if(e instanceof w.PartyError)return v(e.message);throw e}if("customized"===i&&!(r.destination||"").trim())return v("Please tell us your preferred destination.");if("standard"===i&&!(r.packageTitle||"").trim())return v("Missing package details.");if(!(r.travelDate||"").trim())return v("Please select your travel date.");if(!r.termsAccepted)return v("Please accept the booking and cancellation terms.");let d=(t=r.travellers,a=r.travellersCount,{adults:(o=(e,t=0)=>{let a=Number(e);return Number.isFinite(a)?Math.min(99,Math.max(0,Math.floor(a))):t})(t?.adults,o(a,1)),childrenWithBed:o(t?.childrenWithBed),childrenWithoutBed:o(t?.childrenWithoutBed),infants:o(t?.infants)}),c=(0,k.totalTravellers)(d);if(c<1)return v("Please add at least one traveller.");if(r.pricingSnapshot&&!Number.isFinite(Number(r.pricingSnapshot.total)))return v("The quotation could not be calculated. Please review your trip details.");try{let e=await (0,y.createBooking)({type:i,userId:l,packageId:r.packageId,packageTitle:r.packageTitle,departureId:r.departureId,bookingSource:s,destination:r.destination,travelDate:r.travelDate,travellersCount:c,travellerNames:r.travellerNames,budget:r.budget,specialRequirements:r.specialRequirements,departureCity:r.departureCity,durationLabel:r.durationLabel,travellers:d,rooms:r.rooms,selectedAddons:r.selectedAddons,pricingSnapshot:r.pricingSnapshot,packageSnapshot:r.packageSnapshot,termsAccepted:r.termsAccepted,party:n,createdNote:"guest"===n.bookedFor?`Request submitted by ${n.booker?.name} for ${n.contact.name}`:"Request submitted"});return R.NextResponse.json({ok:!0,booking:e,accessToken:e.access_token,brochureUrl:`/api/bookings/${e.id}/brochure?token=${e.access_token}`})}catch(e){if(e instanceof y.SoldOutError)return R.NextResponse.json({ok:!1,error:e.message},{status:409});return console.error("create booking error:",e),R.NextResponse.json({ok:!1,error:"Could not submit your booking. Please try again."},{status:500})}}function v(e){return R.NextResponse.json({ok:!1,error:e},{status:400})}e.s(["POST",0,$],76886);var T=e.i(76886);let N=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/bookings/route",pathname:"/api/bookings",filename:"route",bundlePath:""},distDir:".next-preview",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/bookings/route.ts",nextConfigOutput:"",userland:T,...{}}),{workAsyncStorage:x,workUnitAsyncStorage:I,serverHooks:C}=N;async function A(e,t,r){r.requestMeta&&(0,n.setRequestMeta)(e,r.requestMeta),N.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let R="/api/bookings/route";R=R.replace(/\/index$/,"")||"/";let _=await N.prepare(e,t,{srcPage:R,multiZoneDraftMode:!1});if(!_)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:S,deploymentId:b,params:y,nextConfig:w,parsedUrl:k,isDraftMode:$,prerenderManifest:v,routerServerContext:T,isOnDemandRevalidate:x,revalidateOnlyGenerated:I,resolvedPathname:C,clientReferenceManifest:A,serverActionsManifest:q}=_,O=(0,s.normalizeAppPath)(R),P=!!(v.dynamicRoutes[O]||v.routes[C]),U=async()=>((null==T?void 0:T.render404)?await T.render404(e,t,k,!1):t.end("This page could not be found"),null);if(P&&!$){let e=!!v.routes[C],t=v.dynamicRoutes[O];if(t&&!1===t.fallback&&!e){if(w.adapterPath)return await U();throw new h.NoFallbackError}}let D=null;!P||N.isDev||$||(D="/index"===(D=C)?"/":D);let B=!0===N.isDev||!P,L=P&&!B;q&&A&&(0,i.setManifestsSingleton)({page:R,clientReferenceManifest:A,serverActionsManifest:q});let H=e.method||"GET",M=(0,o.getTracer)(),W=M.getActiveScopeSpan(),F=!!(null==T?void 0:T.isWrappedByNextServer),j=!!(0,n.getRequestMeta)(e,"minimalMode"),G=(0,n.getRequestMeta)(e,"incrementalCache")||await N.getIncrementalCache(e,w,v,j);null==G||G.resetRequestCache(),globalThis.__incrementalCache=G;let K={params:y,previewProps:v.preview,renderOpts:{experimental:{authInterrupts:!!w.experimental.authInterrupts},cacheComponents:!!w.cacheComponents,supportsDynamicResponse:B,incrementalCache:G,cacheLifeProfiles:w.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,n)=>N.onRequestError(e,t,r,n,T)},sharedContext:{buildId:S,deploymentId:b}},V=new l.NodeNextRequest(e),z=new l.NodeNextResponse(t),Y=u.NextRequestAdapter.fromNodeNextRequest(V,(0,u.signalFromNodeResponse)(t));try{let n,i=async e=>N.handle(Y,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=M.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${H} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t),n&&n!==e&&(n.setAttribute("http.route",r),n.updateName(t))}else e.updateName(`${H} ${R}`)}),s=async n=>{var o,s;let l=async({previousCacheEntry:a})=>{try{if(!j&&x&&I&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let o=await i(n);e.fetchMetrics=K.renderOpts.fetchMetrics;let s=K.renderOpts.pendingWaitUntil;s&&r.waitUntil&&(r.waitUntil(s),s=void 0);let l=K.renderOpts.collectedTags;if(!P)return await (0,p.sendResponse)(V,z,o,K.renderOpts.pendingWaitUntil),null;{let e=await o.blob(),t=(0,g.toNodeOutgoingHttpHeaders)(o.headers);l&&(t[f.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,r=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:m.CachedRouteKind.APP_ROUTE,status:o.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==a?void 0:a.isStale)&&await N.onRequestError(e,t,{routerKind:"App Router",routePath:R,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:L,isOnDemandRevalidate:x})},!1,T),t}},u=await N.handleResponse({req:e,nextConfig:w,cacheKey:D,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:v,isRoutePPREnabled:!1,isOnDemandRevalidate:x,revalidateOnlyGenerated:I,responseGenerator:l,waitUntil:r.waitUntil,isMinimalMode:j});if(!P)return null;if((null==u||null==(o=u.value)?void 0:o.kind)!==m.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(s=u.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});j||t.setHeader("x-nextjs-cache",x?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),$&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,g.fromNodeOutgoingHttpHeaders)(u.value.headers);return j&&P||d.delete(f.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,E.getCacheControlHeader)(u.cacheControl)),await (0,p.sendResponse)(V,z,new Response(u.value.body,{headers:d,status:u.value.status||200})),null};F&&W?await s(W):(n=M.getActiveScopeSpan(),await M.withPropagatedContext(e.headers,()=>M.trace(d.BaseServerSpan.handleRequest,{spanName:`${H} ${R}`,kind:o.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},s),void 0,!F))}catch(t){if(t instanceof h.NoFallbackError||await N.onRequestError(e,t,{routerKind:"App Router",routePath:O,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:L,isOnDemandRevalidate:x})},!1,T),P)throw t;return await (0,p.sendResponse)(V,z,new Response(null,{status:500})),null}}e.s(["handler",0,A,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:x,workUnitAsyncStorage:I})},"routeModule",0,N,"serverHooks",0,C,"workAsyncStorage",0,x,"workUnitAsyncStorage",0,I],95268)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__12xbs09._.js.map