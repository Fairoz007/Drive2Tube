import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAuth } from "./auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!settings) {
      return {
        userId,
        googleDriveConnected: false,
        youtubeConnected: false,
        autoUploadEnabled: false,
        maxDailyUploads: 5,
        timezone: "UTC",
        theme: "dark",
        notifyOnComplete: true,
        notifyOnFail: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }
    return settings;
  },
});

export const upsert = mutation({
  args: {
    googleDriveConnected: v.optional(v.boolean()),
    youtubeConnected: v.optional(v.boolean()),
    autoUploadEnabled: v.optional(v.boolean()),
    maxDailyUploads: v.optional(v.number()),
    timezone: v.optional(v.string()),
    notifyOnComplete: v.optional(v.boolean()),
    notifyOnFail: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    const now = Date.now();
    const updates: {
      updatedAt: number;
      googleDriveConnected?: boolean;
      youtubeConnected?: boolean;
      autoUploadEnabled?: boolean;
      maxDailyUploads?: number;
      timezone?: string;
      notifyOnComplete?: boolean;
      notifyOnFail?: boolean;
    } = { updatedAt: now };
    if (args.googleDriveConnected !== undefined) updates.googleDriveConnected = args.googleDriveConnected;
    if (args.youtubeConnected !== undefined) updates.youtubeConnected = args.youtubeConnected;
    if (args.autoUploadEnabled !== undefined) updates.autoUploadEnabled = args.autoUploadEnabled;
    if (args.maxDailyUploads !== undefined) updates.maxDailyUploads = Math.min(Math.max(args.maxDailyUploads, 1), 20);
    if (args.timezone !== undefined) updates.timezone = args.timezone;
    if (args.notifyOnComplete !== undefined) updates.notifyOnComplete = args.notifyOnComplete;
    if (args.notifyOnFail !== undefined) updates.notifyOnFail = args.notifyOnFail;

    if (existing) {
      await ctx.db.patch(existing._id, updates);
      return existing._id;
    } else {
      return ctx.db.insert("settings", {
        userId,
        googleDriveConnected: updates.googleDriveConnected ?? false,
        youtubeConnected: updates.youtubeConnected ?? false,
        autoUploadEnabled: updates.autoUploadEnabled ?? false,
        maxDailyUploads: updates.maxDailyUploads ?? 5,
        timezone: updates.timezone ?? "UTC",
        theme: "dark",
        notifyOnComplete: updates.notifyOnComplete ?? true,
        notifyOnFail: updates.notifyOnFail ?? true,
        createdAt: now,
        ...updates,
      });
    }
  },
});
