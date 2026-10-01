function u(t,r,e){return t.includes(r)?t.filter(n=>n!==r):t.length>=e-1?t:[...t,r]}function l(t,r){const e=t.filter(n=>r.includes(n));return e.length===t.length?t:e}export{l as p,u as t};
