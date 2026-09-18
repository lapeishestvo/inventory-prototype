type AuraHeaderProps = {
  title: string;
  subtitle: string;
  horizontal?: boolean;
};

/** Section header matching the Aura medium header used in the source design. */
export function AuraHeader({ title, subtitle, horizontal = false }: AuraHeaderProps) {
  return (
    <header className={`aura-header${horizontal ? ' aura-header--horizontal' : ''}`}>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </header>
  );
}
