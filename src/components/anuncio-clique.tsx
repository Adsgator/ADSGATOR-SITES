import Image from "next/image";
import { CheckCheckIcon, SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import styles from "./anuncio-clique.module.css";

/**
 * Ilustração do que a Adsgator faz: o anúncio de um negócio aparece no
 * Google, recebe o clique (o cursor da marca, com os arcos de clique) e vira
 * conversa no WhatsApp. Laço de 8 s em CSS (anuncio-clique.module.css),
 * pausável pelo MotionScope.
 */
export function AnuncioClique({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Ilustração: o anúncio de um negócio aparece no Google, recebe um clique e vira uma conversa no WhatsApp."
      className={cn(styles.cena, "motion-loop", className)}
    >
      <div className={styles.janela}>
        <div className={styles.busca}>
          <SearchIcon className="size-4" />
          dentista perto de mim
        </div>
        <div className={styles.anuncio}>
          <p className="text-xs font-semibold">Patrocinado</p>
          <p className={styles.site}>
            <span className={styles.favicon}>S</span>
            seunegocio.com.br
          </p>
          <p className="mt-1.5 font-heading text-lg leading-snug">
            Seu Negócio · Atendimento hoje
          </p>
          <p className="mt-1 text-sm leading-snug text-muted-foreground">
            Agende pelo WhatsApp. Consulta de avaliação gratuita.
          </p>
          <span className={styles.onda} />
          <Image
            src="/brand/cursor.svg"
            alt=""
            width={34}
            height={51}
            unoptimized
            className={styles.cursor}
          />
        </div>
        <div className={styles.organico}>
          <span className={cn(styles.linha, "w-1/3")} />
          <span className={cn(styles.linha, "w-11/12")} />
          <span className={cn(styles.linha, "w-3/4")} />
        </div>
      </div>
      <div className={styles.balao}>
        <p className={styles.balaoTopo}>WhatsApp · agora</p>
        <p>Olá! Vi seu anúncio no Google. Vocês atendem hoje?</p>
        <CheckCheckIcon className={styles.lido} />
      </div>
    </div>
  );
}
