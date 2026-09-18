type AuraIconViewProps = {
  src: string;
};

/** Aura extra-small icon view used at the start of inventory rows. */
export function AuraIconView({ src }: AuraIconViewProps) {
  return (
    <span className="aura-icon-view">
      <img src={src} width="32" height="32" alt="" />
    </span>
  );
}
