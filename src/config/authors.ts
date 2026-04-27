/**
 * authors.ts — Single source of truth for all team member data.
 *
 * To add/rename/update an author:
 *   1. Edit this file only.
 *   2. Everything else (schema, byline, About page, author pages) updates automatically.
 *
 * To map a WordPress user to an author, set `wpUserId` to the WP user's numeric ID.
 * If not set, posts are assigned by rotation (post.id % authors.length).
 */

export interface Author {
  /** URL-safe slug, used for /author/[slug] pages */
  id: string;
  name: string;
  role: string;
  /** Full bio shown on /author/[slug] page and article bio section */
  bio: string;
  /** Short one-liner shown in byline tooltip / post cards */
  shortBio: string;
  /** Avatar image URL — use DiceBear for consistent illustrated style */
  avatar: string;
  /** Topics this author specializes in */
  expertise: string[];
  /** Optional: WordPress numeric user ID for exact post-to-author mapping */
  wpUserId?: number;
  social?: {
    twitter?: string;
    linkedin?: string;
  };
}

export const AUTHORS: Author[] = [
  {
    id: 'alex-carter',
    name: 'Alex Carter',
    role: 'Research Lead',
    bio: 'Alex leads product research at Aura Home Office. Every buying guide starts here — with specs, dimensions, weight capacity, frame design, warranty terms, and the kind of detail that most lists skip entirely. Alex believes a bad spec comparison wastes more money than a bad purchase decision.',
    shortBio: 'Product research and spec analysis',
    avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=AlexCarter&backgroundColor=e8e0d5&radius=50',
    expertise: ['Standing Desks', 'Monitor Arms', 'Cable Management', 'Desk Accessories'],
    // wpUserId: 1, // set once you know the WP user ID
    social: {
      twitter: 'aurahomeoffice',
      linkedin: 'aura-home-office',
    },
  },
  {
    id: 'jordan-lee',
    name: 'Jordan Lee',
    role: 'Workspace Fit Specialist',
    bio: 'Jordan focuses on the real-world side of home office gear: how it fits into small rooms, apartments, and shared spaces. That means room dimensions, cable clutter, aesthetics, lighting, and whether something actually improves your daily routine — or just looks good in a photo.',
    shortBio: 'Home office fit and ergonomics',
    avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=JordanLee&backgroundColor=d5e0e8&radius=50',
    expertise: ['Ergonomic Chairs', 'Desk Lighting', 'Storage Solutions', 'Small-Space Setups'],
    // wpUserId: 2,
    social: {
      twitter: 'aurahomeoffice',
      linkedin: 'aura-home-office',
    },
  },
  {
    id: 'morgan-davis',
    name: 'Morgan Davis',
    role: 'Editorial Lead',
    bio: 'Morgan turns the research into practical buying guides. That means clear verdicts, honest trade-off summaries, and articles that actually help someone make a better decision — not just rank for a keyword. Morgan also maintains Aura\'s editorial standards and transparency practices.',
    shortBio: 'Buying guides and editorial standards',
    avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=MorganDavis&backgroundColor=e8e5d5&radius=50',
    expertise: ['Buying Guides', 'Product Comparisons', 'Owner Feedback Analysis', 'Editorial Standards'],
    // wpUserId: 3,
    social: {
      twitter: 'aurahomeoffice',
      linkedin: 'aura-home-office',
    },
  },
];

/**
 * Assign an author to a post deterministically.
 * Same post ID always returns the same author — no randomness.
 *
 * Priority:
 * 1. If post has a WP author ID that matches an AUTHORS entry's wpUserId → use that author
 * 2. Otherwise → rotate by post.id % AUTHORS.length
 */
export function getAuthorForPost(postId: number, wpAuthorId?: number): Author {
  if (wpAuthorId !== undefined) {
    const matched = AUTHORS.find((a) => a.wpUserId === wpAuthorId);
    if (matched) return matched;
  }
  return AUTHORS[postId % AUTHORS.length];
}

/**
 * Find an author by their slug (used in /author/[slug] pages)
 */
export function getAuthorBySlug(slug: string): Author | undefined {
  return AUTHORS.find((a) => a.id === slug);
}
