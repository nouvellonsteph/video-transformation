import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface Preset {
  name: string;
  mode: string;
  time: number;
  duration: number;
  width: number;
  height: number;
  fit: string;
  audio: boolean;
  format: string;
}

const presets: Preset[] = [
  {
    name: "Tiktok mode",
    mode: "video",
    time: 10,
    duration: 10,
    width: 500,
    height: 800,
    fit: "cover",
    audio: true,
    format: "jpg"
  },
  {
    name: "Thumbnail extracting frame 10",
    mode: "frame",
    time: 10,
    duration: 10,
    width: 800,
    height: 500,
    fit: "cover",
    audio: false,
    format: "png"
  },
  // Add more presets as needed
];

interface PresetSelectProps {
  onSelectPreset: (preset: Preset) => void;
}

const PresetSelect: React.FC<PresetSelectProps> = ({ onSelectPreset }) => {
  const handlePresetSelect = (preset: Preset) => {
    onSelectPreset(preset);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select a Preset</CardTitle>
        <CardDescription>Choose a preset to apply transformations to the video.</CardDescription>
      </CardHeader>
      <CardContent>
        {presets.map((preset) => (
          <div key={preset.name} className="flex flex-col gap-2 mb-6">
            <Button onClick={() => handlePresetSelect(preset)}>{preset.name}</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PresetSelect;