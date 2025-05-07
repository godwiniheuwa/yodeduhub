
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { uploadQuestionMedia } from '@/services/supabaseClient';
import { toast } from "@/hooks/use-toast";
import { Image, Music, Video, File, X } from "lucide-react";

interface MediaUploaderProps {
  quizId: string;
  questionId: string;
  initialMedia?: {
    image?: string;
    audio?: string;
    video?: string;
  };
  onMediaUpdate: (mediaType: 'image' | 'audio' | 'video', url: string | null) => void;
}

export function MediaUploader({ quizId, questionId, initialMedia, onMediaUpdate }: MediaUploaderProps) {
  const [mediaUrls, setMediaUrls] = useState({
    image: initialMedia?.image || null,
    audio: initialMedia?.audio || null,
    video: initialMedia?.video || null,
  });
  const [uploading, setUploading] = useState<'image' | 'audio' | 'video' | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, mediaType: 'image' | 'audio' | 'video') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(mediaType);
      
      try {
        const url = await uploadQuestionMedia(file, quizId, questionId, mediaType);
        
        if (url) {
          setMediaUrls(prev => ({ ...prev, [mediaType]: url }));
          onMediaUpdate(mediaType, url);
          toast({
            title: "Upload Successful",
            description: `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} uploaded successfully`,
          });
        } else {
          toast({
            title: "Upload Failed",
            description: `Failed to upload ${mediaType}`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(`Error uploading ${mediaType}:`, error);
        toast({
          title: "Upload Error",
          description: `Error uploading ${mediaType}. Please try again.`,
          variant: "destructive",
        });
      } finally {
        setUploading(null);
      }
    }
  };

  const handleRemoveMedia = (mediaType: 'image' | 'audio' | 'video') => {
    setMediaUrls(prev => ({ ...prev, [mediaType]: null }));
    onMediaUpdate(mediaType, null);
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <Tabs defaultValue="image">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="image" className="flex items-center gap-2 w-1/3">
              <Image className="h-4 w-4" /> Image
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2 w-1/3">
              <Music className="h-4 w-4" /> Audio
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2 w-1/3">
              <Video className="h-4 w-4" /> Video
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="image">
            <div className="space-y-4">
              {mediaUrls.image ? (
                <div className="relative">
                  <img 
                    src={mediaUrls.image} 
                    alt="Question image" 
                    className="max-h-60 w-auto mx-auto rounded-md"
                  />
                  <Button 
                    size="icon" 
                    variant="destructive"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => handleRemoveMedia('image')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="image-upload">Upload Image</Label>
                  <Input 
                    id="image-upload" 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'image')}
                    disabled={uploading !== null}
                  />
                  <p className="text-xs text-muted-foreground">
                    Supported formats: JPG, PNG, GIF, WebP
                  </p>
                </div>
              )}
              {uploading === 'image' && (
                <div className="text-center text-sm text-muted-foreground">
                  Uploading image...
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="audio">
            <div className="space-y-4">
              {mediaUrls.audio ? (
                <div className="relative">
                  <audio controls className="w-full">
                    <source src={mediaUrls.audio} />
                    Your browser does not support the audio element.
                  </audio>
                  <Button 
                    size="icon" 
                    variant="destructive"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => handleRemoveMedia('audio')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="audio-upload">Upload Audio</Label>
                  <Input 
                    id="audio-upload" 
                    type="file" 
                    accept="audio/*"
                    onChange={(e) => handleFileUpload(e, 'audio')}
                    disabled={uploading !== null}
                  />
                  <p className="text-xs text-muted-foreground">
                    Supported formats: MP3, WAV, OGG
                  </p>
                </div>
              )}
              {uploading === 'audio' && (
                <div className="text-center text-sm text-muted-foreground">
                  Uploading audio...
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="video">
            <div className="space-y-4">
              {mediaUrls.video ? (
                <div className="relative">
                  <video controls className="max-h-60 w-full">
                    <source src={mediaUrls.video} />
                    Your browser does not support the video element.
                  </video>
                  <Button 
                    size="icon" 
                    variant="destructive"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => handleRemoveMedia('video')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="video-upload">Upload Video</Label>
                  <Input 
                    id="video-upload" 
                    type="file" 
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, 'video')}
                    disabled={uploading !== null}
                  />
                  <p className="text-xs text-muted-foreground">
                    Supported formats: MP4, WebM, OGG
                  </p>
                </div>
              )}
              {uploading === 'video' && (
                <div className="text-center text-sm text-muted-foreground">
                  Uploading video...
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
