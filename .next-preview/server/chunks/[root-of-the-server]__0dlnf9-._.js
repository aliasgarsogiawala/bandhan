module.exports=[18622,(e,t,n)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,n)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,n)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,n)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,n)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,n)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},66680,(e,t,n)=>{t.exports=e.x("node:crypto",()=>require("node:crypto"))},22556,e=>{"use strict";var t=e.i(43793);async function n(){let e=(0,t.getSql)();return await e`
    SELECT * FROM group_departures WHERE is_active = true ORDER BY created_at ASC
  `}async function a(){let e=(0,t.getSql)();return await e`SELECT * FROM group_departures ORDER BY created_at ASC`}async function r(e){let n=(0,t.getSql)();return(await n`
    SELECT * FROM group_departures WHERE id = ${e} LIMIT 1
  `)[0]??null}async function i(e){let n=(0,t.getSql)(),a=e.seatsLeft??e.totalSeats;return(await n`
    INSERT INTO group_departures (destination, date, duration, price, seats_left, total_seats, status)
    VALUES (
      ${e.destination}, ${e.date}, ${e.duration||null}, ${e.price||null},
      ${a}, ${e.totalSeats}, ${e.status||"guaranteed"}
    )
    RETURNING *
  `)[0]}async function o(e,n){let a=await r(e);if(!a)return null;let i=(0,t.getSql)();return(await i`
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
    WHERE id = ${e}
    RETURNING *
  `)[0]??null}async function s(e){let n=(0,t.getSql)();await n`DELETE FROM group_departures WHERE id = ${e}`}async function l(e,n){let a=(0,t.getSql)();return(await a`
    UPDATE group_departures
    SET
      seats_left = seats_left - ${n},
      status = CASE WHEN seats_left - ${n} <= 0 THEN 'sold-out' ELSE status END,
      updated_at = now()
    WHERE id = ${e} AND seats_left >= ${n}
    RETURNING *
  `)[0]??null}async function u(e,n){let a=(0,t.getSql)();return(await a`
    UPDATE group_departures
    SET
      seats_left = LEAST(seats_left + ${n}, total_seats),
      status = CASE WHEN status = 'sold-out' AND seats_left + ${n} > 0 THEN 'limited-seats' ELSE status END,
      updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `)[0]??null}e.s(["createDeparture",0,i,"decrementSeats",0,l,"deleteDeparture",0,s,"getDepartureById",0,r,"listActiveDepartures",0,n,"listAllDepartures",0,a,"restoreSeats",0,u,"updateDeparture",0,o])},93384,e=>{"use strict";e.s(["formatMoney",0,function(e){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(Math.round(e))},"packageSnapshot",0,function(e){return{source:"package",id:e.id,title:e.title,destination:e.title,category:e.category,duration:e.duration,tagline:e.tagline,overview:e.overview,heroImage:e.heroImage||e.image,bestTime:e.bestTime,startingPoint:e.startingPoint,groupSize:e.groupSize,themes:e.themes,highlights:e.highlights,itinerary:e.itinerary,inclusions:e.inclusions,exclusions:e.exclusions,gallery:e.gallery}},"totalTravellers",0,function(e){return e.adults+e.childrenWithBed+e.childrenWithoutBed+e.infants}])},61745,e=>{"use strict";var t=e.i(43793),n=e.i(22556),a=e.i(93384);let r="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";async function i(){let e=(0,t.getSql)();for(let t=0;t<5;t++){let t=function(){let e="";for(let t=0;t<6;t++)e+=r[Math.floor(Math.random()*r.length)];return`BKG-${e}`}();if(0===(await e`SELECT 1 FROM bookings WHERE booking_code = ${t} LIMIT 1`).length)return t}throw Error("Could not generate a unique booking code.")}class o extends Error{constructor(){super("This departure is sold out."),this.name="SoldOutError"}}async function s(e){let r=e.destination,s=e.travelDate,l=e.packageTitle;if(e.departureId){let t=await (0,n.getDepartureById)(e.departureId);if(!t||t.seats_left<=0)throw new o;r=r||t.destination,s=s||t.date,l=l||t.destination}let u=(0,t.getSql)(),d=await i(),c=`QT-${d.replace("BKG-","")}`,p=e.travellers||{adults:Math.max(1,e.travellersCount||1),childrenWithBed:0,childrenWithoutBed:0,infants:0},g=e.rooms||{singleRooms:0,doubleRooms:1,tripleRooms:0},E=JSON.stringify(e.selectedAddons||[]),R=JSON.stringify(e.pricingSnapshot||{}),f=JSON.stringify(e.packageSnapshot||{}),{party:_}=e,h=e.status||"new",S=(await u`
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
      ${e.budget||null}, ${e.specialRequirements||null}, ${_.contact.name},
      ${_.contact.email}, ${_.contact.phone}, ${e.bookingSource||"package"},
      ${e.departureCity||null}, ${e.durationLabel||null}, ${p.adults},
      ${p.childrenWithBed}, ${p.childrenWithoutBed}, ${p.infants},
      ${JSON.stringify(g)}::jsonb, ${E}::jsonb, ${R}::jsonb,
      ${f}::jsonb, ${!!e.termsAccepted}, ${c},
      ${e.pricingSnapshot?.total?(0,a.formatMoney)(e.pricingSnapshot.total):null},
      ${h}, ${_.bookedFor}, ${_.booker?.name||null},
      ${_.booker?.email||null}, ${_.booker?.phone||null},
      ${_.relation||null}, ${_.notifyBooker}, ${e.agentReference||null}
    )
    RETURNING *
  `)[0];return await u`
    INSERT INTO booking_status_history (booking_id, from_status, to_status, note, changed_by)
    VALUES (
      ${S.id}, NULL, ${h},
      ${e.createdNote||"Request submitted"}, ${e.createdBy||"system"}
    )
  `,S}async function l(e){let n=(0,t.getSql)();return(await n`SELECT * FROM bookings WHERE id = ${e} LIMIT 1`)[0]??null}async function u(e){let t=await l(e);if(!t)return null;let[n,a,r]=await Promise.all([h(e),m(e),w(e)]);return{...t,history:n,documents:a,notifications:r}}async function d(e){let n=(0,t.getSql)();return await n`
    SELECT * FROM bookings WHERE user_id = ${e} ORDER BY created_at DESC
  `}async function c(e){let n=(0,t.getSql)();return await n`
    SELECT * FROM bookings
    WHERE agent_id = ${e} OR agent_id IS NULL
    ORDER BY created_at DESC
  `}async function p(){let e=(0,t.getSql)();return await e`SELECT * FROM bookings ORDER BY created_at DESC`}async function g(e,a,r,i){let s=(0,t.getSql)(),u=await l(e);if(!u)return null;if(u.departure_id&&"confirmed"===a&&"confirmed"!==u.status){if(!await (0,n.decrementSeats)(u.departure_id,u.travellers_count||1))throw new o}else u.departure_id&&"confirmed"===u.status&&("cancelled"===a||"rejected"===a)&&await (0,n.restoreSeats)(u.departure_id,u.travellers_count||1);let d=await s`
    UPDATE bookings SET status = ${a}, updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `;return await s`
    INSERT INTO booking_status_history (booking_id, from_status, to_status, note, changed_by)
    VALUES (${e}, ${u.status}, ${a}, ${i||null}, ${r})
  `,d[0]??null}async function E(e,n,a){let r=(0,t.getSql)(),i=await r`
    UPDATE bookings SET price_amount = ${n}, updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `;return i[0]?(await g(e,"quoted",a,`Price set to ${n}`),l(e)):i[0]??null}async function R(e,n,a){let r=(0,t.getSql)(),i=await r`
    UPDATE bookings SET payment_status = ${n}, updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `;return i[0]&&"received"===n?(await g(e,"confirmed",a,"Payment received"),l(e)):i[0]??null}async function f(e,n,a){let r=(0,t.getSql)(),i=await r`
    UPDATE bookings SET agent_id = ${n}, updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `;return i[0]&&"new"===i[0].status?(await g(e,"reviewing",a,"Assigned to agent"),l(e)):i[0]??null}async function _(e,n){let a=(0,t.getSql)();return(await a`
    UPDATE bookings SET internal_remarks = ${n}, updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `)[0]??null}async function h(e){let n=(0,t.getSql)();return await n`
    SELECT * FROM booking_status_history WHERE booking_id = ${e} ORDER BY created_at ASC
  `}async function S(e,n,a,r){let i=(0,t.getSql)();return(await i`
    INSERT INTO booking_documents (booking_id, doc_type, url, uploaded_by)
    VALUES (${e}, ${n}, ${a}, ${r})
    RETURNING *
  `)[0]}async function m(e){let n=(0,t.getSql)();return await n`
    SELECT * FROM booking_documents WHERE booking_id = ${e} ORDER BY created_at DESC
  `}async function $(e,n,a){let r=(0,t.getSql)();return(await r`
    INSERT INTO booking_notifications (booking_id, channel, message)
    VALUES (${e}, ${n}, ${a})
    RETURNING *
  `)[0]}async function w(e){let n=(0,t.getSql)();return await n`
    SELECT * FROM booking_notifications WHERE booking_id = ${e} ORDER BY created_at DESC
  `}async function y(e){let n=(0,t.getSql)();return(await n`
    UPDATE bookings
    SET brochure_sent_at = now(), quotation_status = 'sent', updated_at = now()
    WHERE id = ${e}
    RETURNING *
  `)[0]??null}e.s(["SoldOutError",0,o,"addDocument",0,S,"addNotification",0,$,"assignAgent",0,f,"createBooking",0,s,"getBookingById",0,l,"getBookingDetail",0,u,"listAll",0,p,"listForAgent",0,c,"listForUser",0,d,"markBrochureSent",0,y,"setPaymentStatus",0,R,"setPricing",0,E,"setRemarks",0,_,"updateStatus",0,g])},91180,e=>{"use strict";var t=e.i(66680),n=e.i(82037);let a="bandhan_user_session",r=process.env.AUTH_SECRET||"bandhan-user-auth-dev-secret";function i(e){return t.default.createHmac("sha256",r).update(e).digest("hex")}async function o(){let e=await (0,n.cookies)();return function(e){if(!e)return null;let n=e.lastIndexOf(".");if(n<=0)return null;let a=e.slice(0,n),r=e.slice(n+1),o=i(a),s=Buffer.from(r),l=Buffer.from(o);return s.length!==l.length?null:t.default.timingSafeEqual(s,l)?a:null}(e.get(a)?.value)}e.s(["USER_COOKIE",0,a,"getSessionUserId",0,o,"sessionCookieOptions",0,function(){return{httpOnly:!0,sameSite:"lax",path:"/",maxAge:2592e3,secure:!0}},"signSession",0,function(e){return`${e}.${i(e)}`}])},44752,e=>{"use strict";var t=e.i(57881),n=e.i(42355),a=e.i(27744),r=e.i(27098),i=e.i(12444),o=e.i(38333),s=e.i(498),l=e.i(43068),u=e.i(18480),d=e.i(58604),c=e.i(71547),p=e.i(95196),g=e.i(35439),E=e.i(7777),R=e.i(58831),f=e.i(93695);e.i(50386);var _=e.i(27031),h=e.i(73763),S=e.i(43793),m=e.i(91180),$=e.i(61745);async function w(){if(!(0,S.isDbConfigured)())return h.NextResponse.json({bookings:[]});let e=await (0,m.getSessionUserId)();if(!e)return h.NextResponse.json({ok:!1,error:"Not signed in."},{status:401});try{let t=await (0,$.listForUser)(e);return h.NextResponse.json({ok:!0,bookings:t})}catch(e){return console.error("list my bookings error:",e),h.NextResponse.json({ok:!1,error:"Could not load your bookings."},{status:500})}}e.s(["GET",0,w],98069);var y=e.i(98069);let b=new t.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/bookings/mine/route",pathname:"/api/bookings/mine",filename:"route",bundlePath:""},distDir:".next-preview",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/bookings/mine/route.ts",nextConfigOutput:"",userland:y,...{}}),{workAsyncStorage:T,workUnitAsyncStorage:k,serverHooks:v}=b;async function N(e,t,a){a.requestMeta&&(0,r.setRequestMeta)(e,a.requestMeta),b.isDev&&(0,r.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let h="/api/bookings/mine/route";h=h.replace(/\/index$/,"")||"/";let S=await b.prepare(e,t,{srcPage:h,multiZoneDraftMode:!1});if(!S)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:m,deploymentId:$,params:w,nextConfig:y,parsedUrl:T,isDraftMode:k,prerenderManifest:v,routerServerContext:N,isOnDemandRevalidate:x,revalidateOnlyGenerated:C,resolvedPathname:A,clientReferenceManifest:I,serverActionsManifest:O}=S,q=(0,s.normalizeAppPath)(h),D=!!(v.dynamicRoutes[q]||v.routes[A]),U=async()=>((null==N?void 0:N.render404)?await N.render404(e,t,T,!1):t.end("This page could not be found"),null);if(D&&!k){let e=!!v.routes[A],t=v.dynamicRoutes[q];if(t&&!1===t.fallback&&!e){if(y.adapterPath)return await U();throw new f.NoFallbackError}}let H=null;!D||b.isDev||k||(H="/index"===(H=A)?"/":H);let P=!0===b.isDev||!D,L=D&&!P;O&&I&&(0,o.setManifestsSingleton)({page:h,clientReferenceManifest:I,serverActionsManifest:O});let M=e.method||"GET",B=(0,i.getTracer)(),W=B.getActiveScopeSpan(),F=!!(null==N?void 0:N.isWrappedByNextServer),j=!!(0,r.getRequestMeta)(e,"minimalMode"),G=(0,r.getRequestMeta)(e,"incrementalCache")||await b.getIncrementalCache(e,y,v,j);null==G||G.resetRequestCache(),globalThis.__incrementalCache=G;let K={params:w,previewProps:v.preview,renderOpts:{experimental:{authInterrupts:!!y.experimental.authInterrupts},cacheComponents:!!y.cacheComponents,supportsDynamicResponse:P,incrementalCache:G,cacheLifeProfiles:y.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,n,a,r)=>b.onRequestError(e,t,a,r,N)},sharedContext:{buildId:m,deploymentId:$}},V=new l.NodeNextRequest(e),Y=new l.NodeNextResponse(t),J=u.NextRequestAdapter.fromNodeNextRequest(V,(0,u.signalFromNodeResponse)(t));try{let r,o=async e=>b.handle(J,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let n=B.getRootSpanAttributes();if(!n)return;if(n.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${n.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=n.get("next.route");if(a){let t=`${M} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",a),r.updateName(t))}else e.updateName(`${M} ${h}`)}),s=async r=>{var i,s;let l=async({previousCacheEntry:n})=>{try{if(!j&&x&&C&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await o(r);e.fetchMetrics=K.renderOpts.fetchMetrics;let s=K.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let l=K.renderOpts.collectedTags;if(!D)return await (0,p.sendResponse)(V,Y,i,K.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,g.toNodeOutgoingHttpHeaders)(i.headers);l&&(t[R.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let n=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=R.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,a=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=R.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:_.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:n,expire:a}}}}catch(t){throw(null==n?void 0:n.isStale)&&await b.onRequestError(e,t,{routerKind:"App Router",routePath:h,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:L,isOnDemandRevalidate:x})},!1,N),t}},u=await b.handleResponse({req:e,nextConfig:y,cacheKey:H,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:v,isRoutePPREnabled:!1,isOnDemandRevalidate:x,revalidateOnlyGenerated:C,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:j});if(!D)return null;if((null==u||null==(i=u.value)?void 0:i.kind)!==_.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(s=u.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});j||t.setHeader("x-nextjs-cache",x?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),k&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,g.fromNodeOutgoingHttpHeaders)(u.value.headers);return j&&D||d.delete(R.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,E.getCacheControlHeader)(u.cacheControl)),await (0,p.sendResponse)(V,Y,new Response(u.value.body,{headers:d,status:u.value.status||200})),null};F&&W?await s(W):(r=B.getActiveScopeSpan(),await B.withPropagatedContext(e.headers,()=>B.trace(d.BaseServerSpan.handleRequest,{spanName:`${M} ${h}`,kind:i.SpanKind.SERVER,attributes:{"http.method":M,"http.target":e.url}},s),void 0,!F))}catch(t){if(t instanceof f.NoFallbackError||await b.onRequestError(e,t,{routerKind:"App Router",routePath:q,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:L,isOnDemandRevalidate:x})},!1,N),D)throw t;return await (0,p.sendResponse)(V,Y,new Response(null,{status:500})),null}}e.s(["handler",0,N,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:T,workUnitAsyncStorage:k})},"routeModule",0,b,"serverHooks",0,v,"workAsyncStorage",0,T,"workUnitAsyncStorage",0,k],44752)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0dlnf9-._.js.map