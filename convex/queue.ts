import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAuth } from "./auth";

export const list = query({
  args: {
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    let query_ = ctx.db
      .query("queue")
      .withIndex("by_user_scheduled", (q) => q.eq("userId", userId));

    const items = await query_.order("asc").collect();

    let filtered = items;
    if (args.status) {
      filtered = items.filter((i) => i.status === args.status);
    }

    const limit = args.limit ?? 50;
    return filtered.slice(0, limit);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    const items = await ctx.db
      .query("queue")
      .withIndex("by_user_status", (q) => q.eq("userId", userId))
      .collect();

    return {
      totalQueued: items.filter((i) => i.status === "queued").length,
      totalUploading: items.filter((i) => i.status === "uploading").length,
      totalCompleted: items.filter((i) => i.status === "completed").length,
      totalFailed: items.filter((i) => i.status === "failed").length,
    };
  },
});

export const add = mutation({
  args: {
    profileId: v.id("profiles"),
    driveFileId: v.string(),
    driveFileName: v.string(),
    title: v.string(),
    thumbnailFileId: v.optional(v.string()),
    scheduledTime: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const profile = await ctx.db.get(args.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Profile not found.");
    }

    return ctx.db.insert("queue", {
      userId,
      profileId: args.profileId,
      profileName: profile.name,
      driveFileId: args.driveFileId,
      driveFileName: args.driveFileName,
      title: args.title,
      thumbnailFileId: args.thumbnailFileId,
      youtubeVideoId: undefined,
      status: "queued",
      errorMessage: undefined,
      scheduledTime: args.scheduledTime,
      startedAt: undefined,
      completedAt: undefined,
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("queue"),
    status: v.string(),
    errorMessage: v.optional(v.string()),
    youtubeVideoId: v.optional(v.string()),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== userId) {
      throw new Error("Queue item not found.");
    }

    const updates: Record<string, unknown> = { status: args.status };
    if (args.errorMessage !== undefined) updates.errorMessage = args.errorMessage;
    if (args.youtubeVideoId !== undefined) updates.youtubeVideoId = args.youtubeVideoId;
    if (args.startedAt !== undefined) updates.startedAt = args.startedAt;
    if (args.completedAt !== undefined) updates.completedAt = args.completedAt;

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("queue") },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== userId) {
      throw new Error("Queue item not found.");
    }
    if (item.status === "uploading") {
      throw new Error("Cannot remove an item that is currently uploading.");
    }
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const clearCompleted = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    const items = await ctx.db
      .query("queue")
      .withIndex("by_user_status", (q) => q.eq("userId", userId))
      .collect();

    const completed = items.filter((i) => i.status === "completed");
    for (const item of completed) {
      await ctx.db.delete(item._id);
    }
    return completed.length;
  },
});
