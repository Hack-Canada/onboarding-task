/** External links — override with PUBLIC_* env vars in production */

export const SITE_URL =
  import.meta.env.PUBLIC_SITE_URL ?? 'https://hackcanada.ca';

/** Tally form — swap for Luma/Mailchimp when ready */
export const APPLY_URL =
  import.meta.env.PUBLIC_APPLY_URL ?? 'https://tally.so/r/w2QK1x';

export const APPLY_LABEL = 'Sign on for HC27';
