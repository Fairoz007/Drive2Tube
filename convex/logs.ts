import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAuth } from "./auth";

export const list = query({
  args: {
    limit: v.optional(v.number()),
    profileId: v.optional(v.id("profiles")),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    let items = await ctx.db
      .query("uploadLogs")
      .withIndex("by_user_created", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    if (args.profileId) {
      items = items.filter((i) => i.profileId === args.profileId);
    }

    const limit = args.limit ?? 100;
    return items.slice(0, limit);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    const items = await ctx.db
      .query("uploadLogs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const successful = items.filter((i) => i.status === "success");
    const totalDuration = successful.reduce((sum, i) => sum + (i.duration ?? 0), 0);

    return {
      totalUploads: items.length,
      successfulUploads: successful.length,
      failedUploads: items.filter((i) => i.status === "failed").length,
      avgDuration: successful.length > 0 ? Math.round(totalDuration / successful.length) : 0,
    };
  },
});

export const create = mutation({
  args: {
    profileId: v.id("profiles"),
    profileName: v.string(),
    queueItemId: v.id("queue"),
    driveFileName: v.string(),
    title: v.string(),
    status: v.string(),
    errorMessage: v.optional(v.string()),
    youtubeVideoId: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    return ctx.db.insert("uploadLogs", {
      userId,
      profileId: args.profileId,
      profileName: args.profileName,
      queueItemId: args.queueItemId,
      driveFileName: args.driveFileName,
      title: args.title,
      status: args.status,
      errorMessage: args.errorMessage,
      youtubeVideoId: args.youtubeVideoId,
      duration: args.duration,
      createdAt: Date.now(),
    });
  },
});
