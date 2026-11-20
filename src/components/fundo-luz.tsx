"use client";

import { useEffect, useRef } from "react";

// Luz fluida no fundo da hero, feita em WebGL no próprio site (no lugar da
// grade, a pedido do Lucas em 2026-11-20; a ideia do Unicorn Studio, sem custo
// e sem nada carregado de fora). Ruído em camadas, nas cores da marca, com um
// brilho que segue o mouse. Para quando sai da tela; com "reduzir animações",
// desenha um quadro só e fica parado. Sem WebGL 2, fica o degradê do CSS.

const VERTICE = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAGMENTO = `#version 300 es
precision highp float;
uniform vec2 r;
uniform float t;
uniform vec2 m;
uniform vec3 base;
uniform vec3 cor;
uniform vec3 tinta;
out vec4 o;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int k = 0; k < 5; k++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / r;
  vec2 asp = vec2(r.x / r.y, 1.0);
  vec2 p = uv * asp * 1.4;
  float tt = t * 0.035;
  vec2 q = vec2(fbm(p + tt), fbm(p + vec2(5.2, 1.3) - tt));
  vec2 w = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + tt * 1.4), fbm(p + 3.0 * q + vec2(8.3, 2.8)));
  float n = fbm(p + 3.0 * w);
  float d = distance(uv * asp, m * asp);
  float luz = exp(-d * d * 5.0) * 0.45;
  float k = clamp(smoothstep(0.42, 0.95, n) + luz, 0.0, 1.0);
  vec3 c = mix(base, cor, k * 0.6);
  c = mix(c, tinta, smoothstep(0.78, 1.0, n) * 0.1);
  c += (hash(gl_FragCoord.xy + fract(t)) - 0.5) * 0.02;
  c = mix(base, c, smoothstep(0.0, 0.35, uv.y));
  o = vec4(c, 1.0);
}`;

const CORES = {
  claro: { base: [0.945, 0.945, 0.945], cor: [1.0, 0.694, 0.0], tinta: [0.122, 0.153, 0.106] },
  escuro: { base: [0.075, 0.09, 0.067], cor: [1.0, 0.694, 0.0], tinta: [0.945, 0.945, 0.945] },
};

function compilar(gl: WebGL2RenderingContext, tipo: number, codigo: string) {
  const shader = gl.createShader(tipo)!;
  gl.shaderSource(shader, codigo);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "shader");
  return shader;
}

export function FundoLuz({ className }: { className?: string }) {
  const tela = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = tela.current;
    const gl = canvas?.getContext("webgl2", { antialias: false, premultipliedAlpha: false });
    if (!canvas || !gl) return;

    let programa: WebGLProgram;
    try {
      programa = gl.createProgram()!;
      gl.attachShader(programa, compilar(gl, gl.VERTEX_SHADER, VERTICE));
      gl.attachShader(programa, compilar(gl, gl.FRAGMENT_SHADER, FRAGMENTO));
      gl.linkProgram(programa);
      if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) return;
    } catch {
      return;
    }
    gl.useProgram(programa);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const local = gl.getAttribLocation(programa, "p");
    gl.enableVertexAttribArray(local);
    gl.vertexAttribPointer(local, 2, gl.FLOAT, false, 0, 0);
    const u = (nome: string) => gl.getUniformLocation(programa, nome);

    const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 0.5, y: 0.75, alvoX: 0.5, alvoY: 0.75 };
    let visivel = true;
    let quadro = 0;
    const inicio = performance.now();

    const aplicarCores = () => {
      const tema = document.documentElement.classList.contains("dark") ? CORES.escuro : CORES.claro;
      gl.uniform3fv(u("base"), tema.base);
      gl.uniform3fv(u("cor"), tema.cor);
      gl.uniform3fv(u("tinta"), tema.tinta);
    };
    const redimensionar = () => {
      // Meia resolução: a luz é suave, e assim pesa pouco no celular.
      const escala = Math.min(devicePixelRatio, 1.5) * 0.5;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * escala));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * escala));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u("r"), canvas.width, canvas.height);
    };
    const desenhar = () => {
      mouse.x += (mouse.alvoX - mouse.x) * 0.05;
      mouse.y += (mouse.alvoY - mouse.y) * 0.05;
      gl.uniform1f(u("t"), (performance.now() - inicio) / 1000);
      gl.uniform2f(u("m"), mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const laco = () => {
      desenhar();
      quadro = visivel ? requestAnimationFrame(laco) : 0;
    };

    aplicarCores();
    redimensionar();
    canvas.dataset.pronto = "";
    if (reduzido) desenhar();
    else quadro = requestAnimationFrame(laco);

    const aoMover = (e: PointerEvent) => {
      const caixa = canvas.getBoundingClientRect();
      mouse.alvoX = (e.clientX - caixa.left) / caixa.width;
      mouse.alvoY = 1 - (e.clientY - caixa.top) / caixa.height;
    };
    const tamanho = new ResizeObserver(() => {
      redimensionar();
      if (reduzido) desenhar();
    });
    const tema = new MutationObserver(() => {
      aplicarCores();
      if (reduzido) desenhar();
    });
    const presenca = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      if (visivel && !reduzido && !quadro) quadro = requestAnimationFrame(laco);
    });
    if (!reduzido) window.addEventListener("pointermove", aoMover, { passive: true });
    tamanho.observe(canvas);
    tema.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    presenca.observe(canvas);

    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("pointermove", aoMover);
      tamanho.disconnect();
      tema.disconnect();
      presenca.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_70%,color-mix(in_oklab,var(--brand)_22%,transparent),transparent)] ${className ?? ""}`}
    >
      <canvas ref={tela} data-fundo-luz className="size-full" />
    </div>
  );
}
