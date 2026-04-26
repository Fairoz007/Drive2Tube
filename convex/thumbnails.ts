import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAuth } from "./auth";

export const listByProfile = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const profile = await ctx.db.get(args.profileId);
    if (!profile || profile.userId !== userId) {
      return [];
    }
    return ctx.db
      .query("thumbnails")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    profileId: v.id("profiles"),
    fileName: v.string(),
    driveFileId: v.string(),
    mimeType: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const profile = await ctx.db.get(args.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Profile not found.");
    }
    return ctx.db.insert("thumbnails", {
      userId,
      profileId: args.profileId,
      fileName: args.fileName,
      driveFileId: args.driveFileId,
      mimeType: args.mimeType,
      isActive: true,
      useCount: 0,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("thumbnails") },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const thumbnail = await ctx.db.get(args.id);
    if (!thumbnail || thumbnail.userId !== userId) {
      throw new Error("Thumbnail not found.");
    }
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const toggleActive = mutation({
  args: { id: v.id("thumbnails") },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const thumbnail = await ctx.db.get(args.id);
    if (!thumbnail || thumbnail.userId !== userId) {
      throw new Error("Thumbnail not found.");
    }
    await ctx.db.patch(args.id, { isActive: !thumbnail.isActive });
    return args.id;
  },
});
