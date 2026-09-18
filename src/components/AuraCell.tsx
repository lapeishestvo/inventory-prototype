import type { ReactNode } from 'react';

type AuraCellProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  accessory?: ReactNode;
  onClick?: () => void;
};

/** Aura medium cell with optional leading and trailing content. */
export function AuraCell({ icon, title, description, accessory, onClick }: AuraCellProps) {
  return (
    <button className="aura-cell" type="button" onClick={onClick}>
      {icon && <div className="aura-cell__icon">{icon}</div>}
      <div className="aura-cell__copy">
        <div className="aura-cell__title">{title}</div>
        {description && <div className="aura-cell__description">{description}</div>}
      </div>
      {accessory && <div className="aura-cell__accessory">{accessory}</div>}
    </button>
  );
}
