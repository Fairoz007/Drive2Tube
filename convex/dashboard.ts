import { query } from "./_generated/server";
import { requireAuth } from "./auth";

export const getOverview = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);

    // Get profiles
    const profiles = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Get queue items
    const queueItems = await ctx.db
      .query("queue")
      .withIndex("by_user_status", (q) => q.eq("userId", userId))
      .collect();

    // Get recent logs
    const recentLogs = await ctx.db
      .query("uploadLogs")
      .withIndex("by_user_created", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);

    // Get settings
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    // Calculate today's uploads (since midnight UTC)
    const midnightUtc = new Date();
    midnightUtc.setUTCHours(0, 0, 0, 0);
    const todayStart = midnightUtc.getTime();

    const todayLogs = recentLogs.filter((l) => l.createdAt >= todayStart);
    const totalUploadsToday = todayLogs.length;
    const maxDailyUploads = settings?.maxDailyUploads ?? 5;
    const uploadsRemainingToday = Math.max(0, maxDailyUploads - totalUploadsToday);

    // Build today's schedule from active profiles
    const todaysSchedule = [];
    const activeProfiles = profiles.filter((p) => p.isActive);
    for (const profile of activeProfiles) {
      for (const time of profile.scheduleTimes) {
        const [hours, minutes] = time.split(":").map(Number);
        const scheduleTime = new Date();
        scheduleTime.setUTCHours(hours, minutes, 0, 0);
        const scheduleTimestamp = scheduleTime.getTime();

        // Check if there's a queue item for this profile around this time
        const scheduledItem = queueItems.find(
          (q) =>
            q.profileId === profile._id &&
            Math.abs(q.scheduledTime - scheduleTimestamp) < 60000
        );

        todaysSchedule.push({
          profileName: profile.name,
          scheduledTime: time,
          status: scheduledItem?.status ?? "pending",
        });
      }
    }

    // Sort schedule by time
    todaysSchedule.sort((a, b) => {
      const [aH, aM] = a.scheduledTime.split(":").map(Number);
      const [bH, bM] = b.scheduledTime.split(":").map(Number);
      return aH * 60 + aM - (bH * 60 + bM);
    });

    // Upload trend (last 7 days)
    const uploadTrend = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setUTCDate(dayStart.getUTCDate() - i);
      dayStart.setUTCHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

      const dayLogs = recentLogs.filter(
        (l) => l.createdAt >= dayStart.getTime() && l.createdAt < dayEnd.getTime()
      );
      uploadTrend.push({
        date: dayStart.toLocaleDateString("en-US", { weekday: "short" }),
        uploads: dayLogs.length,
      });
    }

    return {
      totalProfiles: profiles.length,
      activeProfiles: activeProfiles.length,
      totalUploadsToday,
      uploadsRemainingToday,
      queueStats: {
        queued: queueItems.filter((i) => i.status === "queued").length,
        uploading: queueItems.filter((i) => i.status === "uploading").length,
        completed: queueItems.filter((i) => i.status === "completed").length,
        failed: queueItems.filter((i) => i.status === "failed").length,
      },
      recentLogs,
      todaysSchedule: todaysSchedule.slice(0, 10),
      uploadTrend,
      autoUploadEnabled: settings?.autoUploadEnabled ?? false,
    };
  },
});
