"use client";

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Download, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import axios from 'axios';

interface StoryboardScene {
  imageUrl: string;
  description: string;
}

export default function StoryboardCreator() {
  const [sceneDescription, setSceneDescription] = useState('');
  const [storyboard, setStoryboard] = useState<StoryboardScene[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageStyle, setImageStyle] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [resolution, setResolution] = useState(720);
  const { toast } = useToast();

  const generateStoryboard = async () => {
    if (!sceneDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a scene description.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to Each Labs
      const response = await axios.post('https://api.eachlabs.ai/v1/workflows', {
        text: sceneDescription,
        style: imageStyle,
        aspectRatio,
        resolution,
      });
      
      const newScene: StoryboardScene = {
        imageUrl: response.data.imageUrl,
        description: sceneDescription,
      };
      setStoryboard([...storyboard, newScene]);
      setSceneDescription('');
      toast({
        title: "Success",
        description: "Scene added to storyboard successfully!",
      });
    } catch (error) {
      console.error('Error generating storyboard:', error);
      toast({
        title: "Error",
        description: "Failed to generate scene. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteScene = useCallback((index: number) => {
    setStoryboard(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Scene Deleted",
      description: "The scene has been removed from the storyboard.",
    });
  }, [toast]);

  const moveScene = useCallback((index: number, direction: 'up' | 'down') => {
    setStoryboard(prev => {
      const newStoryboard = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [newStoryboard[index], newStoryboard[newIndex]] = [newStoryboard[newIndex], newStoryboard[index]];
      return newStoryboard;
    });
  }, []);

  const exportStoryboard = useCallback(() => {
    const content = storyboard.map((scene, index) => 
      `Scene ${index + 1}:\n${scene.description}\n\n`
    ).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'storyboard.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Storyboard Exported",
      description: "Your storyboard has been exported as a text file.",
    });
  }, [storyboard, toast]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="imageStyle">Image Style</Label>
          <Select value={imageStyle} onValueChange={setImageStyle}>
            <SelectTrigger id="imageStyle">
              <SelectValue placeholder="Select image style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realistic">Realistic</SelectItem>
              <SelectItem value="cartoon">Cartoon</SelectItem>
              <SelectItem value="sketch">Sketch</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="aspectRatio">Aspect Ratio</Label>
          <Select value={aspectRatio} onValueChange={setAspectRatio}>
            <SelectTrigger id="aspectRatio">
              <SelectValue placeholder="Select aspect ratio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16:9">16:9</SelectItem>
              <SelectItem value="4:3">4:3</SelectItem>
              <SelectItem value="1:1">1:1</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="resolution">Resolution</Label>
          <Slider
            id="resolution"
            min={480}
            max={1080}
            step={120}
            value={[resolution]}
            onValueChange={(value) => setResolution(value[0])}
          />
          <p className="text-sm text-muted-foreground mt-1">{resolution}p</p>
        </div>
      </div>
      <Textarea
        placeholder="Enter your scene description here..."
        value={sceneDescription}
        onChange={(e) => setSceneDescription(e.target.value)}
        className="min-h-[100px]"
      />
      <Button onClick={generateStoryboard} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          'Add Scene to Storyboard'
        )}
      </Button>
      {storyboard.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {storyboard.map((scene, index) => (
              <Card key={index} className="p-2">
                <img src={scene.imageUrl} alt={`Scene ${index + 1}`} className="w-full h-auto" />
                <p className="mt-2 text-sm">{scene.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm font-bold">Scene {index + 1}</p>
                  <div className="flex space-x-2">
                    {index > 0 && (
                      <Button variant="outline" size="icon" onClick={() => moveScene(index, 'up')}>
                        <MoveUp className="h-4 w-4" />
                      </Button>
                    )}
                    {index < storyboard.length - 1 && (
                      <Button variant="outline" size="icon" onClick={() => moveScene(index, 'down')}>
                        <MoveDown className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="destructive" size="icon" onClick={() => deleteScene(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <Button onClick={exportStoryboard}>
              <Download className="mr-2 h-4 w-4" />
              Export Storyboard
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Preview Storyboard</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Storyboard Preview</DialogTitle>
                  <DialogDescription>
                    Here's a preview of your complete storyboard.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 max-h-[60vh] overflow-y-auto">
                  {storyboard.map((scene, index) => (
                    <div key={index} className="space-y-2">
                      <img src={scene.imageUrl} alt={`Scene ${index + 1}`} className="w-full h-auto" />
                      <p className="text-sm font-bold">Scene {index + 1}</p>
                      <p className="text-xs">{scene.description}</p>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </>
      )}
    </div>
  );
}