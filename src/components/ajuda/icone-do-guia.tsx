import {
  BarChart3Icon,
  CalendarClockIcon,
  CookieIcon,
  CreditCardIcon,
  FileCheckIcon,
  GavelIcon,
  HashIcon,
  MailCheckIcon,
  MapPinIcon,
  ReceiptTextIcon,
  SearchIcon,
  WalletIcon,
  WalletCardsIcon,
  type LucideIcon,
} from "lucide-react";

import type { GuiaSlug } from "@/config/ajuda-enderecos";

export const iconeDoGuia: Record<GuiaSlug, LucideIcon> = {
  "aceitar-convite": MailCheckIcon,
  "configurar-pagamento": CreditCardIcon,
  "id-da-conta": HashIcon,
  "acesso-ao-perfil": MapPinIcon,
  "adicionar-saldo": WalletIcon,
  "cartao-ou-pix": WalletCardsIcon,
  "verificacao-do-anunciante": FileCheckIcon,
  "resumo-do-mes": ReceiptTextIcon,
  "primeiros-dias": CalendarClockIcon,
  "nao-vejo-meu-anuncio": SearchIcon,
  metricas: BarChart3Icon,
  leilao: GavelIcon,
  "cookies-e-lgpd": CookieIcon,
};
