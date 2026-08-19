module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},66680,(e,t,a)=>{t.exports=e.x("node:crypto",()=>require("node:crypto"))},2972,e=>{"use strict";var t=e.i(66680);let a="bandhan_admin_session";function n(){return process.env.ADMIN_PASSWORD||"bandhan@admin"}function r(){let e=process.env.ADMIN_SESSION_SECRET||"bandhan-admin-session-secret";return t.default.createHash("sha256").update(`${n()}::${e}`).digest("hex")}function o(e){if(!e)return!1;let a=r();return e.length===a.length&&t.default.timingSafeEqual(Buffer.from(e),Buffer.from(a))}e.s(["ADMIN_COOKIE",0,a,"SESSION_MAX_AGE",0,28800,"getAdminPassword",0,n,"isValidToken",0,o,"requireAdmin",0,function(e){let t=(e.headers.get("cookie")||"").split(";").map(e=>e.trim()).find(e=>e.startsWith(`${a}=`));return o(t?decodeURIComponent(t.slice(a.length+1)):null)},"sessionToken",0,r])},22556,e=>{"use strict";var t=e.i(43793);async function a(){let e=(0,t.getSql)();return await e`
    SELECT * FROM group_departures WHERE is_active = true ORDER BY created_at ASC
  `}async function n(){let e=(0,t.getSql)();return await e`SELECT * FROM group_departures ORDER BY created_at ASC`}async function r(e){let a=(0,t.getSql)();return(await a`
    SELECT * FROM group_departures WHERE id = ${e} LIMIT 1
  `)[0]??null}async function o(e){let a=(0,t.getSql)(),n=e.seatsLeft??e.totalSeats;return(await a`
    INSERT INTO group_departures (destination, date, duration, price, seats_left, total_seats, status)
    VALUES (
      ${e.destination}, ${e.date}, ${e.duration||null}, ${e.price||null},
      ${n}, ${e.totalSeats}, ${e.status||"guaranteed"}
    )
    RETURNING *
  `)[0]}async function i(e,a){let n=await r(e);if(!n)return null;let o=(0,t.getSql)();return(await o`
    UPDATE group_departures SET
      destination = ${a.destination??n.destination},
      date = ${a.date??n.date},
      duration = ${a.duration??n.duration},
      price = ${a.price??n.price},
      total_seats = ${a.totalSeats??n.total_seats},
      seats_left = ${a.seatsLeft??n.seats_left},
      status = ${a.status??n.status},
      is_active = ${a.isActive??n.is_active},
      updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `)[0]??null}async function s(e){let a=(0,t.getSql)();await a`DELETE FROM group_departures WHERE id = ${e}`}async function l(e,a){let n=(0,t.getSql)();return(await n`
    UPDATE group_departures
    SET
      seats_left = seats_left - ${a},
      status = CASE WHEN seats_left - ${a} <= 0 THEN 'sold-out' ELSE status END,
      updated_at = now()
    WHERE id = ${e} AND seats_left >= ${a}
    RETURNING *
  `)[0]??null}async function u(e,a){let n=(0,t.getSql)();return(await n`
    UPDATE group_departures
    SET
      seats_left = LEAST(seats_left + ${a}, total_seats),
      status = CASE WHEN status = 'sold-out' AND seats_left + ${a} > 0 THEN 'limited-seats' ELSE status END,
      updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `)[0]??null}e.s(["createDeparture",0,o,"decrementSeats",0,l,"deleteDeparture",0,s,"getDepartureById",0,r,"listActiveDepartures",0,a,"listAllDepartures",0,n,"restoreSeats",0,u,"updateDeparture",0,i])},93384,e=>{"use strict";e.s(["formatMoney",0,function(e){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(Math.round(e))},"packageSnapshot",0,function(e){return{source:"package",id:e.id,title:e.title,destination:e.title,category:e.category,duration:e.duration,tagline:e.tagline,overview:e.overview,heroImage:e.heroImage||e.image,bestTime:e.bestTime,startingPoint:e.startingPoint,groupSize:e.groupSize,themes:e.themes,highlights:e.highlights,itinerary:e.itinerary,inclusions:e.inclusions,exclusions:e.exclusions,gallery:e.gallery}},"totalTravellers",0,function(e){return e.adults+e.childrenWithBed+e.childrenWithoutBed+e.infants}])},61745,e=>{"use strict";var t=e.i(43793),a=e.i(22556),n=e.i(93384);let r="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";async function o(){let e=(0,t.getSql)();for(let t=0;t<5;t++){let t=function(){let e="";for(let t=0;t<6;t++)e+=r[Math.floor(Math.random()*r.length)];return`BKG-${e}`}();if(0===(await e`SELECT 1 FROM bookings WHERE booking_code = ${t} LIMIT 1`).length)return t}throw Error("Could not generate a unique booking code.")}class i extends Error{constructor(){super("This departure is sold out."),this.name="SoldOutError"}}async function s(e){let r=e.destination,s=e.travelDate,l=e.packageTitle;if(e.departureId){let t=await (0,a.getDepartureById)(e.departureId);if(!t||t.seats_left<=0)throw new i;r=r||t.destination,s=s||t.date,l=l||t.destination}let u=(0,t.getSql)(),d=await o(),c=`QT-${d.replace("BKG-","")}`,p=e.travellers||{adults:Math.max(1,e.travellersCount||1),childrenWithBed:0,childrenWithoutBed:0,infants:0},g=e.rooms||{singleRooms:0,doubleRooms:1,tripleRooms:0},E=JSON.stringify(e.selectedAddons||[]),R=JSON.stringify(e.pricingSnapshot||{}),f=JSON.stringify(e.packageSnapshot||{}),{party:h}=e,_=e.status||"new",m=(await u`
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
      ${l||null}, ${e.departureId||null}, ${r||null},
      ${s||null}, ${e.travellersCount??null}, ${e.travellerNames||null},
      ${e.budget||null}, ${e.specialRequirements||null}, ${h.contact.name},
      ${h.contact.email}, ${h.contact.phone}, ${e.bookingSource||"package"},
      ${e.departureCity||null}, ${e.durationLabel||null}, ${p.adults},
      ${p.childrenWithBed}, ${p.childrenWithoutBed}, ${p.infants},
      ${JSON.stringify(g)}::jsonb, ${E}::jsonb, ${R}::jsonb,
      ${f}::jsonb, ${!!e.termsAccepted}, ${c},
      ${e.pricingSnapshot?.total?(0,n.formatMoney)(e.pricingSnapshot.total):null},
      ${_}, ${h.bookedFor}, ${h.booker?.name||null},
      ${h.booker?.email||null}, ${h.booker?.phone||null},
      ${h.relation||null}, ${h.notifyBooker}, ${e.agentReference||null}
    )
    RETURNING *
  `)[0];return await u`
    INSERT INTO booking_status_history (booking_id, from_status, to_status, note, changed_by)
    VALUES (
      ${m.id}, NULL, ${_},
      ${e.createdNote||"Request submitted"}, ${e.createdBy||"system"}
    )
  `,m}async function l(e){let a=(0,t.getSql)();return(await a`SELECT * FROM bookings WHERE id = ${e} LIMIT 1`)[0]??null}async function u(e){let t=await l(e);if(!t)return null;let[a,n,r]=await Promise.all([_(e),S(e),$(e)]);return{...t,history:a,documents:n,notifications:r}}async function d(e){let a=(0,t.getSql)();return await a`
    SELECT * FROM bookings WHERE user_id = ${e} ORDER BY created_at DESC
  `}async function c(e){let a=(0,t.getSql)();return await a`
    SELECT * FROM bookings
    WHERE agent_id = ${e} OR agent_id IS NULL
    ORDER BY created_at DESC
  `}async function p(){let e=(0,t.getSql)();return await e`SELECT * FROM bookings ORDER BY created_at DESC`}async function g(e,n,r,o){let s=(0,t.getSql)(),u=await l(e);if(!u)return null;if(u.departure_id&&"confirmed"===n&&"confirmed"!==u.status){if(!await (0,a.decrementSeats)(u.departure_id,u.travellers_count||1))throw new i}else u.departure_id&&"confirmed"===u.status&&("cancelled"===n||"rejected"===n)&&await (0,a.restoreSeats)(u.departure_id,u.travellers_count||1);let d=await s`
    UPDATE bookings SET status = ${n}, updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `;return await s`
    INSERT INTO booking_status_history (booking_id, from_status, to_status, note, changed_by)
    VALUES (${e}, ${u.status}, ${n}, ${o||null}, ${r})
  `,d[0]??null}async function E(e,a,n){let r=(0,t.getSql)(),o=await r`
    UPDATE bookings SET price_amount = ${a}, updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `;return o[0]?(await g(e,"quoted",n,`Price set to ${a}`),l(e)):o[0]??null}async function R(e,a,n){let r=(0,t.getSql)(),o=await r`
    UPDATE bookings SET payment_status = ${a}, updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `;return o[0]&&"received"===a?(await g(e,"confirmed",n,"Payment received"),l(e)):o[0]??null}async function f(e,a,n){let r=(0,t.getSql)(),o=await r`
    UPDATE bookings SET agent_id = ${a}, updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `;return o[0]&&"new"===o[0].status?(await g(e,"reviewing",n,"Assigned to agent"),l(e)):o[0]??null}async function h(e,a){let n=(0,t.getSql)();return(await n`
    UPDATE bookings SET internal_remarks = ${a}, updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `)[0]??null}async function _(e){let a=(0,t.getSql)();return await a`
    SELECT * FROM booking_status_history WHERE booking_id = ${e} ORDER BY created_at ASC
  `}async function m(e,a,n,r){let o=(0,t.getSql)();return(await o`
    INSERT INTO booking_documents (booking_id, doc_type, url, uploaded_by)
    VALUES (${e}, ${a}, ${n}, ${r})
    RETURNING *
  `)[0]}async function S(e){let a=(0,t.getSql)();return await a`
    SELECT * FROM booking_documents WHERE booking_id = ${e} ORDER BY created_at DESC
  `}async function b(e,a,n){let r=(0,t.getSql)();return(await r`
    INSERT INTO booking_notifications (booking_id, channel, message)
    VALUES (${e}, ${a}, ${n})
    RETURNING *
  `)[0]}async function $(e){let a=(0,t.getSql)();return await a`
    SELECT * FROM booking_notifications WHERE booking_id = ${e} ORDER BY created_at DESC
  `}async function k(e){let a=(0,t.getSql)();return(await a`
    UPDATE bookings
    SET brochure_sent_at = now(), quotation_status = 'sent', updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `)[0]??null}e.s(["SoldOutError",0,i,"addDocument",0,m,"addNotification",0,b,"assignAgent",0,f,"createBooking",0,s,"getBookingById",0,l,"getBookingDetail",0,u,"listAll",0,p,"listForAgent",0,c,"listForUser",0,d,"markBrochureSent",0,k,"setPaymentStatus",0,R,"setPricing",0,E,"setRemarks",0,h,"updateStatus",0,g])},27614,e=>{"use strict";var t=e.i(57881),a=e.i(42355),n=e.i(27744),r=e.i(27098),o=e.i(12444),i=e.i(38333),s=e.i(498),l=e.i(43068),u=e.i(18480),d=e.i(58604),c=e.i(71547),p=e.i(95196),g=e.i(35439),E=e.i(7777),R=e.i(58831),f=e.i(93695);e.i(50386);var h=e.i(27031),_=e.i(73763),m=e.i(43793),S=e.i(2972),b=e.i(61745);let $=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;async function k(e){if(!(0,m.isDbConfigured)())return _.NextResponse.json({bookings:[]});if(!(0,S.requireAdmin)(e))return _.NextResponse.json({ok:!1,error:"Not authorized."},{status:401});try{let e=await (0,b.listAll)();return _.NextResponse.json({ok:!0,bookings:e})}catch(e){return console.error("list admin bookings error:",e),_.NextResponse.json({ok:!1,error:"Could not load bookings."},{status:500})}}async function w(e){let t;if(!(0,m.isDbConfigured)())return _.NextResponse.json({ok:!1,error:"Not available — the database isn't configured."},{status:503});if(!(0,S.requireAdmin)(e))return _.NextResponse.json({ok:!1,error:"Not authorized."},{status:401});try{t=await e.json()}catch{return _.NextResponse.json({ok:!1,error:"Invalid request."},{status:400})}let a="customized"===t.type?"customized":"standard",n=(t.contactName||"").trim(),r=(t.contactEmail||"").trim().toLowerCase(),o=(t.contactPhone||"").trim();if(n.length<2)return y("Please enter the customer's name.");if(!$.test(r))return y("Please enter a valid email address.");if(o.length<6)return y("Please enter a valid phone number.");if(!t.packageId&&!t.departureId&&!(t.destination||"").trim())return y("Select a package, a departure, or enter a destination.");let i=t.travellersCount?Number(t.travellersCount):void 0;try{let e=await (0,b.createBooking)({type:a,packageId:t.packageId,packageTitle:t.packageTitle,departureId:t.departureId,destination:t.destination,travelDate:t.travelDate,travellersCount:Number.isFinite(i)?i:void 0,travellerNames:t.travellerNames,budget:t.budget,specialRequirements:t.specialRequirements,party:{bookedFor:"self",contact:{name:n,email:r,phone:o},booker:null,relation:null,notifyBooker:!0},createdBy:"admin",createdNote:"Logged by admin"});return _.NextResponse.json({ok:!0,booking:e})}catch(e){if(e instanceof b.SoldOutError)return _.NextResponse.json({ok:!1,error:e.message},{status:409});return console.error("create admin booking error:",e),_.NextResponse.json({ok:!1,error:"Could not create the booking."},{status:500})}}function y(e){return _.NextResponse.json({ok:!1,error:e},{status:400})}e.s(["GET",0,k,"POST",0,w],16186);var N=e.i(16186);let v=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/admin/bookings/route",pathname:"/api/admin/bookings",filename:"route",bundlePath:""},distDir:".next-preview",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/admin/bookings/route.ts",nextConfigOutput:"",userland:N,...{}}),{workAsyncStorage:T,workUnitAsyncStorage:x,serverHooks:I}=v;async function A(e,t,n){n.requestMeta&&(0,r.setRequestMeta)(e,n.requestMeta),v.isDev&&(0,r.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let _="/api/admin/bookings/route";_=_.replace(/\/index$/,"")||"/";let m=await v.prepare(e,t,{srcPage:_,multiZoneDraftMode:!1});if(!m)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:S,deploymentId:b,params:$,nextConfig:k,parsedUrl:w,isDraftMode:y,prerenderManifest:N,routerServerContext:T,isOnDemandRevalidate:x,revalidateOnlyGenerated:I,resolvedPathname:A,clientReferenceManifest:C,serverActionsManifest:q}=m,O=(0,s.normalizeAppPath)(_),D=!!(N.dynamicRoutes[O]||N.routes[A]),U=async()=>((null==T?void 0:T.render404)?await T.render404(e,t,w,!1):t.end("This page could not be found"),null);if(D&&!y){let e=!!N.routes[A],t=N.dynamicRoutes[O];if(t&&!1===t.fallback&&!e){if(k.adapterPath)return await U();throw new f.NoFallbackError}}let P=null;!D||v.isDev||y||(P="/index"===(P=A)?"/":P);let H=!0===v.isDev||!D,M=D&&!H;q&&C&&(0,i.setManifestsSingleton)({page:_,clientReferenceManifest:C,serverActionsManifest:q});let L=e.method||"GET",B=(0,o.getTracer)(),j=B.getActiveScopeSpan(),W=!!(null==T?void 0:T.isWrappedByNextServer),F=!!(0,r.getRequestMeta)(e,"minimalMode"),G=(0,r.getRequestMeta)(e,"incrementalCache")||await v.getIncrementalCache(e,k,N,F);null==G||G.resetRequestCache(),globalThis.__incrementalCache=G;let K={params:$,previewProps:N.preview,renderOpts:{experimental:{authInterrupts:!!k.experimental.authInterrupts},cacheComponents:!!k.cacheComponents,supportsDynamicResponse:H,incrementalCache:G,cacheLifeProfiles:k.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,r)=>v.onRequestError(e,t,n,r,T)},sharedContext:{buildId:S,deploymentId:b}},V=new l.NodeNextRequest(e),Y=new l.NodeNextResponse(t),z=u.NextRequestAdapter.fromNodeNextRequest(V,(0,u.signalFromNodeResponse)(t));try{let r,i=async e=>v.handle(z,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=B.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${L} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",n),r.updateName(t))}else e.updateName(`${L} ${_}`)}),s=async r=>{var o,s;let l=async({previousCacheEntry:a})=>{try{if(!F&&x&&I&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let o=await i(r);e.fetchMetrics=K.renderOpts.fetchMetrics;let s=K.renderOpts.pendingWaitUntil;s&&n.waitUntil&&(n.waitUntil(s),s=void 0);let l=K.renderOpts.collectedTags;if(!D)return await (0,p.sendResponse)(V,Y,o,K.renderOpts.pendingWaitUntil),null;{let e=await o.blob(),t=(0,g.toNodeOutgoingHttpHeaders)(o.headers);l&&(t[R.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=R.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,n=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=R.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:h.CachedRouteKind.APP_ROUTE,status:o.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==a?void 0:a.isStale)&&await v.onRequestError(e,t,{routerKind:"App Router",routePath:_,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:x})},!1,T),t}},u=await v.handleResponse({req:e,nextConfig:k,cacheKey:P,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:N,isRoutePPREnabled:!1,isOnDemandRevalidate:x,revalidateOnlyGenerated:I,responseGenerator:l,waitUntil:n.waitUntil,isMinimalMode:F});if(!D)return null;if((null==u||null==(o=u.value)?void 0:o.kind)!==h.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(s=u.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});F||t.setHeader("x-nextjs-cache",x?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),y&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,g.fromNodeOutgoingHttpHeaders)(u.value.headers);return F&&D||d.delete(R.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,E.getCacheControlHeader)(u.cacheControl)),await (0,p.sendResponse)(V,Y,new Response(u.value.body,{headers:d,status:u.value.status||200})),null};W&&j?await s(j):(r=B.getActiveScopeSpan(),await B.withPropagatedContext(e.headers,()=>B.trace(d.BaseServerSpan.handleRequest,{spanName:`${L} ${_}`,kind:o.SpanKind.SERVER,attributes:{"http.method":L,"http.target":e.url}},s),void 0,!W))}catch(t){if(t instanceof f.NoFallbackError||await v.onRequestError(e,t,{routerKind:"App Router",routePath:O,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:x})},!1,T),D)throw t;return await (0,p.sendResponse)(V,Y,new Response(null,{status:500})),null}}e.s(["handler",0,A,"patchFetch",0,function(){return(0,n.patchFetch)({workAsyncStorage:T,workUnitAsyncStorage:x})},"routeModule",0,v,"serverHooks",0,I,"workAsyncStorage",0,T,"workUnitAsyncStorage",0,x],27614)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__20alv0q._.js.map