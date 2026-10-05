import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const reactions = pgTable('reactions', {
    id: serial('id').primaryKey(),
    postSlug: text('post_slug').notNull(),
    emoji: text('emoji').notNull(),
    count: integer('count').notNull().default(0),
    actionType: text('actionType').notNull(),
});
