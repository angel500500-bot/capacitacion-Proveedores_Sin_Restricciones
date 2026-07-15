/* Wrapper SCORM 1.2 — reporta progreso, nombre y finalización al LMS (Chamilo).
   Si no hay LMS (abriendo el HTML directo), funciona en modo sin conexión. */
(function (global) {
  "use strict";
  var api = null, connected = false;
  function findAPI(win){var t=0;while(win.API==null&&win.parent!=null&&win.parent!=win){t++;if(t>500)return null;win=win.parent;}return win.API;}
  function getAPI(){if(api)return api;var f=findAPI(window);if(!f&&window.opener)f=findAPI(window.opener);api=f;return api;}
  var SCORM = {
    init:function(){var a=getAPI();if(!a)return false;try{connected=a.LMSInitialize("")==="true";if(connected){var s=a.LMSGetValue("cmi.core.lesson_status");if(!s||s==="not attempted"||s==="unknown"){a.LMSSetValue("cmi.core.lesson_status","incomplete");}a.LMSCommit("");}}catch(e){connected=false;}return connected;},
    studentName:function(){if(!connected)return "";try{var n=api.LMSGetValue("cmi.core.student_name")||"";if(n.indexOf(",")>-1){var p=n.split(",");n=(p[1]+" "+p[0]).trim();}return n;}catch(e){return "";}},
    setProgress:function(p){if(!connected)return;try{api.LMSSetValue("cmi.core.score.raw",String(Math.round(p)));api.LMSSetValue("cmi.suspend_data","progress="+Math.round(p));api.LMSCommit("");}catch(e){}},
    complete:function(){if(!connected)return;try{api.LMSSetValue("cmi.core.lesson_status","completed");api.LMSSetValue("cmi.core.score.raw","100");api.LMSCommit("");}catch(e){}},
    finish:function(){if(!connected)return;try{api.LMSFinish("");}catch(e){}connected=false;},
    isConnected:function(){return connected;}
  };
  global.SCORM = SCORM;
  window.addEventListener("load",function(){SCORM.init();});
  window.addEventListener("beforeunload",function(){SCORM.finish();});
})(window);
