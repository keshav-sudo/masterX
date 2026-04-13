import Link from 'next/link';

export default function EmptyState({ icon = '🏠', title = 'Nothing here yet', description = 'Be the first to add something!', ctaLabel, ctaHref }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} className="btn-primary">{ctaLabel}</Link>
      )}
    </div>
  );
}
