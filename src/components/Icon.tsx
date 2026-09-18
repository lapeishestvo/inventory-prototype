type IconProps = {
  src: string;
  size?: number;
  alt?: string;
};

/** Fixed-size wrapper for exported Figma icon assets. */
export function Icon({ src, size = 24, alt = '' }: IconProps) {
  return <img className="asset-icon" src={src} width={size} height={size} alt={alt} />;
}
