import json
data=json.load(open("/tmp/projects.json",encoding="utf-8"))
projects=data["projects"]; built=data["built"]

TEMPLATE = r"""<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>СК «Династия» — дома под ключ · проекты</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;500;600;700&family=Onest:wght@400;500;600&display=swap" rel="stylesheet" />
<style>
:root{
  --bg:#14213a;--bg2:#0f1a30;--panel:#1b2c4a;--panel2:#223a60;
  --cream:#f3efe6;--cream2:#c3cad8;--soft:#8b93a6;--faint:#646d83;
  --line:rgba(243,239,230,.14);--line2:rgba(243,239,230,.28);
  --brass:#c2a05a;--brass-l:#dab974;--brass-d:#a8863f;
  --disp:'Unbounded',system-ui,sans-serif;--body:'Onest',system-ui,sans-serif;
  --ease:cubic-bezier(.19,1,.22,1);
}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%}
body{background:var(--bg);color:var(--cream);font-family:var(--body);line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:hidden}
body.lock{overflow:hidden;height:100vh}
img{display:block;max-width:100%}
a{color:inherit;text-decoration:none}
button{font:inherit;cursor:pointer;color:inherit}
::selection{background:var(--brass);color:var(--bg)}
body::after{content:"";position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.05;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.wrap{max-width:88rem;margin:auto;padding-inline:clamp(1.15rem,4vw,4rem)}
.disp{font-family:var(--disp)}
.eyebrow{font-size:.74rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--brass);display:inline-flex;align-items:center;gap:.6rem}
.eyebrow::before{content:"";width:2rem;height:1px;background:var(--brass)}
.h2{font-family:var(--disp);font-weight:600;font-size:clamp(2rem,1.2rem + 3.4vw,4.2rem);line-height:1.02;letter-spacing:-.03em}
.h2 .em{color:var(--brass)}
.lede{color:var(--cream2);font-size:clamp(1.02rem,.95rem + .4vw,1.22rem);line-height:1.6;max-width:48ch}
.sec{padding-block:clamp(5rem,9vw,9rem);position:relative;z-index:2}
.rv{opacity:0;transform:translateY(40px);transition:opacity 1s var(--ease),transform 1s var(--ease)}
.rv.in{opacity:1;transform:none}
.rv.d1{transition-delay:.1s}.rv.d2{transition-delay:.2s}.rv.d3{transition-delay:.3s}
.lines .ln{overflow:hidden;display:block}
.lines .ln i{display:block;transform:translateY(110%);transition:transform 1.1s var(--ease)}
.lines.go .ln i{transform:none}
.lines.go .ln:nth-child(2) i{transition-delay:.09s}.lines.go .ln:nth-child(3) i{transition-delay:.18s}
@media(prefers-reduced-motion:reduce){.rv{opacity:1;transform:none}.lines .ln i{transform:none}*{animation:none!important}}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.55rem;background:var(--brass);color:var(--bg);font-weight:600;font-size:1rem;padding:1rem 1.7rem;border:0;border-radius:999px;transition:background .3s,transform .2s var(--ease),box-shadow .3s;box-shadow:0 14px 30px -16px rgba(194,160,90,.8)}
.btn:hover{background:var(--brass-l);transform:translateY(-2px)}
.btn.out{background:transparent;color:var(--cream);border:1.5px solid var(--line2);box-shadow:none}
.btn.out:hover{border-color:var(--brass);color:var(--brass)}
.btn.sm{padding:.62rem 1.1rem;font-size:.85rem}
.cur,.curd{position:fixed;top:0;left:0;z-index:120;pointer-events:none;border-radius:999px;will-change:transform}
.curd{width:6px;height:6px;background:var(--brass);margin:-3px 0 0 -3px}
.cur{width:42px;height:42px;border:1px solid var(--brass);margin:-21px 0 0 -21px;display:flex;align-items:center;justify-content:center;transition:width .3s var(--ease),height .3s var(--ease),background .3s}
.cur .lbl{font-size:.6rem;letter-spacing:.06em;text-transform:uppercase;color:var(--bg);opacity:0;transition:opacity .2s;white-space:nowrap}
html.has-cur,html.has-cur *{cursor:none!important}
.cur.big{width:92px;height:92px;background:var(--brass);border-color:var(--brass)}
.cur.big .lbl{opacity:1}
@media(hover:none){.cur,.curd{display:none}}
.pre{position:fixed;inset:0;z-index:130;background:var(--bg2);color:var(--cream);display:flex;align-items:flex-end;justify-content:space-between;padding:clamp(1.5rem,5vw,3rem);transition:transform 1s var(--ease);transition-delay:.2s}
.pre.done{transform:translateY(-100%)}
.pre .big{font-family:var(--disp);font-weight:600;font-size:clamp(3rem,12vw,9rem);line-height:.85;letter-spacing:-.03em}
.pre .big span{color:var(--brass)}
.pre .c{font-family:var(--disp);font-size:clamp(2rem,8vw,5rem);color:var(--brass)}
header{position:fixed;inset:0 0 auto;z-index:60}
.hd{display:flex;align-items:center;justify-content:space-between;height:74px;gap:1rem}
.lg{display:flex;align-items:center;gap:.55rem;font-family:var(--disp);font-weight:600;font-size:1.2rem}
.lg .m{width:22px;height:22px;flex:none}
.nav{display:none;gap:2rem}
.nav a{font-size:.8rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--cream2);position:relative}
.nav a::after{content:"";position:absolute;left:0;bottom:-3px;height:1px;width:100%;background:var(--brass);transform:scaleX(0);transform-origin:right;transition:transform .35s var(--ease)}
.nav a:hover::after{transform:scaleX(1);transform-origin:left}
.hd-r{display:flex;align-items:center;gap:1rem}
.hd-ph{display:none;font-weight:600;font-size:.92rem}
@media(min-width:1000px){.nav{display:flex}.hd-ph{display:block}}
.hero{min-height:100svh;display:flex;flex-direction:column;justify-content:center;padding-top:6rem;position:relative;z-index:2}
.hero .top{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid var(--line);padding-bottom:1.1rem;margin-bottom:clamp(1.5rem,4vw,3rem)}
.hero .top .yr{font-family:var(--disp);font-size:clamp(.9rem,2.5vw,1.2rem);color:var(--soft)}
.hero h1{font-family:var(--disp);font-weight:600;font-size:clamp(2.7rem,1rem + 9vw,9.5rem);line-height:.9;letter-spacing:-.04em}
.hero h1 .em{color:var(--brass)}
.hero .bottom{display:grid;grid-template-columns:1fr;gap:1.8rem;margin-top:clamp(1.8rem,4vw,3rem);align-items:end}
.hero .sub{color:var(--cream2);font-size:1.1rem;max-width:42ch}
.hero .cta{display:flex;flex-wrap:wrap;gap:1rem;align-items:center}
@media(min-width:860px){.hero .bottom{grid-template-columns:1.3fr auto}}
.band{position:relative;z-index:2;height:clamp(11rem,26vw,20rem);overflow:hidden;border-block:1px solid var(--line)}
.band img{width:100%;height:100%;object-fit:cover;transform:scale(1.15);will-change:transform}
.band .cap{position:absolute;left:clamp(1.15rem,4vw,4rem);bottom:1rem;font-family:var(--disp);font-size:.85rem;color:var(--cream);letter-spacing:.04em;text-shadow:0 2px 14px rgba(0,0,0,.5)}
.pcap{display:flex;justify-content:space-between;align-items:flex-end;gap:2rem;flex-wrap:wrap;margin-bottom:2.5rem}
.car-nav{display:flex;gap:.6rem}
.car-nav button{width:54px;height:54px;border-radius:999px;border:1.5px solid var(--line2);background:transparent;display:flex;align-items:center;justify-content:center;transition:.25s}
.car-nav button:hover{background:var(--brass);color:var(--bg);border-color:var(--brass)}
.carwrap{overflow:hidden}
.car{display:flex;gap:clamp(1rem,2vw,1.6rem);overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:1.6rem;scrollbar-width:none}
.car::-webkit-scrollbar{display:none}
.pc{flex:0 0 min(87vw,31rem);scroll-snap-align:start;background:var(--panel);border:1px solid var(--line);border-radius:6px;overflow:hidden}
.pc .ph{position:relative;aspect-ratio:4/3.3;overflow:hidden;cursor:pointer}
.pc .ph img{width:100%;height:100%;object-fit:cover;transition:transform 1.1s var(--ease);will-change:transform}
.pc .ph:hover img{transform:scale(1.07)}
.pc .no{position:absolute;left:1rem;top:.9rem;z-index:2;font-family:var(--disp);font-weight:600;font-size:.9rem;color:#fff;text-shadow:0 2px 14px rgba(0,0,0,.6)}
.pc .mat{position:absolute;right:1rem;top:1rem;z-index:2;background:rgba(20,33,58,.7);backdrop-filter:blur(6px);border:1px solid var(--line);font-size:.7rem;letter-spacing:.04em;text-transform:uppercase;padding:.35rem .7rem;border-radius:999px;color:var(--cream)}
.pc .body{padding:1.3rem 1.4rem 1.5rem}
.pc .meta{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem}
.pc h3{font-family:var(--disp);font-weight:600;font-size:1.5rem;letter-spacing:-.02em}
.pc .pr{text-align:right;white-space:nowrap}
.pc .pr .now{font-family:var(--disp);font-weight:600;font-size:1.15rem;color:var(--brass)}
.pc .pr small{display:block;font-size:.66rem;color:var(--soft);font-family:var(--body);letter-spacing:.02em}
.pc .brief{display:flex;gap:1.3rem;margin-top:1rem;padding-top:1rem;border-top:1px solid var(--line);font-size:.8rem;color:var(--cream2)}
.pc .brief b{font-family:var(--disp);font-weight:600;color:var(--cream)}
.pc .btns{display:grid;grid-template-columns:1fr auto;gap:.6rem;margin-top:1.2rem}
.gal{display:grid;grid-template-columns:repeat(2,1fr);gap:clamp(.5rem,1.2vw,1rem);margin-top:3rem}
.gal a{position:relative;overflow:hidden;border-radius:4px;aspect-ratio:4/3}
.gal a:nth-child(1){grid-column:span 2;aspect-ratio:16/9}
.gal img{width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
.gal a:hover img{transform:scale(1.06)}
.gal .more{position:absolute;inset:0;background:rgba(15,26,48,.74);display:flex;align-items:center;justify-content:center;font-family:var(--disp);font-size:1.4rem;color:var(--brass)}
@media(min-width:760px){.gal{grid-template-columns:repeat(4,1fr)}.gal a:nth-child(1){grid-column:span 2;grid-row:span 2;aspect-ratio:auto}}
.why{background:var(--bg2);border:1px solid var(--line);border-radius:clamp(8px,2vw,18px)}
.vals{display:grid;grid-template-columns:1fr;gap:0;margin-top:3rem;border-top:1px solid var(--line)}
.val{display:grid;grid-template-columns:1fr;gap:.6rem;padding:2rem 0;border-bottom:1px solid var(--line)}
.val .n{font-family:var(--disp);font-weight:600;font-size:2rem;color:var(--brass)}
.val h3{font-family:var(--disp);font-weight:500;font-size:1.4rem}
.val p{color:var(--cream2);max-width:54ch}
@media(min-width:820px){.val{grid-template-columns:5rem 1fr 1.4fr;gap:2.5rem;align-items:baseline}}
.guar{display:grid;grid-template-columns:1fr;gap:2.5rem;align-items:center;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding-block:clamp(2.5rem,5vw,5rem)}
.guar .seal{font-family:var(--disp);font-weight:600;font-size:clamp(6rem,18vw,14rem);line-height:.76;letter-spacing:-.05em;display:flex;align-items:flex-start;color:var(--brass)}
.guar .seal .s{font-size:.14em;color:var(--soft);margin:.8em 0 0 .2em}
.guar ul{list-style:none;display:grid;gap:0}
.guar li{display:flex;gap:.8rem;padding:1rem 0;border-bottom:1px solid var(--line);align-items:baseline}
.guar li:first-child{border-top:1px solid var(--line)}
.guar li svg{width:17px;height:17px;color:var(--brass);flex:none;transform:translateY(3px)}
@media(min-width:880px){.guar{grid-template-columns:.8fr 1.2fr;gap:4rem}}
.revs{display:grid;grid-template-columns:1fr;gap:1.4rem;margin-top:3rem}
.rev{border:1px solid var(--line);border-radius:6px;padding:1.9rem;background:var(--panel)}
.rev .q{font-family:var(--disp);font-weight:400;font-size:1.05rem;line-height:1.5}
.rev .who{margin-top:1.4rem;font-size:.82rem;color:var(--soft)}
.rev .who b{color:var(--brass)}
@media(min-width:880px){.revs{grid-template-columns:repeat(3,1fr)}}
.scarc{display:grid;grid-template-columns:1fr;gap:2rem;align-items:center;background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:clamp(1.8rem,4vw,3rem)}
.scarc .big{font-family:var(--disp);font-weight:500;font-size:clamp(1.5rem,1.1rem + 1.8vw,2.4rem);line-height:1.15}
.scarc .big .em{color:var(--brass)}
@media(min-width:760px){.scarc{grid-template-columns:1.5fr auto;gap:3rem}}
.acc{border-bottom:1px solid var(--line)}
.acc:first-child{border-top:1px solid var(--line)}
.acc button{width:100%;display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:1.4rem 0;background:none;border:0;text-align:left}
.acc .q{font-family:var(--disp);font-weight:500;font-size:clamp(1.1rem,1rem + .6vw,1.5rem);letter-spacing:-.01em}
.acc .pl{flex:none;width:34px;height:34px;border:1.5px solid var(--line2);border-radius:999px;display:flex;align-items:center;justify-content:center;transition:.25s;color:var(--brass)}
.acc.on .pl{background:var(--brass);color:var(--bg);border-color:var(--brass);transform:rotate(45deg)}
.acc .a{display:grid;grid-template-rows:0fr;transition:grid-template-rows .35s var(--ease)}
.acc.on .a{grid-template-rows:1fr}
.acc .a>div{overflow:hidden}
.acc .a p{padding-bottom:1.4rem;color:var(--cream2);max-width:70ch}
.final{position:relative;overflow:hidden;text-align:center;border-radius:clamp(8px,2vw,18px)}
.final .bg{position:absolute;inset:0}.final .bg img{width:100%;height:100%;object-fit:cover}
.final .ov{position:absolute;inset:0;background:linear-gradient(rgba(15,26,48,.86),rgba(15,26,48,.86))}
.final .in{position:relative;z-index:2;padding-block:clamp(4.5rem,10vw,9rem)}
.final h2{font-family:var(--disp);font-weight:600;font-size:clamp(2.4rem,1.4rem + 4vw,5.2rem);line-height:.98;letter-spacing:-.03em;max-width:16ch;margin-inline:auto}
.final h2 .em{color:var(--brass)}
.final p{color:var(--cream2);margin-top:1.3rem;max-width:44ch;margin-inline:auto}
footer{padding-block:3rem;color:var(--soft);font-size:.9rem;border-top:1px solid var(--line)}
.fbar{display:flex;justify-content:space-between;flex-wrap:wrap;gap:1rem;align-items:center}
.fbar .wm{font-family:var(--disp);font-weight:600;font-size:1.6rem;color:var(--cream)}
.fbar a:hover{color:var(--brass)}
dialog{border:0;padding:0;background:var(--panel);color:var(--cream);box-shadow:0 50px 120px -30px rgba(0,0,0,.7);border:1px solid var(--line2)}
dialog::backdrop{background:rgba(8,14,26,.72);backdrop-filter:blur(5px)}
#modal{border-radius:8px;max-width:31rem;width:calc(100% - 2rem)}
.modal{padding:clamp(1.6rem,4vw,2.4rem);position:relative}
.x{position:absolute;top:1rem;right:1rem;width:38px;height:38px;border-radius:999px;border:1px solid var(--line2);background:transparent;color:var(--cream);display:flex;align-items:center;justify-content:center;z-index:5}
.modal h3{font-family:var(--disp);font-weight:600;font-size:1.6rem;line-height:1.05;margin-top:.5rem;letter-spacing:-.02em}
.modal .sm{color:var(--cream2);font-size:.94rem;margin-top:.6rem}
.field{margin-top:1rem}
.field label{display:block;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--soft);margin-bottom:.4rem}
.inp{width:100%;border:1.5px solid var(--line2);background:var(--bg2);border-radius:6px;padding:.85rem .9rem;font-size:1rem;font-family:var(--body);color:var(--cream)}
.inp:focus{outline:0;border-color:var(--brass);box-shadow:0 0 0 3px rgba(194,160,90,.2)}
.modal .btn{width:100%;margin-top:1.2rem}
.modal .note{font-size:.72rem;color:var(--faint);text-align:center;margin-top:.8rem}
.sent{text-align:center;padding:1.5rem 0}
.sent .ok{width:58px;height:58px;border-radius:999px;background:var(--brass);color:var(--bg);display:flex;align-items:center;justify-content:center;font-size:1.7rem;margin:0 auto 1rem}
#detail{border-radius:10px;max-width:66rem;width:calc(100% - 1.5rem);max-height:92vh;overflow:auto}
.det .hd2{position:sticky;top:0;z-index:4;background:color-mix(in srgb,var(--panel) 92%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem clamp(1.2rem,3vw,2rem)}
.det .hd2 h3{font-family:var(--disp);font-weight:600;font-size:1.4rem;letter-spacing:-.02em}
.det .hd2 .t{font-size:.74rem;color:var(--brass);text-transform:uppercase;letter-spacing:.08em}
.det .gmain{position:relative;aspect-ratio:16/9;overflow:hidden;background:var(--bg2)}
.det .gmain img{width:100%;height:100%;object-fit:cover}
.det .gmain .cap{position:absolute;left:.8rem;bottom:.8rem;background:rgba(15,26,48,.8);font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;color:var(--cream);padding:.3rem .6rem;border-radius:4px}
.det .thumbs{display:flex;gap:.5rem;padding:.7rem clamp(1.2rem,3vw,2rem);overflow-x:auto;scrollbar-width:none}
.det .thumbs::-webkit-scrollbar{display:none}
.det .thumbs button{flex:0 0 5.5rem;aspect-ratio:4/3;border-radius:4px;overflow:hidden;border:2px solid transparent;padding:0;position:relative}
.det .thumbs button.on{border-color:var(--brass)}
.det .thumbs img{width:100%;height:100%;object-fit:cover}
.det .cont{padding:clamp(1.2rem,3vw,2rem);display:grid;gap:2rem}
@media(min-width:820px){.det .cont{grid-template-columns:1.2fr .8fr}}
.det .specs{display:grid;grid-template-columns:repeat(2,1fr);gap:0;border-top:1px solid var(--line)}
.det .specs div{padding:.8rem 0;border-bottom:1px solid var(--line);border-right:1px solid var(--line);padding-right:1rem}
.det .specs .k{font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;color:var(--soft)}
.det .specs .v{font-family:var(--disp);font-size:1.15rem;margin-top:.2rem}
@media(min-width:520px){.det .specs{grid-template-columns:repeat(3,1fr)}}
.det h4{font-family:var(--disp);font-weight:500;font-size:1.1rem;margin-bottom:.8rem}
.det .incl{list-style:none;display:grid;gap:.55rem}
.det .incl li{display:flex;gap:.5rem;align-items:baseline;font-size:.94rem;color:var(--cream2)}
.det .incl li svg{width:15px;height:15px;color:var(--brass);flex:none;transform:translateY(2px)}
.det .side{background:var(--bg2);border:1px solid var(--line);border-radius:8px;padding:1.4rem;align-self:start}
.det .side .now{font-family:var(--disp);font-weight:600;font-size:1.8rem;color:var(--brass);line-height:1}
.det .side .mo{font-size:.82rem;color:var(--cream2);margin-top:.3rem}
.det .side .btn{width:100%;margin-top:1rem}
.scta{position:fixed;left:0;right:0;bottom:0;z-index:50;background:var(--panel);border-top:1px solid var(--line2);padding:.7rem clamp(1.15rem,4vw,2rem);display:flex;gap:1rem;align-items:center;justify-content:space-between;transform:translateY(120%);transition:transform .4s var(--ease)}
.scta.show{transform:none}
.scta .p{font-family:var(--disp);font-size:1rem}.scta .p small{display:block;color:var(--soft);font-size:.72rem;font-family:var(--body)}
@media(min-width:1000px){.scta{display:none}}
.banner{background:var(--bg2);color:var(--cream2);text-align:center;font-size:.72rem;letter-spacing:.04em;padding:.45rem 1rem;position:relative;z-index:61;border-bottom:1px solid var(--line)}
.banner b{color:var(--brass)}
</style>
</head>
<body class="lock">
<div class="curd" id="curd"></div><div class="cur" id="cur"><span class="lbl" id="curl"></span></div>
<div class="pre" id="pre"><div class="big">Динас<span>тия</span></div><div class="c"><span id="prec">0</span>%</div></div>
<div class="banner">Превью · реальные проекты и фото СК «Династия» · <b>контакты/гарантии — уточняются</b></div>

<header id="hdr"><div class="wrap hd">
  <a href="#top" class="lg" data-cursor><svg class="m" viewBox="0 0 28 28" fill="none"><path d="M4 24 14 5l10 19" stroke="var(--brass)" stroke-width="1.8"/><path d="M9 24 14 14l5 10" stroke="var(--cream)" stroke-width="1.8"/></svg>Династия</a>
  <nav class="nav"><a href="#projects" data-cursor>Проекты</a><a href="#built" data-cursor>Построенные дома</a><a href="#why" data-cursor>Почему мы</a><a href="#reviews" data-cursor>Отзывы</a></nav>
  <div class="hd-r"><a href="tel:+78122431434" class="hd-ph">+7 (812) 243-14-34</a><button class="btn sm" data-open data-magnetic>Получить смету</button></div>
</div></header>

<main id="top">
<section class="hero"><div class="wrap">
  <div class="top"><span class="eyebrow rv">СК «Династия» · СПб + Ленобласть</span><span class="yr rv d1">Сезон 2026 — 10 проектов</span></div>
  <h1 class="lines" id="headline"><span class="ln"><i>Здесь</i></span><span class="ln"><i>начинаются</i></span><span class="ln"><i><span class="em">династии</span></i></span></h1>
  <div class="bottom">
    <p class="sub rv d2">Готовые проекты домов под ключ из газобетона. Терраса и панорамные окна, срок строительства от 110 дней, фиксированная смета и гарантия.</p>
    <div class="cta rv d3"><button class="btn" data-open data-magnetic>Получить смету (PDF)</button><a href="#projects" class="eyebrow" data-cursor style="color:var(--cream)">↓ Проекты</a></div>
  </div>
</div></section>

<div class="band" id="band"><img id="bandimg" alt="Дом"><span class="cap" id="bandcap"></span></div>

<section class="sec" id="projects"><div class="wrap">
  <div class="pcap">
    <div><span class="eyebrow rv">Каталог · 10 проектов</span><h2 class="h2 rv" style="margin-top:1rem">Выберите дом —<br>и <span class="em">заберите смету</span></h2></div>
    <div class="car-nav rv d1"><button id="prev" data-cursor aria-label="Назад"><svg width="20" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M19 8H1M7 2 1 8l6 6"/></svg></button><button id="next" data-cursor aria-label="Вперёд"><svg width="20" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M1 8h18M13 2l6 6-6 6"/></svg></button></div>
  </div>
</div><div class="wrap carwrap"><div class="car" id="car"></div></div></section>

<section class="sec" id="built"><div class="wrap">
  <span class="eyebrow rv">Построенные дома</span>
  <h2 class="h2 rv" style="margin-top:1rem">Реальные объекты <span class="em">наших клиентов</span></h2>
  <p class="lede rv d1" style="margin-top:1rem">Фотографии сданных домов по нашим проектам.</p>
  <div class="gal" id="gal"></div>
</div></section>

<section class="sec"><div class="wrap"><div class="why" style="padding:clamp(2rem,5vw,4rem)">
  <span class="eyebrow rv">Почему «Династия»</span>
  <h2 class="h2 rv" style="margin-top:1rem;max-width:18ch">Мы убрали из стройки <span class="em">страх</span></h2>
  <div class="vals" id="vals"></div>
</div></div></section>

<section class="sec"><div class="wrap"><div class="guar rv">
  <div><span class="eyebrow">Риск — наш</span><div class="seal" style="margin-top:.8rem">25<span class="s">лет</span></div><p class="lede" style="max-width:24ch;margin-top:.4rem">На конструктив дома — закреплено в договоре.</p></div>
  <ul id="guarlist"></ul>
</div></div></section>

<section class="sec" id="reviews"><div class="wrap">
  <span class="eyebrow rv">Отзывы</span><h2 class="h2 rv" style="margin-top:1rem">Что говорят владельцы</h2>
  <div class="revs" id="revs"></div>
</div></section>

<section class="sec"><div class="wrap"><div class="scarc rv">
  <div><span class="eyebrow">График сезона 2026</span><p class="big" style="margin-top:1rem">Берём <span class="em">ограниченное</span> число объектов за сезон — ради качества и сроков.</p></div>
  <div><button class="btn" data-open data-magnetic>Зафиксировать цену</button></div>
</div></div></section>

<section class="sec"><div class="wrap" style="max-width:58rem">
  <span class="eyebrow rv">Вопросы</span><h2 class="h2 rv" style="margin-top:1rem;margin-bottom:2rem">Отвечаем на возражения</h2>
  <div id="faq"></div>
</div></section>

<section class="sec"><div class="wrap"><div class="final">
  <div class="bg"><img id="finalimg" alt=""></div><div class="ov"></div>
  <div class="wrap in"><h2>Узнайте цену <span class="em">вашего</span> дома за 5 минут</h2><p>Пришлём смету по выбранному проекту, планировки и расчёт ипотеки. Бесплатно.</p><button class="btn" style="margin-top:2rem" data-open data-magnetic>Получить смету (PDF)</button></div>
</div></div></section>
</main>

<footer><div class="wrap fbar"><span class="wm">Династия</span><span>© <span id="year"></span> СК «Династия» · +7 (812) 243-14-34 · info@sk-dinastiya.com</span></div></footer>

<div class="scta" id="scta"><div class="p">Получить смету<small>PDF · бесплатно</small></div><button class="btn sm" data-open>Получить</button></div>
<dialog id="modal"><div class="modal"><button class="x" id="x" data-cursor aria-label="Закрыть">✕</button><div id="modal-body"></div></div></dialog>
<dialog id="detail"><div class="det"><div id="detail-body"></div></div></dialog>

<script>
const P=__PROJECTS__;
const built=__BUILT__;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ch='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg>';
const rub=n=>'от '+n.toLocaleString('ru-RU')+' ₽';
const INCL=["Индивидуальная посадка проекта на участок","Геология и фундамент под ваш грунт","Стены из газобетона + кровля","Инженерные сети под ключ","Чистовая отделка white-box","Авторский и технический надзор"];
function gallery(p){return [...p.renders.map(s=>({s,t:'Визуализация'})),...p.reals.map(s=>({s,t:'Фото объекта'})),...p.plans.map(s=>({s,t:'Планировка'}))];}

/* hero band + final image = biggest project render */
const flag=P[P.length-1];
$("#bandimg").src=flag.renders[0];$("#bandcap").textContent=flag.name+" · "+flag.area+" м²";
$("#finalimg").src=P[Math.floor(P.length/2)].renders[0];

$("#car").innerHTML=P.map((p,i)=>`
  <article class="pc">
    <div class="ph" data-detail="${p.slug}" data-cursor data-label="Подробнее"><span class="no">${String(i+1).padStart(2,'0')} / ${P.length}</span><span class="mat">Газобетон</span><img src="${p.renders[0]}" alt="${p.name}" loading="lazy"></div>
    <div class="body">
      <div class="meta"><div><h3>${p.name}</h3><div class="dream" style="color:var(--soft);font-size:.86rem;margin-top:.25rem">${p.gab} м · терраса, панорамные окна</div></div><div class="pr"><div class="now">${rub(p.price)}</div><small>под ключ</small></div></div>
      <div class="brief"><span><b>${p.area}</b> м²</span><span><b>${p.rooms.split(' ')[0]}</b> комн.</span><span><b>${(p.baths.match(/\d+/)||['1'])[0]}</b> с/у</span></div>
      <div class="btns"><button class="btn sm" data-open="${p.slug}" data-magnetic>Получить смету</button><button class="btn out sm" data-detail="${p.slug}" data-cursor>Подробнее</button></div>
    </div>
  </article>`).join("");

/* built gallery */
const showN=Math.min(8,built.length);
$("#gal").innerHTML=built.slice(0,showN).map((g,i)=>{
  const more=(i===showN-1 && built.length>showN)?`<span class="more">+${built.length-showN} фото</span>`:"";
  return `<a href="javascript:void(0)" data-cursor data-label="Фото" data-photo="${g}"><img src="${g}" alt="Построенный дом" loading="lazy">${more}</a>`;
}).join("");

const vals=[["01","Фиксированная смета","Стоимость закрепляется в договоре до старта. Без доплат «по ходу»."],["02","Договор на каждый этап","Платите только за принятый результат, этап за этапом."],["03","Свои бригады и надзор","Штатные инженеры, технадзор, фотоотчёт. Без субподрядчиков с улицы."]];
$("#vals").innerHTML=vals.map(v=>`<div class="val rv"><div class="n">${v[0]}</div><h3>${v[1]}</h3><p>${v[2]}</p></div>`).join("");
const guar=[["Фиксированная смета","цена в договоре не меняется"],["Срок строительства от 110 дней","закреплён в договоре"],["Договор на каждый этап","оплата за принятый результат"],["Гарантия на конструктив","по договору"],["Свои бригады, технадзор","без субподрядчиков"],["Фотоотчёт по этапам","видите стройку всегда"]];
$("#guarlist").innerHTML=guar.map(g=>`<li>${ch}<span><b>${g[0]}.</b> ${g[1]}</span></li>`).join("");
const revs=[["«Фикс-смету держали до конца. Заехали в срок, дом тёплый.»","Алексей и Марина","Дом «Камелия»"],["«Платишь — видишь результат. Прораб всегда на связи.»","Сергей","Дом «Цитадель»"],["«Планировку предложили удобнее нашей. Сборка — без нареканий.»","Ольга","Дом «Виктория»"]];
$("#revs").innerHTML=revs.map(r=>`<div class="rev rv"><div class="q">${r[0]}</div><div class="who"><b>${r[1]}</b> · ${r[2]}</div></div>`).join("");
const faqs=[["А если смета вырастет?","Не вырастет: итог фиксируется в договоре до старта. Изменения — только по вашему письменному согласию."],["Из чего строите дома?","Все проекты — из газобетона: тёплые стены, ровная геометрия, быстрый монтаж. Срок строительства от 110 дней."],["Что в PDF?","Смета построчно, планировки, спецификация материалов и график работ по выбранному проекту."],["Можно адаптировать проект?","Да. Любой из проектов адаптируем под ваш участок и состав семьи."],["В каких районах строите?","Санкт-Петербург и Ленинградская область. Выезд инженера на участок — бесплатно."]];
$("#faq").innerHTML=faqs.map((f,i)=>`<div class="acc${i===0?' on':''}"><button data-cursor><span class="q">${f[0]}</span><span class="pl">+</span></button><div class="a"><div><p>${f[1]}</p></div></div></div>`).join("");
$$(".acc button").forEach(b=>b.onclick=()=>{const a=b.parentElement,was=a.classList.contains("on");$$(".acc").forEach(x=>x.classList.remove("on"));if(!was)a.classList.add("on")});
$("#year").textContent=new Date().getFullYear();

const pre=$("#pre");let pcc=0;
const pint=setInterval(()=>{pcc=Math.min(100,pcc+Math.random()*16+6);$("#prec").textContent=Math.round(pcc);if(pcc>=100){clearInterval(pint);setTimeout(start,250);}},90);
function start(){pre.classList.add("done");document.body.classList.remove("lock");setTimeout(()=>$("#headline").classList.add("go"),150);const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{rootMargin:"-50px"});$$(".rv").forEach(el=>io.observe(el));}
setTimeout(()=>{if(!pre.classList.contains('done'))start();},4000);

const modal=$("#modal"),detail=$("#detail");
function openModal(slug){
  const p=P.find(x=>x.slug===slug);const opts=P.map(x=>`<option value="${x.slug}"${x.slug===slug?' selected':''}>${x.name} · ${x.area} м² · ${rub(x.price)}</option>`).join("");
  $("#modal-body").innerHTML=`<span class="eyebrow">Обратная связь · PDF за 5 минут</span><h3>${p?`Смета по дому «${p.name}»`:"Получить смету"}</h3><p class="sm">Оставьте контакт — пришлём детальную смету, планировки и расчёт ипотеки. Без звонков-давления.</p><form id="lf"><div class="field"><label>Проект</label><select class="inp" id="lf-p">${opts}</select></div><div class="field"><label>Как вас зовут</label><input class="inp" id="lf-n" placeholder="Имя"></div><div class="field"><label>Телефон или e-mail</label><input class="inp" id="lf-c" placeholder="+7 … или почта"></div><button class="btn" type="submit">Прислать смету →</button><p class="note">Без спама. Контакт только для отправки сметы.</p></form>`;
  $("#lf").onsubmit=e=>{e.preventDefault();const n=$("#lf-n").value.trim(),c=$("#lf-c").value.trim();if(n.length<2||c.length<5){alert("Заполните имя и контакт");return}const pr=P.find(x=>x.slug===$("#lf-p").value);$("#modal-body").innerHTML=`<div class="sent"><div class="ok">✓</div><h3>Готово, ${n.split(" ")[0]}!</h3><p class="sm">Смету по дому «${pr.name}» пришлём на ${c} в течение рабочего дня.</p></div>`;};
  if(detail.open)detail.close();if(!modal.open)modal.showModal();
}
function openDetail(slug){
  const p=P.find(x=>x.slug===slug);if(!p)return;const g=gallery(p);
  $("#detail-body").innerHTML=`
    <div class="hd2"><div><div class="t">Проект · газобетон</div><h3>${p.name} · ${p.area} м²</h3></div><button class="x" id="dx" data-cursor>✕</button></div>
    <div class="gmain"><img id="dmain" src="${g[0].s}" alt="${p.name}"><span class="cap" id="dcap">${g[0].t}</span></div>
    <div class="thumbs">${g.map((x,k)=>`<button class="${k===0?'on':''}" data-g="${x.s}" data-t="${x.t}"><img src="${x.s}" alt=""></button>`).join("")}</div>
    <div class="cont">
      <div>
        <div class="specs">
          <div><div class="k">Площадь</div><div class="v">${p.area} м²</div></div>
          <div><div class="k">Габариты</div><div class="v">${p.gab}</div></div>
          <div><div class="k">Комнаты</div><div class="v" style="font-size:.95rem">${p.rooms}</div></div>
          <div><div class="k">Санузлы</div><div class="v">${(p.baths.match(/\d+/)||['1'])[0]}</div></div>
          <div><div class="k">Материал</div><div class="v" style="font-size:.95rem">Газобетон</div></div>
          <div><div class="k">Срок</div><div class="v" style="font-size:.95rem">от 110 дней</div></div>
        </div>
        <div style="margin-top:1.8rem"><h4>Что входит в цену под ключ</h4><ul class="incl">${INCL.map(x=>`<li>${ch}<span>${x}</span></li>`).join("")}</ul></div>
        <p class="sm" style="color:var(--soft);margin-top:1.3rem;font-size:.82rem">В проекте предусмотрены терраса и панорамные окна. Листайте миниатюры: визуализации, фото объекта и планировки.</p>
      </div>
      <div class="side">
        <div class="t" style="font-size:.7rem;color:var(--soft);text-transform:uppercase;letter-spacing:.08em">Цена под ключ</div>
        <div class="now">${rub(p.price)}</div>
        <div class="mo">${p.gab} м · ${p.rooms}</div>
        <button class="btn" data-open="${p.slug}">Получить смету →</button>
        <p class="note" style="font-size:.7rem;color:var(--faint);text-align:center;margin-top:.7rem">Фикс-цена · договор на этап</p>
      </div>
    </div>`;
  $("#dx").onclick=()=>detail.close();
  $$("#detail .thumbs button").forEach(b=>b.onclick=()=>{$("#dmain").src=b.dataset.g;$("#dcap").textContent=b.dataset.t;$$("#detail .thumbs button").forEach(x=>x.classList.remove("on"));b.classList.add("on")});
  $("#detail-body").querySelector('[data-open]').onclick=()=>openModal(slug);
  if(!detail.open)detail.showModal();
}
function openPhoto(src){$("#modal-body").innerHTML=`<button class="x" onclick="this.closest('dialog').close()" style="position:static;float:right">✕</button><img src="${src}" style="width:100%;border-radius:6px;margin-top:1.5rem" alt="">`;if(!modal.open)modal.showModal();}
document.addEventListener('click',e=>{const o=e.target.closest('[data-open]');if(o){openModal(o.dataset.open||P[0].slug);return;}const d=e.target.closest('[data-detail]');if(d){openDetail(d.dataset.detail);return;}const ph=e.target.closest('[data-photo]');if(ph){openPhoto(ph.dataset.photo);return;}});
$("#x").onclick=()=>modal.close();
modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});
detail.addEventListener('click',e=>{if(e.target===detail)detail.close()});

const car=$("#car");
function cardW(){const c=car.querySelector('.pc');return c?c.getBoundingClientRect().width+parseFloat(getComputedStyle(car).gap||16):400;}
$("#next").onclick=()=>car.scrollBy({left:cardW(),behavior:'smooth'});
$("#prev").onclick=()=>car.scrollBy({left:-cardW(),behavior:'smooth'});
let down=false,sx=0,sl=0;
car.addEventListener('pointerdown',e=>{down=true;sx=e.clientX;sl=car.scrollLeft;car.setPointerCapture(e.pointerId);});
car.addEventListener('pointermove',e=>{if(down){car.scrollLeft=sl-(e.clientX-sx);}});
addEventListener('pointerup',()=>down=false);
let lastSL=0,vel=0;
(function loop(){const d=car.scrollLeft-lastSL;lastSL=car.scrollLeft;vel+=(d-vel)*.2;const sk=Math.max(-6,Math.min(6,vel*.32));$$('.pc .ph',car).forEach(ph=>ph.style.transform=`skewX(${-sk*0.25}deg)`);requestAnimationFrame(loop);})();

const band=$("#band"),bimg=$("#bandimg");
addEventListener('scroll',()=>{const r=band.getBoundingClientRect();const p=(r.top+r.height)/(innerHeight+r.height);bimg.style.transform=`scale(1.15) translateY(${(p-.5)*-14}%)`;$("#scta").classList.toggle("show",scrollY>innerHeight*0.9);},{passive:true});

if(matchMedia('(hover:hover) and (pointer:fine)').matches){
  document.documentElement.classList.add('has-cur');
  const cur=$("#cur"),curd=$("#curd"),curl=$("#curl");let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my,dx=mx,dy=my;
  addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;});
  (function cl(){cx+=(mx-cx)*.15;cy+=(my-cy)*.15;dx+=(mx-dx)*.4;dy+=(my-dy)*.4;cur.style.transform=`translate(${cx}px,${cy}px)`;curd.style.transform=`translate(${dx}px,${dy}px)`;requestAnimationFrame(cl);})();
  addEventListener('pointerover',e=>{const t=e.target.closest('[data-label]');if(t){cur.classList.add('big');curl.textContent=t.dataset.label;}else{cur.classList.remove('big');curl.textContent='';}});
  $$('[data-magnetic]').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-(r.left+r.width/2))*.25}px,${(e.clientY-(r.top+r.height/2))*.35}px)`;});el.addEventListener('pointerleave',()=>el.style.transform='');});
}
import('https://cdn.jsdelivr.net/npm/lenis@1.1.13/+esm').then(m=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const L=m.default;const l=new L({duration:1.1,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t))});function raf(t){l.raf(t);requestAnimationFrame(raf);}requestAnimationFrame(raf);$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=document.querySelector(a.getAttribute('href'));if(el){e.preventDefault();l.scrollTo(el,{offset:-70});}}));}).catch(()=>{});
</script>
</body>
</html>
"""

html=TEMPLATE.replace("__PROJECTS__",json.dumps(projects,ensure_ascii=False)).replace("__BUILT__",json.dumps(built,ensure_ascii=False))
open("/home/user/claude-site/preview/offer.html","w",encoding="utf-8").write(html)
print("written offer.html",len(html),"bytes")
