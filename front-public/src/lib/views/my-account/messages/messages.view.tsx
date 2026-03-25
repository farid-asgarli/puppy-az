'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { IconInbox, IconSearch, IconChevronLeft } from '@tabler/icons-react';
import { Heading, Text } from '@/lib/primitives/typography';
import { cn } from '@/lib/external/utils';
import TransitionLink from '@/lib/components/transition-link';
import { Avatar } from '@/lib/components/avatar';
import { formatDateShort } from '@/lib/utils/date-utils';
import type { ConversationDto } from '@/lib/api/types/message.types';
import { messageService } from '@/lib/api/services/message.service';
import { useAuth } from '@/lib/hooks/use-auth';

const MessagesView = () => {
  const t = useTranslations('messages');
  const { getToken } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadConversations = async () => {
    try {
      const token = await getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const data = await messageService.getConversations(token);
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.otherPartyName.toLowerCase().includes(searchQuery.toLowerCase()) || conv.petAdTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <TransitionLink href="/my-account" className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
              <IconChevronLeft className="w-6 h-6" />
            </TransitionLink>

            <div className="flex-1">
              <Heading variant="page-title" className="text-2xl font-bold">
                {t('title')}
              </Heading>
              <Text variant="small" className="text-gray-600 mt-1">
                {t('subtitle')}
              </Text>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-50 rounded-full p-6 inline-block mb-6">
                <IconInbox className="w-16 h-16 text-gray-400" />
              </div>
              <Heading variant="subsection" className="text-gray-900 mb-3 text-xl font-semibold">
                {searchQuery ? t('noResultsTitle') : t('emptyTitle')}
              </Heading>
              <Text className="text-gray-500 mb-8 text-base">{searchQuery ? t('noResultsDescription') : t('emptyDescription')}</Text>
              {!searchQuery && (
                <TransitionLink
                  href="/ads/s"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-linear-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {t('browseAds')}
                </TransitionLink>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
            {filteredConversations.map((conversation) => (
              <ConversationItem key={conversation.id} conversation={conversation} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Conversation item component
const ConversationItem = ({ conversation }: { conversation: ConversationDto }) => {
  const hasUnread = conversation.unreadCount > 0;

  // Format relative time (you can improve this)
  const timeAgo = formatDateShort(conversation.lastMessageAt);

  return (
    <TransitionLink href={`/my-account/messages/${conversation.id}`} className="block p-4 hover:bg-gray-50 transition-colors">
      <div className="flex gap-4">
        {/* Avatar */}
        <Avatar src={conversation.otherPartyAvatar} name={conversation.otherPartyName} size="md" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <Heading variant="subsection" as="h4" className={cn('text-sm truncate', hasUnread && 'font-bold')}>
                {conversation.otherPartyName}
              </Heading>
              {hasUnread && (
                <div className="shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-bold">
                  {conversation.unreadCount}
                </div>
              )}
            </div>
            <Text variant="tiny" className="text-gray-500 shrink-0">
              {timeAgo}
            </Text>
          </div>

          <Text variant="small" className="text-gray-600 mb-1 truncate">
            {conversation.petAdTitle}
          </Text>

          <div className="flex items-center gap-1">
            {hasUnread && <span className="shrink-0 w-2 h-2 rounded-full bg-primary-600"></span>}
            <Text variant="small" className={cn('truncate', hasUnread ? 'font-semibold text-gray-900' : 'text-gray-500')}>
              {conversation.lastMessageContent}
            </Text>
          </div>
        </div>

        {/* Pet Ad Thumbnail */}
        {conversation.petAdImageUrl && (
          <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${conversation.petAdImageUrl}`}
              alt={conversation.petAdTitle}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </TransitionLink>
  );
};

export default MessagesView;
