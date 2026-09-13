import { useLayoutEffect, useRef, useState } from "react";

export function CourseBackdrop() {
  const root = useRef<HTMLDivElement>(null);
  const [about, setAbout] = useState(451);
  const [seam, setSeam] = useState(712);
  const [prog, setProg] = useState(712);

  useLayoutEffect(() => {
    const wrap = root.current?.parentElement;
    if (!wrap) return;
    const audienceEl = wrap.querySelector<HTMLElement>("#audience");
    const stadiumEl = wrap.querySelector<HTMLElement>(
      "#audience [data-stadium]",
    );
    const programEl = wrap.querySelector<HTMLElement>("#program");
    if (!audienceEl || !stadiumEl || !programEl) return;

    const update = () => {
      setAbout(audienceEl.offsetTop + stadiumEl.offsetHeight);
      setSeam(audienceEl.offsetTop + audienceEl.offsetHeight);
      setProg(programEl.offsetTop);
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(audienceEl);
    observer.observe(stadiumEl);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[3] overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-[9000px] transform-gpu">
        <div
          style={{
            maskImage: `linear-gradient(180deg,transparent 0px,transparent ${Math.round(about * 0.63)}px,rgba(0,0,0,.45) ${Math.round(about * 0.82)}px,#000 ${about + 12}px,#000 100%)`,
            WebkitMaskImage: `linear-gradient(180deg,transparent 0px,transparent ${Math.round(about * 0.63)}px,rgba(0,0,0,.45) ${Math.round(about * 0.82)}px,#000 ${about + 12}px,#000 100%)`,
          }}
          className="absolute inset-0"
        >
          <div
            style={{
              backgroundImage: `linear-gradient(180deg,transparent 0px,transparent ${seam - 6}px,#0c141d ${seam}px,#0b121a ${seam + 450}px,#0a1119 ${prog + 900}px,#0a1119 100%)`,
            }}
            className="absolute inset-0"
          />

          <div
            style={{
              maskImage: `linear-gradient(180deg,transparent 0px,transparent ${seam}px,#000 ${seam + 190}px,#000 100%)`,
              WebkitMaskImage: `linear-gradient(180deg,transparent 0px,transparent ${seam}px,#000 ${seam + 190}px,#000 100%)`,
              backgroundImage: [
                `radial-gradient(560px 470px at 400px ${about + 32}px,rgba(112,164,236,.5) 0%,rgba(58,100,162,.28) 34%,rgba(22,40,66,.1) 64%,transparent 86%)`,
                `radial-gradient(300px 290px at 0px ${seam - 30}px,rgba(70,112,182,.3) 0%,rgba(28,52,86,.13) 46%,transparent 82%)`,
                `radial-gradient(520px 460px at 420px ${prog + 260}px,rgba(96,148,220,.34) 0%,rgba(50,88,144,.18) 36%,rgba(20,36,60,.07) 64%,transparent 88%)`,
                `radial-gradient(360px 340px at 20px ${prog + 800}px,rgba(64,104,170,.22) 0%,rgba(26,48,80,.1) 48%,transparent 84%)`,
                `radial-gradient(600px 520px at 20px ${prog + 1150}px,rgba(64,180,220,.16) 0%,rgba(28,86,110,.07) 44%,transparent 82%)`,
                `radial-gradient(640px 560px at 430px ${prog + 1820}px,rgba(96,148,220,.3) 0%,rgba(50,88,144,.14) 38%,transparent 84%)`,
                `radial-gradient(600px 540px at 0px ${prog + 2340}px,rgba(126,110,255,.18) 0%,rgba(52,46,110,.08) 44%,transparent 84%)`,
                `radial-gradient(620px 540px at 215px ${prog + 2760}px,rgba(63,224,176,.17) 0%,rgba(32,120,104,.07) 44%,transparent 84%)`,
                `radial-gradient(640px 560px at 400px ${prog + 3160}px,rgba(255,193,74,.14) 0%,rgba(150,110,50,.06) 42%,transparent 84%)`,
                `radial-gradient(620px 540px at 60px ${prog + 3620}px,rgba(96,148,220,.26) 0%,rgba(50,88,144,.12) 40%,transparent 84%)`,
                `radial-gradient(600px 520px at 400px ${prog + 4240}px,rgba(255,193,74,.11) 0%,rgba(150,110,50,.05) 42%,transparent 84%)`,
                `radial-gradient(640px 580px at 90px ${prog + 4665}px,rgba(96,148,220,.2) 0%,rgba(50,88,144,.09) 40%,transparent 84%)`,
                `radial-gradient(620px 560px at 400px ${prog + 5312}px,rgba(96,148,220,.22) 0%,rgba(50,88,144,.1) 40%,transparent 84%)`,
                `radial-gradient(600px 540px at 70px ${prog + 5931}px,rgba(96,148,220,.18) 0%,rgba(50,88,144,.08) 42%,transparent 84%)`,
              ].join(","),
            }}
            className="absolute inset-0"
          />
        </div>
      </div>
    </div>
  );
}
