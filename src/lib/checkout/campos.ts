// Máscaras e checagens dos campos do checkout. Puras, sem dependência: a tela
// usa para ajudar quem preenche, e o servidor repete as mesmas checagens.

export const soDigitos = (valor: string) => valor.replace(/\D/g, "");

function aplicar(digitos: string, molde: string) {
  let i = 0;
  let saida = "";
  for (const c of molde) {
    if (i >= digitos.length) break;
    if (c === "0") saida += digitos[i++];
    else saida += c;
  }
  return saida;
}

export const mascaraCnpj = (v: string) => aplicar(soDigitos(v).slice(0, 14), "00.000.000/0000-00");
export const mascaraCpf = (v: string) => aplicar(soDigitos(v).slice(0, 11), "000.000.000-00");
export const mascaraCep = (v: string) => aplicar(soDigitos(v).slice(0, 8), "00000-000");
export const mascaraValidade = (v: string) => aplicar(soDigitos(v).slice(0, 4), "00/00");
export const mascaraCartao = (v: string) => aplicar(soDigitos(v).slice(0, 19), "0000 0000 0000 0000 000").trim();

export function mascaraWhatsApp(v: string) {
  const d = soDigitos(v).slice(0, 11);
  return d.length > 10 ? aplicar(d, "(00) 00000-0000") : aplicar(d, "(00) 0000-0000");
}

export function cpfValido(valor: string) {
  const d = soDigitos(valor);
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  const digito = (n: number) => {
    let soma = 0;
    for (let i = 0; i < n; i++) soma += Number(d[i]) * (n + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(9) === Number(d[9]) && digito(10) === Number(d[10]);
}

export function cnpjValido(valor: string) {
  const d = soDigitos(valor);
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  const digito = (n: number) => {
    const pesos = n === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = pesos.reduce((s, p, i) => s + p * Number(d[i]), 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  return digito(12) === Number(d[12]) && digito(13) === Number(d[13]);
}

export const emailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** Celular ou fixo com DDD (10 ou 11 dígitos). */
export const whatsAppValido = (v: string) => /^\d{10,11}$/.test(soDigitos(v));

export const cepValido = (v: string) => soDigitos(v).length === 8;

/** Nome e sobrenome, pelo menos. */
export const nomeCompletoValido = (v: string) => v.trim().split(/\s+/).filter((p) => p.length > 1).length >= 2;

/** Número do cartão pela conta de Luhn. */
export function cartaoValido(valor: string) {
  const d = soDigitos(valor);
  // Cartão de teste do Asaas (docs.asaas.com, "Testing Credit Card Payment"),
  // que não passa na conta; em produção o próprio Asaas recusa.
  if (d === "4444444444444444") return true;
  if (d.length < 13 || d.length > 19) return false;
  let soma = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    soma += n;
  }
  return soma % 10 === 0;
}

/** Validade MM/AA ainda não vencida. */
export function validadeValida(valor: string, agora = new Date()) {
  const d = soDigitos(valor);
  if (d.length !== 4) return false;
  const mes = Number(d.slice(0, 2));
  const ano = 2000 + Number(d.slice(2));
  if (mes < 1 || mes > 12) return false;
  const fimDoMes = new Date(ano, mes, 0, 23, 59, 59);
  return fimDoMes >= agora;
}

export const codigoValido = (v: string) => /^\d{3,4}$/.test(soDigitos(v));

export const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;
