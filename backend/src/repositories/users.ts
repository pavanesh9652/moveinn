import { getDb } from '../db/mongo.js';
import type { SavedListingDoc, UserDoc } from '../db/types.js';

export const PROFILE_MENU = [
  { id: 'saved', label: 'Saved properties', icon: 'heart-outline' },
  { id: 'inquiries', label: 'Inquiries', icon: 'chatbubble-outline' },
  { id: 'reviews', label: 'My reviews', icon: 'document-text-outline' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications-outline' },
  { id: 'settings', label: 'Settings', icon: 'settings-outline' },
  { id: 'help', label: 'Help & support', icon: 'help-circle-outline' },
] as const;

export async function getUserProfile(userId: string) {
  const db = await getDb();

  const user = await db.collection<UserDoc>('users').findOne(
    { _id: userId },
    { projection: { name: 1, email: 1, mobile: 1, initial: 1, verifiedSince: 1 } },
  );

  if (!user) {
    return null;
  }

  const [savedListings, inquiriesCount, reviewsCount] = await Promise.all([
    db
      .collection<SavedListingDoc>('saved_listings')
      .find({ userId })
      .sort({ savedAt: -1 })
      .project({ listingId: 1 })
      .toArray(),
    db.collection('inquiries').countDocuments({ userId }),
    db.collection('reviews').countDocuments({ userId }),
  ]);

  const profileMenu = PROFILE_MENU.map((item) => {
    if (item.id === 'saved') return { ...item, count: savedListings.length };
    if (item.id === 'inquiries') return { ...item, count: inquiriesCount };
    if (item.id === 'reviews') return { ...item, count: reviewsCount };
    return item;
  });

  return {
    user: {
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      initial: user.initial,
      verifiedSince: user.verifiedSince,
    },
    profileMenu,
    savedListingIds: savedListings.map((row) => row.listingId),
  };
}
