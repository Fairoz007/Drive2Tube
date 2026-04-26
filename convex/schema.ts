import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
    userId: v.string(),
    name: v.string(),
    driveFolderId: v.string(),
    driveFolderName: v.string(),
    thumbnailFolderId: v.optional(v.string()),
    thumbnailFolderName: v.optional(v.string()),
    youtubeChannelId: v.optional(v.string()),
    youtubeChannelName: v.optional(v.string()),
    dailyUploadCount: v.number(),
    scheduleTimes: v.array(v.string()),
    useRandomTitle: v.boolean(),
    useRandomThumbnail: v.boolean(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_name", ["userId", "name"]),

  titles: defineTable({
    userId: v.string(),
    profileId: v.id("profiles"),
    text: v.string(),
    isActive: v.boolean(),
    useCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_profile", ["profileId"])
    .index("by_profile_active", ["profileId", "isActive"]),

  thumbnails: defineTable({
    userId: v.string(),
    profileId: v.id("profiles"),
    fileName: v.string(),
    driveFileId: v.string(),
    mimeType: v.string(),
    isActive: v.boolean(),
    useCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_profile", ["profileId"])
    .index("by_profile_active", ["profileId", "isActive"]),

  queue: defineTable({
    userId: v.string(),
    profileId: v.id("profiles"),
    profileName: v.string(),
    driveFileId: v.string(),
    driveFileName: v.string(),
    title: v.string(),
    thumbnailFileId: v.optional(v.string()),
    youtubeVideoId: v.optional(v.string()),
    status: v.string(),
    errorMessage: v.optional(v.string()),
    scheduledTime: v.number(),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user_status", ["userId", "status"])
    .index("by_user_scheduled", ["userId", "scheduledTime"]),

  uploadLogs: defineTable({
    userId: v.string(),
    profileId: v.id("profiles"),
    profileName: v.string(),
    queueItemId: v.id("queue"),
    driveFileName: v.string(),
    title: v.string(),
    status: v.string(),
    errorMessage: v.optional(v.string()),
    youtubeVideoId: v.optional(v.string()),
    duration: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_created", ["userId", "createdAt"]),

  settings: defineTable({
    userId: v.string(),
    googleDriveConnected: v.boolean(),
    youtubeConnected: v.boolean(),
    autoUploadEnabled: v.boolean(),
    maxDailyUploads: v.number(),
    timezone: v.string(),
    theme: v.string(),
    notifyOnComplete: v.boolean(),
    notifyOnFail: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),
});
