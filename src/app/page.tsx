'use client'
import Image from "next/image";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Preset } from "@/components/ui/preset-select";
import PresetSelect from "@/components/ui/preset-select";

const defaultVideoUrl = "https://pub-d217a1fefa4346d09172e418e550c2e0.r2.dev/default.mp4";
const exampleUrl = "https://video-transformation.justalittlebyte.ovh/cdn-cgi/media/";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState(defaultVideoUrl);
  const [mode, setMode] = useState("");
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(5);
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const [fit, setFit] = useState("contain");
  const [audio, setAudio] = useState(true);
  const [format, setFormat] = useState("jpg");

  const [timeActive, setTimeActive] = useState(false);
  const [durationActive, setDurationActive] = useState(false);
  const [widthActive, setWidthActive] = useState(false);
  const [heightActive, setHeightActive] = useState(false);
  const [fitActive, setFitActive] = useState(false);
  const [formatActive, setFormatActive] = useState(false);

  const [transformedUrl, setTransformedUrl] = useState("");
  const [responseHeaders, setResponseHeaders] = useState<string | null>(null);
  const [presetSelected, setPresetSelected] = useState(false);

  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const response = await fetch(transformedUrl, { mode: 'cors' });

        if (!response.ok) {
          setResponseHeaders(`HTTP error! status: ${response.status}`);
          return;
        }

        const headers = Object.fromEntries(response.headers.entries());
        setResponseHeaders(JSON.stringify(headers, null, 2));
      } catch (error: unknown) {
        if (error instanceof Error) {
          setResponseHeaders(error.message);
        } else {
          setResponseHeaders("An unknown error occurred.");
        }
      }
    };

    if (transformedUrl) {
      fetchHeaders();
    }
  }, [transformedUrl]);

  const handlePresetSelect = (preset: Preset) => {
    setMode(preset.mode);
    setTime(preset.time);
    setDuration(preset.duration);
    setWidth(preset.width);
    setHeight(preset.height);
    setFit(preset.fit);
    setAudio(preset.audio);
    setFormat(preset.format);
    setPresetSelected(true);
  };

  useEffect(() => {
    if (presetSelected) {
      setTimeActive(true);
      setDurationActive(true);
      setWidthActive(true);
      setHeightActive(true);
      setFitActive(true);
      setFormatActive(true);
    }
  }, [presetSelected]);

  useEffect(() => {
    let transformationString = "";
    const transformations: string[] = [];

    transformations.push(`mode=${mode}`);

    if (timeActive) {
      transformations.push(`time=${time}s`);
    }
    if (durationActive) {
      transformations.push(`duration=${duration}s`);
    }
    if (widthActive) {
      transformations.push(`width=${width}`);
    }
    if (heightActive) {
      transformations.push(`height=${height}`);
    }
    if (fitActive) {
      transformations.push(`fit=${fit}`);
    }
    if (audio && mode === "video") {
      transformations.push(`audio=${audio}`);
    }
    if (formatActive && mode === "frame") {
      transformations.push(`format=${format}`);
    }

    transformationString = transformations.join(",");

    const url = `${exampleUrl}${transformationString}/${videoUrl}`;
    setTransformedUrl(url);

  }, [videoUrl, mode, time, duration, width, height, fit, audio, format, timeActive, durationActive, widthActive, heightActive, fitActive, formatActive]);


  const handleVideoUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(event.target.value);
  };

  return (
    
      <div className="grid text-justify items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center text-justify sm:items-start">
        <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Cloudflare Edge Video Transformation</CardTitle>
        <CardDescription>Enter a video URL and apply transformations to it</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 items-center justify-items-center">
      <Input
            type="text"
            placeholder="Video URL"
            value={videoUrl}
            onChange={handleVideoUrlChange}
            className="w-full"
          />

          {mode === "frame" || mode === "spritesheet" ? (
            <img
              src={transformedUrl}
              alt="Transformed video frame"
              width={500}
              height={500}
              className="rounded-2xl"
            />
          ) : (
            <video
              src={transformedUrl}
              controls
              autoPlay
              muted
              loop
              className="rounded-2xl"
            />
          )}
          <div className="text-lime-300 rounded-2xl" style={{ 
            backgroundColor: '#000', 
            fontFamily: 'monospace', 
            fontSize: '10px',
            padding: '10px', 
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }}>
            <h3>Transformed URL</h3>
            <p>{transformedUrl}</p>
            <h3>Response Headers</h3>
            <p>{responseHeaders}</p>
          </div>
      </CardContent>

          
          </Card>

        <div className="w-full max-w-2xl flex flex-col gap-4">
          {1 && (
            <PresetSelect onSelectPreset={handlePresetSelect} />
          )}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Transformations</CardTitle>
              <CardDescription>Apply transformations to the video.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="mode">Mode
                  <p className="text-sm text-muted-foreground ml-2">
                    The mode of transformation.
                  </p>
                </Label>
                <Select value={mode} onValueChange={(value) => setMode(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="frame">Frame</SelectItem>
                    <SelectItem value="spritesheet">Spritesheet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(mode as string) !== "" && (
                <div className="flex flex-col gap-2">
                  <Checkbox
                    id="time-active"
                    checked={timeActive}
                    onCheckedChange={(checked) => setTimeActive(!!checked)}
                    disabled={mode === ""}
                  />
                  <Label htmlFor="time">Time (s)
                    <p className="text-sm text-muted-foreground ml-2">
                      The time to seek to in the video.
                    </p>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      id="time"
                      defaultValue={[0]}
                      max={30}
                      min={0}
                      step={1}
                      onValueChange={(value) => setTime(value[0])}
                      disabled={!timeActive || mode === ""}
                    />
                    <span>{time}</span>
                  </div>
                </div>
              )}

              {(mode as string) !== "" && (
                <div className="flex flex-col gap-2">
                  <Checkbox
                    id="duration-active"
                    checked={durationActive}
                    onCheckedChange={(checked) => setDurationActive(!!checked)}
                    disabled={mode === ""}
                  />
                  <Label htmlFor="duration">Duration (s)
                    <p className="text-sm text-muted-foreground ml-2">
                      The duration of the video.
                    </p>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      id="duration"
                      defaultValue={[5]}
                      max={30}
                      min={1}
                      step={1}
                      onValueChange={(value) => setDuration(value[0])}
                      disabled={!durationActive || mode === ""}
                    />
                    <span>{duration}</span>
                  </div>
                </div>
              )}

              {(mode as string) !== "" && (mode as string) === "frame" && (
                <div className="flex flex-col gap-2">
                  <Checkbox
                    id="format-active"
                    checked={formatActive}
                    onCheckedChange={(checked) => setFormatActive(!!checked)}
                    disabled={mode === ""}
                  />
                  <Label htmlFor="format">Format
                    <p className="text-sm text-muted-foreground ml-2">
                      The format of the image.
                    </p>
                  </Label>
                  <Select value={format} onValueChange={(value) => setFormat(value)} disabled={!formatActive || mode === ""}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpg">JPG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(mode as string) !== "" && (
                <>
                  <div className="flex flex-col gap-2">
                    <Checkbox
                      id="width-active"
                      checked={widthActive}
                      onCheckedChange={(checked) => setWidthActive(!!checked)}
                      disabled={mode === ""}
                    />
                    <Label htmlFor="width">Width (px)
                      <p className="text-sm text-muted-foreground ml-2">
                        The width of the video.
                      </p>
                    </Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="width"
                        defaultValue={[500]}
                        max={2000}
                        min={10}
                        step={10}
                        onValueChange={(value) => setWidth(value[0])}
                        disabled={!widthActive || mode === ""}
                      />
                      <span>{width}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Checkbox
                      id="height-active"
                      checked={heightActive}
                      onCheckedChange={(checked) => setHeightActive(!!checked)}
                      disabled={mode === ""}
                    />
                    <Label htmlFor="height">Height (px)
                      <p className="text-sm text-muted-foreground ml-2">
                        The height of the video.
                      </p>
                    </Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="height"
                        defaultValue={[500]}
                        max={2000}
                        min={10}
                        step={10}
                        onValueChange={(value) => setHeight(value[0])}
                        disabled={!heightActive || mode === ""}
                      />
                      <span>{height}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Checkbox
                      id="fit-active"
                      checked={fitActive}
                      onCheckedChange={(checked) => setFitActive(!!checked)}
                      disabled={mode === ""}
                    />
                    <Label htmlFor="fit">Fit
                      <p className="text-sm text-muted-foreground ml-2">
                        The fit of the video.
                      </p>
                    </Label>
                    <Select value={fit} onValueChange={(value) => setFit(value)} disabled={!fitActive}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select fit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contain">Contain</SelectItem>
                        <SelectItem value="cover">Cover</SelectItem>
                        <SelectItem value="scale-down">Scale Down</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {mode !== "" && (mode as string) === "video" && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="audio">Audio
                    <p className="text-sm text-muted-foreground ml-2">
                      Whether to include audio.
                    </p>
                  </Label>
                  <Checkbox
                    id="audio"
                    checked={audio}
                    onCheckedChange={(checked) => setAudio(!!checked)}
                    disabled={mode === ""}
                  />
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://developers.cloudflare.com/stream/transform-videos/#mode"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn more about Cloudflare video transformations
        </a>
      </footer>
    </div>
  )
};
