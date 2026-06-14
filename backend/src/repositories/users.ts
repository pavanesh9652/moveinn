import { pool } from '../db/pool.js';

export const PROFILE_MENU = [
  { id: 'saved', label: 'Saved properties', icon: 'heart-outline' },
  { id: 'inquiries', label: 'Inquiries', icon: 'chatbubble-outline' },
  { id: 'reviews', label: 'My reviews', icon: 'document-text-outline' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications-outline' },
  { id: 'settings', label: 'Settings', icon: 'settings-outline' },
  { id: 'help', label: 'Help & support', icon: 'help-circle-outline' },
] as const;

type UserRow = {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  initial: string;
  verified_since: string;
};

export async function getUserProfile(userId: string) {
  const userResult = await pool.query<UserRow>(
    `SELECT id, name, email, mobile, initial, verified_since
     FROM users
     WHERE id = $1`,
    [userId],
  );

  const user = userResult.rows[0];
  if (!user) {
    return null;
  }

  const [savedResult, inquiriesResult, reviewsResult] = await Promise.all([
    pool.query<{ listing_id: string }>(
      'SELECT listing_id FROM saved_listings WHERE user_id = $1 ORDER BY saved_at DESC',
      [user.id],
    ),
    pool.query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM inquiries WHERE user_id = $1',
      [user.id],
    ),
    pool.query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM reviews WHERE user_id = $1',
      [user.id],
    ),
  ]);

  const savedCount = savedResult.rowCount ?? 0;
  const inquiriesCount = Number(inquiriesResult.rows[0]?.count ?? 0);
  const reviewsCount = Number(reviewsResult.rows[0]?.count ?? 0);

  const profileMenu = PROFILE_MENU.map((item) => {
    if (item.id === 'saved') return { ...item, count: savedCount };
    if (item.id === 'inquiries') return { ...item, count: inquiriesCount };
    if (item.id === 'reviews') return { ...item, count: reviewsCount };
    return item;
  });

  return {
    user: {
      name: user.name,
      email: user.email,
      mobile: user.mobile ?? undefined,
      initial: user.initial,
      verifiedSince: user.verified_since,
    },
    profileMenu,
    savedListingIds: savedResult.rows.map((row) => row.listing_id),
  };
}
