export const detectBrowserInfo = () => {
  const ua = navigator.userAgent;
  const platform = navigator.platform || "";

  let browser = "Unknown";
  if (/Edg\//.test(ua))                         browser = "Microsoft Edge";
  else if (/OPR\/|Opera/.test(ua))              browser = "Opera";
  else if (/Firefox\//.test(ua))                browser = "Firefox";
  else if (/Chrome\//.test(ua))                 browser = "Chrome";
  else if (/Safari\//.test(ua))                 browser = "Safari";
  else if (/Trident\/|MSIE/.test(ua))           browser = "Internet Explorer";

  let os = "Unknown";
  if (/Android/.test(ua))                       os = "Android";
  else if (/iPhone|iPad|iPod/.test(ua))         os = "iOS";
  else if (/Windows NT 10/.test(ua))            os = "Windows 10/11";
  else if (/Windows NT 6\.3/.test(ua))          os = "Windows 8.1";
  else if (/Windows NT 6\.1/.test(ua))          os = "Windows 7";
  else if (/Windows/.test(ua))                  os = "Windows";
  else if (/Mac OS X/.test(ua))                 os = "macOS";
  else if (/Linux/.test(platform))              os = "Linux";
  else if (/CrOS/.test(ua))                     os = "ChromeOS";

  const isMobile = /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/.test(ua);
  const isTablet = /iPad/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua));
  let device = "Desktop";
  if (isMobile)       device = "Mobile";
  else if (isTablet)  device = "Tablet";

  const isChrome  = /Chrome\//.test(ua) && !/Edg\//.test(ua) && !/OPR\//.test(ua);
  const isEdge    = /Edg\//.test(ua);

  return { browser, os, device, isChrome, isEdge, isMobile: isMobile || isTablet };
};

export const isMobileAccessAllowed = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istOffset = 5.5 * 60 * 60000;
  const ist = new Date(utc + istOffset);

  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  const start = 10 * 60;      // 10:00 AM
  const end   = 13 * 60;      // 1:00 PM

  return totalMinutes >= start && totalMinutes < end;
};

export const getISTTimeString = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 5.5 * 60 * 60000);
  return ist.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
};