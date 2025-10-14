import { LegacyAngularJSWrapper } from "@/components/legacy/LegacyAngularJSWrapper";

// Componente de rota que decide entre React ou Legacy
interface LegacyRouteProps {
  screen: string;
}

export function LegacyRoute({ screen }: LegacyRouteProps) {
  return <LegacyAngularJSWrapper screen={screen} />;
}