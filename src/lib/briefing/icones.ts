import {
  BookOpenIcon,
  BuildingIcon,
  CameraIcon,
  CarIcon,
  ClapperboardIcon,
  CreditCardIcon,
  FlameIcon,
  GemIcon,
  HandHeartIcon,
  HeartIcon,
  HomeIcon,
  ImageIcon,
  LightbulbIcon,
  LaughIcon,
  type LucideIcon,
  MessageSquareQuoteIcon,
  MountainIcon,
  PaletteIcon,
  PawPrintIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunIcon,
  UserIcon,
  UsersIcon,
  VideoIcon,
  WavesIcon,
  ZapIcon,
  BriefcaseIcon,
  BadgeCheckIcon,
  ReceiptIcon,
  CalendarClockIcon,
  MessageCircleIcon,
} from "lucide-react";

// Ícones das opções, pelo texto da opção. Sem ícone aqui, a opção aparece sem.

const porOpcao: Record<string, LucideIcon> = {
  // Como atende
  "No escritório": BuildingIcon,
  "Por vídeo ou telefone": VideoIcon,
  "Na casa do cliente": HomeIcon,
  "O cliente traz o cão até mim": CarIcon,
  Online: VideoIcon,
  // Quem defende
  "O trabalhador": UserIcon,
  "A empresa": BriefcaseIcon,
  "Os dois": UsersIcon,
  // Sensações
  Confiança: ShieldCheckIcon,
  Acolhimento: HandHeartIcon,
  Profissionalismo: BadgeCheckIcon,
  Calma: WavesIcon,
  Energia: ZapIcon,
  Alegria: LaughIcon,
  Cuidado: HeartIcon,
  Exclusividade: GemIcon,
  Clareza: LightbulbIcon,
  Ousadia: FlameIcon,
  // O material
  "O logo": PaletteIcon,
  "Fotos minhas": UserIcon,
  "Fotos do lugar": ImageIcon,
  "Fotos do trabalho": CameraIcon,
  "Fotos da equipe": UsersIcon,
  Vídeos: ClapperboardIcon,
  "Depoimentos de clientes": MessageSquareQuoteIcon,
  "Ainda não tenho nada": MountainIcon,
  // O que facilita fechar
  "Parcela no cartão": CreditCardIcon,
  "Primeira conversa sem custo": MessageCircleIcon,
  "Atendimento no mesmo dia": CalendarClockIcon,
  "Nota fiscal": ReceiptIcon,
  Garantia: ShieldCheckIcon,
  // Cores
  "Tenho e sei quais são": PaletteIcon,
  "Tenho, estão no meu logo": ImageIcon,
  "Ainda não tenho": SparklesIcon,
  "Tenho um manual da marca": BookOpenIcon,
  "Manual da marca": BookOpenIcon,
};

export const iconeDaOpcao = (opcao: string): LucideIcon | undefined => porOpcao[opcao];

/** O ícone do negócio, no desenho da página. */
export const iconesDoNegocio = { balanca: ScaleIcon, pata: PawPrintIcon, sol: SunIcon } satisfies Record<string, LucideIcon>;
export type IconeDoNegocio = keyof typeof iconesDoNegocio;
