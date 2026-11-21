// Conferência dos dados do checkout, a mesma na tela e no servidor: a tela
// mostra os erros, e o servidor repete a conferência antes de chamar o Asaas
// (a tela é conveniência, não proteção).

import {
  cartaoValido,
  cepValido,
  cnpjValido,
  codigoValido,
  cpfValido,
  emailValido,
  nomeCompletoValido,
  validadeValida,
  whatsAppValido,
} from "./campos";
import type { Forma } from "./pedido";

export const dadosVazios = {
  whatsapp: "",
  email: "",
  cnpj: "",
  cpf: "",
  empresa: "",
  nome: "",
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
  indicacao: "",
};
export type Dados = typeof dadosVazios;

export const cartaoVazio = { numero: "", nome: "", validade: "", codigo: "" };
export type Cartao = typeof cartaoVazio;

/** Erros por campo (a chave é o id do campo na tela). Vazio quando está tudo certo. */
export function validarDados(d: Dados, c: Cartao, semCnpj: boolean, forma: Forma) {
  const e: Record<string, string> = {};
  if (!whatsAppValido(d.whatsapp)) e.whatsapp = "Informe o WhatsApp com o DDD.";
  if (!emailValido(d.email)) e.email = "Informe um e-mail válido.";
  if (semCnpj) {
    if (!cpfValido(d.cpf)) e.cpf = "Confira o CPF.";
  } else {
    if (!cnpjValido(d.cnpj)) e.cnpj = "Confira o CNPJ.";
    if (d.empresa.trim().length < 2) e.empresa = "Informe o nome da empresa.";
  }
  if (!nomeCompletoValido(d.nome)) e.nome = "Informe o seu nome completo.";
  if (!cepValido(d.cep)) e.cep = "Informe o CEP.";
  if (!d.numero.trim()) e.numero = "Informe o número (ou SN).";
  if (!d.endereco.trim()) e.endereco = "Informe o endereço.";
  if (!d.bairro.trim()) e.bairro = "Informe o bairro.";
  if (!d.cidade.trim()) e.cidade = "Informe a cidade.";
  if (!d.uf) e.uf = "Escolha o estado.";
  if (forma === "cartao") {
    if (!cartaoValido(c.numero)) e["cartao-numero"] = "Confira o número do cartão.";
    if (c.nome.trim().length < 3) e["cartao-nome"] = "Informe o nome como está no cartão.";
    if (!validadeValida(c.validade)) e["cartao-validade"] = "Confira a validade.";
    if (!codigoValido(c.codigo)) e["cartao-codigo"] = "Confira o código.";
  }
  return e;
}
