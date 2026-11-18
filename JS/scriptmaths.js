const $=id=>document.getElementById(id),R=Math,PI=R.PI,
f=n=>isFinite(n)?+(+n).toFixed(3):'undefined',
rad=d=>d*PI/180,
deg=r=>r*180/PI,
h=(t,b)=>`<p><b>${t}:</b> ${b}</p>`;

const C=$('c'),X=C.getContext('2d');

let W,H,
cam={y:.5,p:.35,z:1},
v={},cur=0,last='',drag=0;

function rs(){
    const r=C.getBoundingClientRect(),
           d=devicePixelRatio||1;

    C.width=r.width*d;
    C.height=r.height*d;

    X.setTransform(d,0,0,d,0,0);

    W=r.width;
    H=r.height;
}

new ResizeObserver(rs).observe(C);

/* ---------- tiny 3D engine (orthographic, offline) ---------- */

const sc=()=>R.min(W,H)/12*cam.z;

function P(q){
    const cy=R.cos(cam.y),
          sy=R.sin(cam.y),
          cp=R.cos(cam.p),
          sp=R.sin(cam.p),
          x1=q[0]*cy+q[2]*sy,
          z1=-q[0]*sy+q[2]*cy,
          s=sc();

    return[
        W/2+x1*s,
        H/2-(q[1]*cp-z1*sp)*s,
        q[1]*sp+z1*cp
    ];
}

function U(sx,sy){
    const s=sc(),
          x1=(sx-W/2)/s,
          y1=-(sy-H/2)/s,
          cy=R.cos(cam.y),
          c=R.abs(cy)<.15?.15:cy,
          x=x1/c;

    return[
        x,
        (y1-x*R.sin(cam.y)*R.sin(cam.p))/R.cos(cam.p)
    ];
}

const L=(a,b,c='#fff',w=2)=>{
    a=P(a);
    b=P(b);

    X.strokeStyle=c;
    X.lineWidth=w;
    X.beginPath();
    X.moveTo(a[0],a[1]);
    X.lineTo(b[0],b[1]);
    X.stroke();
};

const PL=(pts,c,w=3)=>{
    X.strokeStyle=c;
    X.lineWidth=w;
    X.beginPath();

    pts.forEach((q,i)=>{
        q=P(q);
        i ? X.lineTo(q[0],q[1]) : X.moveTo(q[0],q[1]);
    });

    X.stroke();
};

const F=(pts,fill,st)=>{
    X.beginPath();

    pts.forEach((q,i)=>{
        q=P(q);
        i ? X.lineTo(q[0],q[1]) : X.moveTo(q[0],q[1]);
    });

    X.closePath();

    if(fill){
        X.fillStyle=fill;
        X.fill();
    }

    if(st){
        X.strokeStyle=st;
        X.lineWidth=1.5;
        X.stroke();
    }
};

const D=(p,r,c)=>{
    p=P(p);

    const g=X.createRadialGradient(
        p[0]-r/3,
        p[1]-r/3,
        r/6,
        p[0],
        p[1],
        r
    );

    g.addColorStop(0,'#fff');
    g.addColorStop(1,c);

    X.fillStyle=g;
    X.beginPath();
    X.arc(p[0],p[1],r,0,7);
    X.fill();
};

const TX=(p,s,c='#fff',n=14)=>{
    p=P(p);

    X.fillStyle=c;
    X.font=n+'px sans-serif';
    X.fillText(s,p[0]+5,p[1]-5);
};