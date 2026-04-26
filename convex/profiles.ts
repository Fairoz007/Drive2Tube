import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAuth } from "./auth";

// List all profiles for the authenticated user
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    return ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("asc")
      .collect();
  },
});

// Get a single profile by ID
export const get = query({
  args: { id: v.id("profiles") },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const profile = await ctx.db.get(args.id);
    if (!profile || profile.userId !== userId) {
      return null;
    }
    return profile;
  },
});

// Create a new profile
export const create = mutation({
  args: {
    name: v.string(),
    driveFolderId: v.string(),
    driveFolderName: v.string(),
    thumbnailFolderId: v.optional(v.string()),
    thumbnailFolderName: v.optional(v.string()),
    youtubeChannelId: v.optional(v.string()),
    youtubeChannelName: v.optional(v.string()),
    dailyUploadCount: v.optional(v.number()),
    scheduleTimes: v.optional(v.array(v.string())),
    useRandomTitle: v.optional(v.boolean()),
    useRandomThumbnail: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    if (!args.name || args.name.length < 1 || args.name.length > 100) {
      throw new Error("Profile name must be between 1 and 100 characters.");
    }

    const now = Date.now();
    return ctx.db.insert("profiles", {
      userId,
      name: args.name,
      driveFolderId: args.driveFolderId,
      driveFolderName: args.driveFolderName,
      thumbnailFolderId: args.thumbnailFolderId,
      thumbnailFolderName: args.thumbnailFolderName,
      youtubeChannelId: args.youtubeChannelId,
      youtubeChannelName: args.youtubeChannelName,
      dailyUploadCount: Math.min(Math.max(args.dailyUploadCount ?? 1, 1), 10),
      scheduleTimes: args.scheduleTimes ?? ["09:00"],
      useRandomTitle: args.useRandomTitle ?? false,
      useRandomThumbnail: args.useRandomThumbnail ?? false,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a profile
export const update = mutation({
  args: {
    id: v.id("profiles"),
    name: v.optional(v.string()),
    driveFolderId: v.optional(v.string()),
    driveFolderName: v.optional(v.string()),
    thumbnailFolderId: v.optional(v.string()),
    thumbnailFolderName: v.optional(v.string()),
    youtubeChannelId: v.optional(v.string()),
    youtubeChannelName: v.optional(v.string()),
    dailyUploadCount: v.optional(v.number()),
    scheduleTimes: v.optional(v.array(v.string())),
    useRandomTitle: v.optional(v.boolean()),
    useRandomThumbnail: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const profile = await ctx.db.get(args.id);
    if (!profile || profile.userId !== userId) {
      throw new Error("Profile not found.");
    }

    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.driveFolderId !== undefined) updates.driveFolderId = args.driveFolderId;
    if (args.driveFolderName !== undefined) updates.driveFolderName = args.driveFolderName;
    if (args.thumbnailFolderId !== undefined) updates.thumbnailFolderId = args.thumbnailFolderId;
    if (args.thumbnailFolderName !== undefined) updates.thumbnailFolderName = args.thumbnailFolderName;
    if (args.youtubeChannelId !== undefined) updates.youtubeChannelId = args.youtubeChannelId;
    if (args.youtubeChannelName !== undefined) updates.youtubeChannelName = args.youtubeChannelName;
    if (args.dailyUploadCount !== undefined) {
      updates.dailyUploadCount = Math.min(Math.max(args.dailyUploadCount, 1), 10);
    }
    if (args.scheduleTimes !== undefined) updates.scheduleTimes = args.scheduleTimes;
    if (args.useRandomTitle !== undefined) updates.useRandomTitle = args.useRandomTitle;
    if (args.useRandomThumbnail !== undefined) updates.useRandomThumbnail = args.useRandomThumbnail;

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

// Delete a profile and all associated data
export const remove = mutation({
  args: { id: v.id("profiles") },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const profile = await ctx.db.get(args.id);
    if (!profile || profile.userId !== userId) {
      throw new Error("Profile not found.");
    }

    // Delete associated titles
    const titles = await ctx.db
      .query("titles")
      .withIndex("by_profile", (q) => q.eq("profileId", args.id))
      .collect();
    for (const title of titles) {
      await ctx.db.delete(title._id);
    }

    // Delete associated thumbnails
    const thumbnails = await ctx.db
      .query("thumbnails")
      .withIndex("by_profile", (q) => q.eq("profileId", args.id))
      .collect();
    for (const thumbnail of thumbnails) {
      await ctx.db.delete(thumbnail._id);
    }

    // Delete associated queue items
    const queueItems = await ctx.db
      .query("queue")
      .withIndex("by_user_status", (q) => q.eq("userId", userId))
      .collect();
    for (const item of queueItems) {
      if (item.profileId === args.id) {
        await ctx.db.delete(item._id);
      }
    }

    // Delete the profile
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Toggle profile active status
export const toggleActive = mutation({
  args: { id: v.id("profiles") },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const profile = await ctx.db.get(args.id);
    if (!profile || profile.userId !== userId) {
      throw new Error("Profile not found.");
    }

    await ctx.db.patch(args.id, {
      isActive: !profile.isActive,
      updatedAt: Date.now(),
    });
    return args.id;
  },
});
