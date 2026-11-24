// Os fatos curtos que aparecem no desenho: nada de texto cru da pessoa.

/** "Mais de 250 famílias atendidas" vira ["Mais de 250", "famílias atendidas"]. */
export function numeroEmPartes(texto: string): [string, string] {
  const limpo = texto.trim();
  const achado = limpo.match(/^((?:mais de |quase |cerca de )?\+?[\d.,]+\s?[%+]?)\s*(.*)$/i);
  return achado ? [achado[1].trim(), achado[2]] : [limpo, ""];
}
