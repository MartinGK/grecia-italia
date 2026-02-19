type MapsLinkProps = {
  url: string;
  label?: string;
  className?: string;
};

export default function MapsLink({ url, label = 'Abrir en Google Maps', className = '' }: MapsLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`travel-button border border-slate-300 bg-white/80 text-slate-700 hover:border-slate-400 hover:text-slate-900 ${className}`}
    >
      {label}
    </a>
  );
}
