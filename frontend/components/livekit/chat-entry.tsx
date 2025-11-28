import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ChatEntryProps extends React.HTMLAttributes<HTMLLIElement> {
  /** The locale to use for the timestamp. */
  locale: string;
  /** The timestamp of the message. */
  timestamp: number;
  /** The message to display. */
  message: string;
  /** The origin of the message. */
  messageOrigin: 'local' | 'remote';
  /** The sender's name. */
  name?: string;
  /** Whether the message has been edited. */
  hasBeenEdited?: boolean;
}

export const ChatEntry = ({
  name,
  locale,
  timestamp,
  message,
  messageOrigin,
  hasBeenEdited = false,
  className,
  ...props
}: ChatEntryProps) => {
  const time = new Date(timestamp);
  const title = time.toLocaleTimeString(locale, { timeStyle: 'full' });

  return (
    <li
      title={title}
      data-lk-message-origin={messageOrigin}
      className={cn('group flex w-full flex-col gap-2 mb-4', className)}
      {...props}
    >
      <header
        className={cn(
          'flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase',
          messageOrigin === 'local' ? 'flex-row-reverse text-cyan-400' : 'flex-row text-purple-400'
        )}
      >
        {messageOrigin === 'local' ? 'You' : 'Game Master'}
        <span className="opacity-0 transition-opacity ease-linear group-hover:opacity-50 text-[10px] text-white/50">
          {time.toLocaleTimeString(locale, { timeStyle: 'short' })}
        </span>
      </header>
      <div
        className={cn(
          'relative px-6 py-4 text-base leading-relaxed backdrop-blur-md shadow-lg transition-all duration-300',
          messageOrigin === 'local'
            ? 'bg-cyan-950/40 text-cyan-50 ml-auto rounded-2xl rounded-tr-none border border-cyan-500/30 border-r-4 border-r-cyan-400 max-w-[80%] hover:bg-cyan-900/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]'
            : 'bg-purple-950/60 text-purple-50 mr-auto rounded-2xl rounded-tl-none border border-purple-500/30 border-l-4 border-l-purple-500 max-w-[90%] font-serif tracking-wide hover:bg-purple-900/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]'
        )}
      >
        {message}
      </div>
    </li>
  );
};
