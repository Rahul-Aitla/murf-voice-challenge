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
          'flex items-center gap-2 text-xs font-bold tracking-wider uppercase',
          messageOrigin === 'local' ? 'flex-row-reverse text-gray-600' : 'flex-row text-black'
        )}
      >
        {messageOrigin === 'local' ? 'You' : 'Zudio Assistant'}
        <span className="opacity-0 transition-opacity ease-linear group-hover:opacity-50 text-[10px] text-gray-500">
          {time.toLocaleTimeString(locale, { timeStyle: 'short' })}
        </span>
      </header>
      <div
        className={cn(
          'relative px-5 py-4 text-base leading-relaxed transition-all duration-200',
          messageOrigin === 'local'
            ? 'bg-gray-100 text-black ml-auto max-w-[80%] border-l-4 border-black font-medium'
            : 'bg-black text-white mr-auto max-w-[90%] border-l-4 border-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]'
        )}
      >
        {message}
      </div>
    </li>
  );
};
