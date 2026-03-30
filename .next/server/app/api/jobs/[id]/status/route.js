"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/jobs/[id]/status/route";
exports.ids = ["app/api/jobs/[id]/status/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fjobs%2F%5Bid%5D%2Fstatus%2Froute&page=%2Fapi%2Fjobs%2F%5Bid%5D%2Fstatus%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fjobs%2F%5Bid%5D%2Fstatus%2Froute.ts&appDir=%2FUsers%2Fyashasvitripathi%2FDownloads%2FCVPiolet-fixed%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fyashasvitripathi%2FDownloads%2FCVPiolet-fixed&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fjobs%2F%5Bid%5D%2Fstatus%2Froute&page=%2Fapi%2Fjobs%2F%5Bid%5D%2Fstatus%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fjobs%2F%5Bid%5D%2Fstatus%2Froute.ts&appDir=%2FUsers%2Fyashasvitripathi%2FDownloads%2FCVPiolet-fixed%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fyashasvitripathi%2FDownloads%2FCVPiolet-fixed&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_yashasvitripathi_Downloads_CVPiolet_fixed_src_app_api_jobs_id_status_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/jobs/[id]/status/route.ts */ \"(rsc)/./src/app/api/jobs/[id]/status/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/jobs/[id]/status/route\",\n        pathname: \"/api/jobs/[id]/status\",\n        filename: \"route\",\n        bundlePath: \"app/api/jobs/[id]/status/route\"\n    },\n    resolvedPagePath: \"/Users/yashasvitripathi/Downloads/CVPiolet-fixed/src/app/api/jobs/[id]/status/route.ts\",\n    nextConfigOutput,\n    userland: _Users_yashasvitripathi_Downloads_CVPiolet_fixed_src_app_api_jobs_id_status_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/jobs/[id]/status/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZqb2JzJTJGJTVCaWQlNUQlMkZzdGF0dXMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmpvYnMlMkYlNUJpZCU1RCUyRnN0YXR1cyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmpvYnMlMkYlNUJpZCU1RCUyRnN0YXR1cyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRnlhc2hhc3ZpdHJpcGF0aGklMkZEb3dubG9hZHMlMkZDVlBpb2xldC1maXhlZCUyRnNyYyUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZ5YXNoYXN2aXRyaXBhdGhpJTJGRG93bmxvYWRzJTJGQ1ZQaW9sZXQtZml4ZWQmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQ3NDO0FBQ25IO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmVzdW1haS8/OWM5ZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMveWFzaGFzdml0cmlwYXRoaS9Eb3dubG9hZHMvQ1ZQaW9sZXQtZml4ZWQvc3JjL2FwcC9hcGkvam9icy9baWRdL3N0YXR1cy9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvam9icy9baWRdL3N0YXR1cy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2pvYnMvW2lkXS9zdGF0dXNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2pvYnMvW2lkXS9zdGF0dXMvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMveWFzaGFzdml0cmlwYXRoaS9Eb3dubG9hZHMvQ1ZQaW9sZXQtZml4ZWQvc3JjL2FwcC9hcGkvam9icy9baWRdL3N0YXR1cy9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvam9icy9baWRdL3N0YXR1cy9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fjobs%2F%5Bid%5D%2Fstatus%2Froute&page=%2Fapi%2Fjobs%2F%5Bid%5D%2Fstatus%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fjobs%2F%5Bid%5D%2Fstatus%2Froute.ts&appDir=%2FUsers%2Fyashasvitripathi%2FDownloads%2FCVPiolet-fixed%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fyashasvitripathi%2FDownloads%2FCVPiolet-fixed&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/jobs/[id]/status/route.ts":
/*!***********************************************!*\
  !*** ./src/app/api/jobs/[id]/status/route.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var _clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @clerk/nextjs/server */ \"(rsc)/./node_modules/@clerk/nextjs/dist/esm/app-router/server/auth.js\");\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./src/lib/db/index.ts\");\n// src/app/api/jobs/[id]/status/route.ts\n\n\n\nasync function GET(req, { params }) {\n    const { userId: clerkId } = await (0,_clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_2__.auth)();\n    if (!clerkId) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Unauthorized\"\n    }, {\n        status: 401\n    });\n    const user = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.user.findUnique({\n        where: {\n            clerkId\n        }\n    });\n    if (!user) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"User not found\"\n    }, {\n        status: 404\n    });\n    const job = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.jobApplication.findFirst({\n        where: {\n            id: params.id,\n            userId: user.id\n        },\n        include: {\n            resumes: {\n                orderBy: {\n                    overallScore: \"desc\"\n                },\n                select: {\n                    id: true,\n                    variantNumber: true,\n                    title: true,\n                    atsScore: true,\n                    relevanceScore: true,\n                    clarityScore: true,\n                    impactScore: true,\n                    overallScore: true,\n                    scoreBreakdown: true,\n                    status: true,\n                    pdfUrl: true,\n                    docxUrl: true,\n                    createdAt: true\n                }\n            }\n        }\n    });\n    if (!job) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Job not found\"\n    }, {\n        status: 404\n    });\n    // Debug logs\n    console.log(`api/jobs/${params.id}/status: job.status=${job.status}, resumes.count=${job.resumes.length}`);\n    // Check for queue jobs\n    const queueJobs = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.queueJob.findMany({\n        where: {\n            type: \"GENERATE_RESUMES\"\n        },\n        select: {\n            id: true,\n            status: true,\n            attempts: true,\n            error: true,\n            createdAt: true\n        },\n        orderBy: {\n            createdAt: \"desc\"\n        },\n        take: 5\n    });\n    console.log(`api/jobs/${params.id}/status: recent GENERATE_RESUMES queue jobs`, queueJobs);\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        id: job.id,\n        status: job.status,\n        company: job.company,\n        jobTitle: job.jobTitle,\n        jobLevel: job.jobLevel,\n        parsedJD: job.parsedJD,\n        resumes: job.resumes,\n        createdAt: job.createdAt\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9qb2JzL1tpZF0vc3RhdHVzL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSx3Q0FBd0M7QUFDSTtBQUNZO0FBQ3RCO0FBRTNCLGVBQWVHLElBQUlDLEdBQWdCLEVBQUUsRUFBRUMsTUFBTSxFQUE4QjtJQUNoRixNQUFNLEVBQUVDLFFBQVFDLE9BQU8sRUFBRSxHQUFHLE1BQU1QLDBEQUFJQTtJQUN0QyxJQUFJLENBQUNPLFNBQVMsT0FBT04scURBQVlBLENBQUNPLElBQUksQ0FBQztRQUFFQyxPQUFPO0lBQWUsR0FBRztRQUFFQyxRQUFRO0lBQUk7SUFFaEYsTUFBTUMsT0FBTyxNQUFNVCwyQ0FBTUEsQ0FBQ1MsSUFBSSxDQUFDQyxVQUFVLENBQUM7UUFBRUMsT0FBTztZQUFFTjtRQUFRO0lBQUU7SUFDL0QsSUFBSSxDQUFDSSxNQUFNLE9BQU9WLHFEQUFZQSxDQUFDTyxJQUFJLENBQUM7UUFBRUMsT0FBTztJQUFpQixHQUFHO1FBQUVDLFFBQVE7SUFBSTtJQUUvRSxNQUFNSSxNQUFNLE1BQU1aLDJDQUFNQSxDQUFDYSxjQUFjLENBQUNDLFNBQVMsQ0FBQztRQUNoREgsT0FBTztZQUFFSSxJQUFJWixPQUFPWSxFQUFFO1lBQUVYLFFBQVFLLEtBQUtNLEVBQUU7UUFBQztRQUN4Q0MsU0FBUztZQUNQQyxTQUFTO2dCQUNQQyxTQUFTO29CQUFFQyxjQUFjO2dCQUFPO2dCQUNoQ0MsUUFBUTtvQkFDTkwsSUFBSTtvQkFDSk0sZUFBZTtvQkFDZkMsT0FBTztvQkFDUEMsVUFBVTtvQkFDVkMsZ0JBQWdCO29CQUNoQkMsY0FBYztvQkFDZEMsYUFBYTtvQkFDYlAsY0FBYztvQkFDZFEsZ0JBQWdCO29CQUNoQm5CLFFBQVE7b0JBQ1JvQixRQUFRO29CQUNSQyxTQUFTO29CQUNUQyxXQUFXO2dCQUNiO1lBQ0Y7UUFDRjtJQUNGO0lBRUEsSUFBSSxDQUFDbEIsS0FBSyxPQUFPYixxREFBWUEsQ0FBQ08sSUFBSSxDQUFDO1FBQUVDLE9BQU87SUFBZ0IsR0FBRztRQUFFQyxRQUFRO0lBQUk7SUFFN0UsYUFBYTtJQUNidUIsUUFBUUMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFN0IsT0FBT1ksRUFBRSxDQUFDLG9CQUFvQixFQUFFSCxJQUFJSixNQUFNLENBQUMsZ0JBQWdCLEVBQUVJLElBQUlLLE9BQU8sQ0FBQ2dCLE1BQU0sQ0FBQyxDQUFDO0lBRXpHLHVCQUF1QjtJQUN2QixNQUFNQyxZQUFZLE1BQU1sQywyQ0FBTUEsQ0FBQ21DLFFBQVEsQ0FBQ0MsUUFBUSxDQUFDO1FBQy9DekIsT0FBTztZQUFFMEIsTUFBTTtRQUFtQjtRQUNsQ2pCLFFBQVE7WUFBRUwsSUFBSTtZQUFNUCxRQUFRO1lBQU04QixVQUFVO1lBQU0vQixPQUFPO1lBQU11QixXQUFXO1FBQUs7UUFDL0VaLFNBQVM7WUFBRVksV0FBVztRQUFPO1FBQzdCUyxNQUFNO0lBQ1I7SUFDQVIsUUFBUUMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFN0IsT0FBT1ksRUFBRSxDQUFDLDJDQUEyQyxDQUFDLEVBQUVtQjtJQUVoRixPQUFPbkMscURBQVlBLENBQUNPLElBQUksQ0FBQztRQUN2QlMsSUFBSUgsSUFBSUcsRUFBRTtRQUNWUCxRQUFRSSxJQUFJSixNQUFNO1FBQ2xCZ0MsU0FBUzVCLElBQUk0QixPQUFPO1FBQ3BCQyxVQUFVN0IsSUFBSTZCLFFBQVE7UUFDdEJDLFVBQVU5QixJQUFJOEIsUUFBUTtRQUN0QkMsVUFBVS9CLElBQUkrQixRQUFRO1FBQ3RCMUIsU0FBU0wsSUFBSUssT0FBTztRQUNwQmEsV0FBV2xCLElBQUlrQixTQUFTO0lBQzFCO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZXN1bWFpLy4vc3JjL2FwcC9hcGkvam9icy9baWRdL3N0YXR1cy9yb3V0ZS50cz9mYTQwIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHNyYy9hcHAvYXBpL2pvYnMvW2lkXS9zdGF0dXMvcm91dGUudHNcbmltcG9ydCB7IGF1dGggfSBmcm9tIFwiQGNsZXJrL25leHRqcy9zZXJ2ZXJcIjtcbmltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gXCJAL2xpYi9kYlwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcTogTmV4dFJlcXVlc3QsIHsgcGFyYW1zIH06IHsgcGFyYW1zOiB7IGlkOiBzdHJpbmcgfSB9KSB7XG4gIGNvbnN0IHsgdXNlcklkOiBjbGVya0lkIH0gPSBhd2FpdCBhdXRoKCk7XG4gIGlmICghY2xlcmtJZCkgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiVW5hdXRob3JpemVkXCIgfSwgeyBzdGF0dXM6IDQwMSB9KTtcblxuICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGNsZXJrSWQgfSB9KTtcbiAgaWYgKCF1c2VyKSByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJVc2VyIG5vdCBmb3VuZFwiIH0sIHsgc3RhdHVzOiA0MDQgfSk7XG5cbiAgY29uc3Qgam9iID0gYXdhaXQgcHJpc21hLmpvYkFwcGxpY2F0aW9uLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IHBhcmFtcy5pZCwgdXNlcklkOiB1c2VyLmlkIH0sXG4gICAgaW5jbHVkZToge1xuICAgICAgcmVzdW1lczoge1xuICAgICAgICBvcmRlckJ5OiB7IG92ZXJhbGxTY29yZTogXCJkZXNjXCIgfSxcbiAgICAgICAgc2VsZWN0OiB7XG4gICAgICAgICAgaWQ6IHRydWUsXG4gICAgICAgICAgdmFyaWFudE51bWJlcjogdHJ1ZSxcbiAgICAgICAgICB0aXRsZTogdHJ1ZSxcbiAgICAgICAgICBhdHNTY29yZTogdHJ1ZSxcbiAgICAgICAgICByZWxldmFuY2VTY29yZTogdHJ1ZSxcbiAgICAgICAgICBjbGFyaXR5U2NvcmU6IHRydWUsXG4gICAgICAgICAgaW1wYWN0U2NvcmU6IHRydWUsXG4gICAgICAgICAgb3ZlcmFsbFNjb3JlOiB0cnVlLFxuICAgICAgICAgIHNjb3JlQnJlYWtkb3duOiB0cnVlLFxuICAgICAgICAgIHN0YXR1czogdHJ1ZSxcbiAgICAgICAgICBwZGZVcmw6IHRydWUsXG4gICAgICAgICAgZG9jeFVybDogdHJ1ZSxcbiAgICAgICAgICBjcmVhdGVkQXQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xuXG4gIGlmICgham9iKSByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJKb2Igbm90IGZvdW5kXCIgfSwgeyBzdGF0dXM6IDQwNCB9KTtcblxuICAvLyBEZWJ1ZyBsb2dzXG4gIGNvbnNvbGUubG9nKGBhcGkvam9icy8ke3BhcmFtcy5pZH0vc3RhdHVzOiBqb2Iuc3RhdHVzPSR7am9iLnN0YXR1c30sIHJlc3VtZXMuY291bnQ9JHtqb2IucmVzdW1lcy5sZW5ndGh9YCk7XG5cbiAgLy8gQ2hlY2sgZm9yIHF1ZXVlIGpvYnNcbiAgY29uc3QgcXVldWVKb2JzID0gYXdhaXQgcHJpc21hLnF1ZXVlSm9iLmZpbmRNYW55KHtcbiAgICB3aGVyZTogeyB0eXBlOiBcIkdFTkVSQVRFX1JFU1VNRVNcIiB9LFxuICAgIHNlbGVjdDogeyBpZDogdHJ1ZSwgc3RhdHVzOiB0cnVlLCBhdHRlbXB0czogdHJ1ZSwgZXJyb3I6IHRydWUsIGNyZWF0ZWRBdDogdHJ1ZSB9LFxuICAgIG9yZGVyQnk6IHsgY3JlYXRlZEF0OiBcImRlc2NcIiB9LFxuICAgIHRha2U6IDUsXG4gIH0pO1xuICBjb25zb2xlLmxvZyhgYXBpL2pvYnMvJHtwYXJhbXMuaWR9L3N0YXR1czogcmVjZW50IEdFTkVSQVRFX1JFU1VNRVMgcXVldWUgam9ic2AsIHF1ZXVlSm9icyk7XG5cbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICBpZDogam9iLmlkLFxuICAgIHN0YXR1czogam9iLnN0YXR1cyxcbiAgICBjb21wYW55OiBqb2IuY29tcGFueSxcbiAgICBqb2JUaXRsZTogam9iLmpvYlRpdGxlLFxuICAgIGpvYkxldmVsOiBqb2Iuam9iTGV2ZWwsXG4gICAgcGFyc2VkSkQ6IGpvYi5wYXJzZWRKRCxcbiAgICByZXN1bWVzOiBqb2IucmVzdW1lcyxcbiAgICBjcmVhdGVkQXQ6IGpvYi5jcmVhdGVkQXQsXG4gIH0pO1xufVxuIl0sIm5hbWVzIjpbImF1dGgiLCJOZXh0UmVzcG9uc2UiLCJwcmlzbWEiLCJHRVQiLCJyZXEiLCJwYXJhbXMiLCJ1c2VySWQiLCJjbGVya0lkIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImpvYiIsImpvYkFwcGxpY2F0aW9uIiwiZmluZEZpcnN0IiwiaWQiLCJpbmNsdWRlIiwicmVzdW1lcyIsIm9yZGVyQnkiLCJvdmVyYWxsU2NvcmUiLCJzZWxlY3QiLCJ2YXJpYW50TnVtYmVyIiwidGl0bGUiLCJhdHNTY29yZSIsInJlbGV2YW5jZVNjb3JlIiwiY2xhcml0eVNjb3JlIiwiaW1wYWN0U2NvcmUiLCJzY29yZUJyZWFrZG93biIsInBkZlVybCIsImRvY3hVcmwiLCJjcmVhdGVkQXQiLCJjb25zb2xlIiwibG9nIiwibGVuZ3RoIiwicXVldWVKb2JzIiwicXVldWVKb2IiLCJmaW5kTWFueSIsInR5cGUiLCJhdHRlbXB0cyIsInRha2UiLCJjb21wYW55Iiwiam9iVGl0bGUiLCJqb2JMZXZlbCIsInBhcnNlZEpEIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/jobs/[id]/status/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/db/index.ts":
/*!*****************************!*\
  !*** ./src/lib/db/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n// src/lib/db/index.ts\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log:  true ? [\n        \"query\",\n        \"error\",\n        \"warn\"\n    ] : 0\n});\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2RiL2luZGV4LnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNCQUFzQjtBQUN3QjtBQUU5QyxNQUFNQyxrQkFBa0JDO0FBRWpCLE1BQU1DLFNBQ1hGLGdCQUFnQkUsTUFBTSxJQUN0QixJQUFJSCx3REFBWUEsQ0FBQztJQUNmSSxLQUFLQyxLQUFzQyxHQUFHO1FBQUM7UUFBUztRQUFTO0tBQU8sR0FBRyxDQUFTO0FBQ3RGLEdBQUc7QUFFTCxJQUFJQSxJQUFxQyxFQUFFSixnQkFBZ0JFLE1BQU0sR0FBR0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZXN1bWFpLy4vc3JjL2xpYi9kYi9pbmRleC50cz81OGQ4Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIHNyYy9saWIvZGIvaW5kZXgudHNcbmltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiO1xuXG5jb25zdCBnbG9iYWxGb3JQcmlzbWEgPSBnbG9iYWxUaGlzIGFzIHVua25vd24gYXMgeyBwcmlzbWE6IFByaXNtYUNsaWVudCB9O1xuXG5leHBvcnQgY29uc3QgcHJpc21hID1cbiAgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSB8fFxuICBuZXcgUHJpc21hQ2xpZW50KHtcbiAgICBsb2c6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcImRldmVsb3BtZW50XCIgPyBbXCJxdWVyeVwiLCBcImVycm9yXCIsIFwid2FyblwiXSA6IFtcImVycm9yXCJdLFxuICB9KTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA9IHByaXNtYTtcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJnbG9iYWxGb3JQcmlzbWEiLCJnbG9iYWxUaGlzIiwicHJpc21hIiwibG9nIiwicHJvY2VzcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/db/index.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@clerk","vendor-chunks/@opentelemetry","vendor-chunks/crypto-js","vendor-chunks/tslib","vendor-chunks/cookie","vendor-chunks/map-obj","vendor-chunks/no-case","vendor-chunks/lower-case","vendor-chunks/snakecase-keys","vendor-chunks/snake-case","vendor-chunks/dot-case"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fjobs%2F%5Bid%5D%2Fstatus%2Froute&page=%2Fapi%2Fjobs%2F%5Bid%5D%2Fstatus%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fjobs%2F%5Bid%5D%2Fstatus%2Froute.ts&appDir=%2FUsers%2Fyashasvitripathi%2FDownloads%2FCVPiolet-fixed%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fyashasvitripathi%2FDownloads%2FCVPiolet-fixed&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();