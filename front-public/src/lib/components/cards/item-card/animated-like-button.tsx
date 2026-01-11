import { IconHeartFilled, IconHeart } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconButton } from '@/lib/primitives/icon-button';

interface AnimatedLikeButtonProps {
  isLiked: boolean;
  toggleLike: (e: React.MouseEvent) => void;
  size?: 'sm' | 'md';
  iconSize?: number;
}

export function AnimatedLikeButton({ isLiked, toggleLike, size = 'md', iconSize = 16 }: AnimatedLikeButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <IconButton
        icon={
          <AnimatePresence mode="wait" initial={false}>
            {isLiked ? (
              <motion.div key="filled" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
                <IconHeartFilled size={iconSize} className="text-rose-500" />
              </motion.div>
            ) : (
              <motion.div key="outline" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
                <IconHeart size={iconSize} className="text-gray-500" />
              </motion.div>
            )}
          </AnimatePresence>
        }
        variant="overlay"
        size={size}
        onClick={handleClick}
        ariaLabel={isLiked ? 'Remove from favorites' : 'Add to favorites'}
      />
    </motion.div>
  );
}
