import { useTranslation } from '@hooks/useTranslation';
import { cn } from '@lib/utils';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useMemo, useState } from 'react';
import { ITEMS_PER_PAGE } from '@/lib/bangumi/constants';
import { GAMES } from '@/lib/games';
import type { BangumiUserCollection } from '@/types/bangumi';
import { BangumiCard } from './BangumiCard';

interface BangumiCollectionProps {
  userId?: string;
}

export function BangumiCollection(_props: BangumiCollectionProps) {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const items: BangumiUserCollection[] = GAMES;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const pageItems = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (items.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center py-8">
        <p className="text-muted-foreground">{t('bangumi.noItems')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentPage}
          className="grid desktop:grid-cols-4 grid-cols-3 gap-3 md:grid-cols-2"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {pageItems.map((item) => (
            <BangumiCard key={item.subject_id} item={item} />
          ))}
        </motion.div>
      </AnimatePresence>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label={t('pagination.prev')}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            &larr;
          </button>
          <span className="text-muted-foreground text-sm">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label={t('pagination.next')}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
