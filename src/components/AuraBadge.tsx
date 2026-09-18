type AuraBadgeProps = {
  children: string;
  accent?: boolean;
  filled?: boolean;
};

/** Compact status badge matching the Aura medium badge. */
export function AuraBadge({ children, accent = false, filled = false }: AuraBadgeProps) {
  return <span className={`aura-badge${accent ? ' aura-badge--accent' : ''}${filled ? ' aura-badge--filled' : ''}`}>{children}</span>;
}
