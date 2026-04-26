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
      .query("titles")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    profileId: v.id("profiles"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const profile = await ctx.db.get(args.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Profile not found.");
    }
    if (!args.text || args.text.length < 1 || args.text.length > 200) {
      throw new Error("Title must be between 1 and 200 characters.");
    }
    return ctx.db.insert("titles", {
      userId,
      profileId: args.profileId,
      text: args.text,
      isActive: true,
      useCount: 0,
      createdAt: Date.now(),
    });
  },
});

export const createBatch = mutation({
  args: {
    profileId: v.id("profiles"),
    texts: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const profile = await ctx.db.get(args.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Profile not found.");
    }
    const texts = args.texts.slice(0, 50).filter((t) => t.length >= 1 && t.length <= 200);
    const ids = [];
    for (const text of texts) {
      const id = await ctx.db.insert("titles", {
        userId,
        profileId: args.profileId,
        text,
        isActive: true,
        useCount: 0,
        createdAt: Date.now(),
      });
      ids.push(id);
    }
    return ids;
  },
});

export const update = mutation({
  args: {
    id: v.id("titles"),
    text: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const title = await ctx.db.get(args.id);
    if (!title || title.userId !== userId) {
      throw new Error("Title not found.");
    }
    const updates: Record<string, unknown> = {};
    if (args.text !== undefined) updates.text = args.text;
    if (args.isActive !== undefined) updates.isActive = args.isActive;
    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("titles") },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const title = await ctx.db.get(args.id);
    if (!title || title.userId !== userId) {
      throw new Error("Title not found.");
    }
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const toggleActive = mutation({
  args: { id: v.id("titles") },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const title = await ctx.db.get(args.id);
    if (!title || title.userId !== userId) {
      throw new Error("Title not found.");
    }
    await ctx.db.patch(args.id, { isActive: !title.isActive });
    return args.id;
  },
});
