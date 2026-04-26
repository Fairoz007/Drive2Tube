import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { DrivePickerButton } from '@/components/shared/DrivePickerButton'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileVideo, Image as ImageIcon, Youtube, Send, CheckCircle2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

export function UploadPage() {
  const navigate = useNavigate()
  const profiles = useQuery(api.profiles.list)
  const addToQueue = useMutation(api.queue.create)

  const [form, setForm] = useState({
    profileId: '',
    videoFileId: '',
    videoFileName: '',
    thumbnailFileId: '',
    thumbnailFileName: '',
    title: '',
    description: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!form.profileId) return toast.error('Please select a profile')
    if (!form.videoFileId) return toast.error('Please select a video file')
    if (!form.title) return toast.error('Please enter a title')

    setIsSubmitting(true)
    try {
      await addToQueue({
        profileId: form.profileId as any,
        driveFileId: form.videoFileId,
        driveFileName: form.videoFileName,
        title: form.title,
        thumbnailFileId: form.thumbnailFileId || undefined,
        scheduledTime: Date.now(), // Upload immediately (or as soon as worker picks it up)
      })
      
      setIsSuccess(true)
      toast.success('Added to upload queue')
      setTimeout(() => navigate('/queue'), 2000)
    } catch (err: any) {
      toast.error(err.message || 'Failed to add to queue')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
          <CheckCircle2 size={48} className="text-green-500 animate-in zoom-in duration-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Upload Initiated!</h2>
        <p className="text-slate-400">Your video has been added to the queue and will start uploading shortly.</p>
        <Button onClick={() => navigate('/queue')} variant="outline" className="mt-4">
          View Queue
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Quick Upload</h1>
        <p className="text-slate-400 text-lg">Send a video from Google Drive to YouTube instantly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Step 1: Video Selection */}
          <Card className="p-6 bg-[#111D2E] border-[#2A3A52] space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileVideo size={20} className="text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">1. Select Video</h3>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 border border-[#2A3A52] border-dashed">
              <DrivePickerButton 
                type="file" 
                onSelect={(id, name) => setForm({ ...form, videoFileId: id, videoFileName: name })}
                label={form.videoFileId ? "Change Video" : "Pick from Drive"}
                className="shrink-0"
              />
              <div className="flex-1 min-w-0">
                {form.videoFileId ? (
                  <p className="text-sm font-medium text-blue-400 truncate">{form.videoFileName}</p>
                ) : (
                  <p className="text-sm text-slate-500 italic">No video selected yet</p>
                )}
              </div>
            </div>
          </Card>

          {/* Step 2: Metadata */}
          <Card className="p-6 bg-[#111D2E] border-[#2A3A52] space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Send size={20} className="text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">2. Video Details</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Video Title</label>
                <Input 
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter a catchy title for your video"
                  className="bg-[#0A1628] border-[#2A3A52] text-white h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Description (Optional)</label>
                <Textarea 
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Add a description to tell your viewers about the video..."
                  className="bg-[#0A1628] border-[#2A3A52] text-white min-h-[120px] resize-none"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-slate-300">Custom Thumbnail (Optional)</label>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-black/10 border border-[#2A3A52]">
                  <DrivePickerButton 
                    type="file" 
                    onSelect={(id, name) => setForm({ ...form, thumbnailFileId: id, thumbnailFileName: name })}
                    label={form.thumbnailFileId ? "Change Image" : "Pick Image"}
                    className="shrink-0 h-9"
                  />
                  <div className="flex-1 min-w-0">
                    {form.thumbnailFileId ? (
                      <p className="text-xs font-medium text-emerald-400 truncate">{form.thumbnailFileName}</p>
                    ) : (
                      <p className="text-xs text-slate-500">Auto-generated if left empty</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Step 3: Destination */}
          <Card className="p-6 bg-[#111D2E] border-[#2A3A52] space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Youtube size={20} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">3. Destination</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">YouTube Profile</label>
                <Select value={form.profileId} onValueChange={(val) => setForm({ ...form, profileId: val })}>
                  <SelectTrigger className="bg-[#0A1628] border-[#2A3A52] text-white h-11">
                    <SelectValue placeholder="Select channel profile" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A2744] border-[#2A3A52] text-white">
                    {profiles?.map((profile) => (
                      <SelectItem key={profile._id} value={profile._id}>
                        {profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <p className="text-[11px] text-blue-400/70 leading-relaxed italic">
                  Note: The video will be uploaded using the credentials associated with this profile. 
                  Make sure the profile is correctly linked to your YouTube channel.
                </p>
              </div>
            </div>
          </Card>

          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !form.videoFileId || !form.profileId || !form.title}
            className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Queueing...
              </>
            ) : (
              <>
                <Send size={20} className="mr-2" />
                Upload to YouTube
              </>
            )}
          </Button>

          <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest font-bold">
            Powered by Google APIs
          </p>
        </div>
      </div>
    </div>
  )
}
