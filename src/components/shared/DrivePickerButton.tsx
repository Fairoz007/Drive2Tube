import { useGooglePicker } from '@/hooks/useGooglePicker';
import { Button } from '@/components/ui/button';
import { FolderOpen, FileVideo } from 'lucide-react';

interface DrivePickerButtonProps {
  onSelect: (id: string, name: string) => void;
  type: 'folder' | 'file';
  label?: string;
  className?: string;
}

export function DrivePickerButton({ onSelect, type, label, className }: DrivePickerButtonProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const appId = import.meta.env.VITE_GOOGLE_APP_ID || '';

  const { openPicker } = useGooglePicker({
    apiKey,
    clientId,
    appId,
    viewId: type === 'folder' ? 'FOLDERS' : 'DOCS',
    mimeTypes: type === 'file' ? 'video/*' : undefined,
    onSelect: (data) => {
      const document = data.docs[0];
      onSelect(document.id, document.name);
    },
  });

  const Icon = type === 'folder' ? FolderOpen : FileVideo;

  return (
    <Button
      type="button"
      onClick={openPicker}
      variant="outline"
      className={`flex items-center gap-2 ${className}`}
      disabled={!apiKey || !clientId}
    >
      <Icon size={16} />
      {label || `Select ${type === 'folder' ? 'Folder' : 'File'}`}
    </Button>
  );
}
