import { CreditCardIcon, HashIcon, MailCheckIcon, MapPinIcon, WalletIcon, type LucideIcon } from "lucide-react";

import type { GuiaSlug } from "@/config/ajuda-enderecos";

export const iconeDoGuia: Record<GuiaSlug, LucideIcon> = {
  "aceitar-convite": MailCheckIcon,
  "configurar-pagamento": CreditCardIcon,
  "id-da-conta": HashIcon,
  "acesso-ao-perfil": MapPinIcon,
  "adicionar-saldo": WalletIcon,
};
