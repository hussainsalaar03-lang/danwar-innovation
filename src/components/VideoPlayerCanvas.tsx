import React, { useEffect, useRef, useState } from 'react';
import { VideoProject, VideoScene } from '../types';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Download, Loader2, Smile, Wand2 } from 'lucide-react';
import { globalVideoAudio, speakNarrationText } from '../lib/videoAudio';
import { HUMAN_AVATAR_PRESETS } from '../lib/avatarAssets';
import { CARTOON_CHARACTERS, CARTOON_BACKGROUND_THEMES, CartoonCharacter } from '../lib/cartoonAssets';

interface VideoPlayerCanvasProps {
  project: VideoProject;
  onUpdateScene?: (sceneId: string, updated: Partial<VideoScene>) => void;
  isExportingVideo?: boolean;
  onExportProgress?: (progress: number) => void;
}

/**
 * High-Performance Procedural 2D/3D Animated Cartoon Character Renderer
 * Draws fully articulated talking and moving cartoon characters directly to HTML5 Canvas
 */
function drawCartoonCharacterOnCanvas(
  ctx: CanvasRenderingContext2D,
  char: CartoonCharacter,
  action: string,
  emotion: string,
  isPlaying: boolean,
  now: number,
  canvasWidth: number,
  canvasHeight: number,
  isVertical: boolean
) {
  ctx.save();

  // Character Base Position & Scale
  const baseScale = isVertical ? 1.05 : 1.25;
  const charX = isVertical ? canvasWidth / 2 : canvasWidth * 0.45;
  let charY = isVertical ? canvasHeight * 0.63 : canvasHeight * 0.65;

  // 1. Motion & Kinematics (Breathing, Bouncing, Flying, Bobbing)
  const breath = Math.sin(now * 0.0035) * 4;
  let bounceY = 0;
  let hoverRot = 0;

  if (action === 'talk_bounce') {
    bounceY = -Math.abs(Math.sin(now * 0.007)) * 28;
  } else if (action === 'talk_fly') {
    bounceY = Math.sin(now * 0.003) * 18 - 25;
    hoverRot = Math.sin(now * 0.002) * 0.05;
  } else {
    bounceY = breath;
  }

  const posX = charX;
  const posY = charY + bounceY;

  // 2. Ground Shadow (stretches/shrinks with bounce)
  const shadowScale = Math.max(0.4, 1.0 - Math.abs(bounceY) / 60);
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.beginPath();
  ctx.ellipse(posX, charY + 110 * baseScale, 90 * baseScale * shadowScale, 18 * baseScale * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.translate(posX, posY);
  ctx.rotate(hoverRot);
  ctx.scale(baseScale, baseScale);

  // 3. Special Accessories (Superhero Cape, Aura)
  if (char.category === 'superhero') {
    // Fluttering Cape
    ctx.save();
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#f87171';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    const capeFlutter = Math.sin(now * 0.008) * 15;
    ctx.moveTo(-35, 10);
    ctx.lineTo(-75 + capeFlutter, 110);
    ctx.lineTo(75 - capeFlutter, 110);
    ctx.lineTo(35, 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 4. Character Body & Torso
  ctx.save();
  ctx.fillStyle = char.outfitColor || '#ea580c';
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.roundRect(-42, -5, 84, 85, [20, 20, 16, 16]);
  ctx.fill();

  // Outfit Detail / Emblem
  if (char.id === 'robo_buddy') {
    // Digital battery gauge
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(-22, 18, 44, 20, 6);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.roundRect(-18, 22, 36, 12, 4);
    ctx.fill();
  } else if (char.id === 'super_danwar') {
    // Glowing Gold Star / Danwar AI Logo
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(0, 25, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e1b4b';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('D', 0, 29);
  } else {
    // Stylish zipper / hoodie drawstrings
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-10, 5);
    ctx.lineTo(-10, 30);
    ctx.moveTo(10, 5);
    ctx.lineTo(10, 30);
    ctx.stroke();
  }
  ctx.restore();

  // 5. Arms & Animated Gestures
  // Left Arm
  ctx.save();
  ctx.fillStyle = char.outfitColor || '#ea580c';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 3;
  ctx.beginPath();
  let leftArmAngle = 0.2;
  if (action === 'talk_cheer') {
    leftArmAngle = -2.2 + Math.sin(now * 0.008) * 0.2; // Raised high
  } else if (action === 'talk_think') {
    leftArmAngle = -1.4; // Hand to chin
  }
  ctx.translate(-42, 10);
  ctx.rotate(leftArmAngle);
  ctx.roundRect(-12, 0, 24, 60, 12);
  ctx.fill();
  // Left Hand
  ctx.fillStyle = char.skinTone || '#fed7aa';
  ctx.beginPath();
  ctx.arc(0, 60, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Right Arm (Animated Wave or Point)
  ctx.save();
  ctx.fillStyle = char.outfitColor || '#ea580c';
  ctx.translate(42, 10);
  let rightArmAngle = -0.2;

  if (action === 'talk_wave') {
    rightArmAngle = -2.3 + Math.sin(now * 0.009) * 0.45; // Waving hand
  } else if (action === 'talk_point') {
    rightArmAngle = -1.55; // Pointing rightward
  } else if (action === 'talk_cheer') {
    rightArmAngle = 2.2 - Math.sin(now * 0.008) * 0.2;
  }

  ctx.rotate(rightArmAngle);
  ctx.beginPath();
  ctx.roundRect(-12, 0, 24, 60, 12);
  ctx.fill();

  // Right Hand
  ctx.fillStyle = char.skinTone || '#fed7aa';
  ctx.beginPath();
  ctx.arc(0, 60, 11, 0, Math.PI * 2);
  ctx.fill();

  // Pointing Sparkle Effect
  if (action === 'talk_point') {
    ctx.save();
    ctx.fillStyle = '#fde047';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(0, 65, 7 + Math.sin(now * 0.01) * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // 6. Character Head & Face
  const headRadius = 46;
  const headCenterY = -50;

  // Head Base
  ctx.save();
  ctx.fillStyle = char.skinTone || '#fed7aa';
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  if (char.id === 'robo_buddy') {
    ctx.roundRect(-headRadius, headCenterY - headRadius, headRadius * 2, headRadius * 2, 22);
  } else if (char.id === 'professor_owl') {
    ctx.ellipse(0, headCenterY, headRadius + 4, headRadius + 2, 0, 0, Math.PI * 2);
  } else {
    ctx.arc(0, headCenterY, headRadius, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.restore();

  // Robot Visor Screen or Glasses
  if (char.id === 'robo_buddy') {
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(-36, headCenterY - 22, 72, 38, 12);
    ctx.fill();

    // Glowing Cyan Robot Eyes
    const robotEyeColor = '#00f2fe';
    ctx.fillStyle = robotEyeColor;
    ctx.shadowColor = robotEyeColor;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(-18, headCenterY - 3, 7, 0, Math.PI * 2);
    ctx.arc(18, headCenterY - 3, 7, 0, Math.PI * 2);
    ctx.fill();

    // Antenna
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, headCenterY - headRadius);
    ctx.lineTo(0, headCenterY - headRadius - 22);
    ctx.stroke();

    ctx.fillStyle = isPlaying ? '#22c55e' : '#38bdf8';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, headCenterY - headRadius - 24, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else {
    // 7. Human/Animal Hair & Hats
    if (char.hairColor) {
      ctx.save();
      ctx.fillStyle = char.hairColor;
      if (char.id === 'leo_toon') {
        // Cool stylish swooped toon hair
        ctx.beginPath();
        ctx.arc(0, headCenterY - 8, headRadius + 3, Math.PI * 1.05, Math.PI * 1.95);
        ctx.quadraticCurveTo(headRadius + 8, headCenterY - 35, 0, headCenterY - headRadius - 14);
        ctx.quadraticCurveTo(-headRadius - 8, headCenterY - 35, -headRadius - 2, headCenterY - 8);
        ctx.fill();
      } else if (char.id === 'maya_smart') {
        // Ponytail and smart hair
        ctx.beginPath();
        ctx.arc(0, headCenterY - 6, headRadius + 3, Math.PI * 1.1, Math.PI * 1.9);
        ctx.fill();
        // Ponytail puff
        ctx.beginPath();
        ctx.arc(headRadius + 8, headCenterY - 24, 18, 0, Math.PI * 2);
        ctx.fill();
      } else if (char.id === 'professor_owl') {
        // Graduation Mortarboard Cap
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(0, headCenterY - headRadius - 24);
        ctx.lineTo(55, headCenterY - headRadius - 8);
        ctx.lineTo(0, headCenterY - headRadius + 8);
        ctx.lineTo(-55, headCenterY - headRadius - 8);
        ctx.closePath();
        ctx.fill();
        // Golden Tassel
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, headCenterY - headRadius - 8);
        ctx.lineTo(35, headCenterY - headRadius + 15);
        ctx.stroke();
      } else if (char.id === 'baba_story') {
        // Traditional Wisdom Shawl / Turban
        ctx.fillStyle = '#0d9488';
        ctx.beginPath();
        ctx.arc(0, headCenterY - 14, headRadius + 6, Math.PI * 0.9, Math.PI * 2.1);
        ctx.fill();
        // Soft White Beard
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.ellipse(0, headCenterY + 36, 32, 28, 0, 0, Math.PI);
        ctx.fill();
      } else if (char.id === 'anime_kai') {
        // Spiky anime hair + Red headband
        ctx.fillStyle = '#18181b';
        for (let spike = -4; spike <= 4; spike++) {
          ctx.beginPath();
          ctx.moveTo(spike * 10 - 15, headCenterY - 25);
          ctx.lineTo(spike * 12, headCenterY - headRadius - 22);
          ctx.lineTo(spike * 10 + 15, headCenterY - 25);
          ctx.fill();
        }
        // Headband
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-headRadius, headCenterY - 32, headRadius * 2, 14);
      }
      ctx.restore();
    }

    // Glasses for Maya / Owl
    if (char.id === 'maya_smart' || char.id === 'professor_owl') {
      ctx.save();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(-18, headCenterY - 6, 15, 0, Math.PI * 2);
      ctx.arc(18, headCenterY - 6, 15, 0, Math.PI * 2);
      ctx.moveTo(-3, headCenterY - 6);
      ctx.lineTo(3, headCenterY - 6);
      ctx.stroke();
      ctx.restore();
    }

    // 8. Animated Eyes with Natural Blinking Physics
    const isBlinking = (Math.floor(now / 3200) % 1 === 0 && (now % 3200) < 130);

    const drawEye = (eyeX: number, eyeY: number) => {
      ctx.save();
      if (isBlinking) {
        // Closed smiling eye slit
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(eyeX, eyeY + 2, 10, Math.PI * 0.15, Math.PI * 0.85);
        ctx.stroke();
      } else {
        // Open expressive cartoon eye
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(eyeX, eyeY, 14, 17, 0, 0, Math.PI * 2);
        ctx.fill();

        // Iris
        ctx.fillStyle = char.eyeColor || '#1e3a8a';
        ctx.beginPath();
        const gazeOffsetX = isPlaying ? Math.sin(now * 0.004) * 2 : 0;
        ctx.arc(eyeX + gazeOffsetX, eyeY, 9, 0, Math.PI * 2);
        ctx.fill();

        // Pupil
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(eyeX + gazeOffsetX, eyeY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Sparkle Highlights
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(eyeX + gazeOffsetX - 3, eyeY - 4, 3, 0, Math.PI * 2);
        ctx.arc(eyeX + gazeOffsetX + 3, eyeY + 3, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    drawEye(-18, headCenterY - 6);
    drawEye(18, headCenterY - 6);

    // Eyebrows
    ctx.save();
    ctx.strokeStyle = char.hairColor || '#451a03';
    ctx.lineWidth = 3;
    let browAngle = 0;
    if (emotion === 'excited' || emotion === 'happy') browAngle = -0.15;
    if (emotion === 'heroic') browAngle = 0.2;

    ctx.beginPath();
    ctx.moveTo(-28, headCenterY - 22 + browAngle * 10);
    ctx.quadraticCurveTo(-18, headCenterY - 26, -8, headCenterY - 22 - browAngle * 10);
    ctx.moveTo(8, headCenterY - 22 - browAngle * 10);
    ctx.quadraticCurveTo(18, headCenterY - 26, 28, headCenterY - 22 + browAngle * 10);
    ctx.stroke();
    ctx.restore();

    // Rosy Cheeks
    ctx.save();
    ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
    ctx.beginPath();
    ctx.arc(-28, headCenterY + 12, 9, 0, Math.PI * 2);
    ctx.arc(28, headCenterY + 12, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 9. ANIMATED TALKING MOUTH (Real-time Lip-Sync Simulation)
    ctx.save();
    const mouthY = headCenterY + 20;

    if (isPlaying) {
      // Dynamic talking syllables modulation
      const talkCycle = (Math.sin(now * 0.018) + Math.sin(now * 0.027) * 0.5) * 0.5 + 0.5;
      const mouthOpenH = 8 + talkCycle * 18;
      const mouthWidth = 18 + talkCycle * 8;

      // Dark mouth cavity
      ctx.fillStyle = '#881337';
      ctx.beginPath();
      ctx.ellipse(0, mouthY, mouthWidth, mouthOpenH, 0, 0, Math.PI * 2);
      ctx.fill();

      // White Upper Teeth
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(-mouthWidth * 0.6, mouthY - mouthOpenH + 2, mouthWidth * 1.2, 5, 2);
      ctx.fill();

      // Pink Tongue
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(0, mouthY + mouthOpenH - 4, mouthWidth * 0.5, Math.PI, Math.PI * 2);
      ctx.fill();
    } else {
      // Resting friendly smile
      ctx.strokeStyle = '#881337';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, mouthY - 4, 14, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 10. Floating Character Name / Role Badge
  ctx.save();
  const badgeY = 95;
  const badgeWidth = 160;
  const badgeHeight = 28;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = char.primaryColor || '#6366f1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-badgeWidth / 2, badgeY, badgeWidth, badgeHeight, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`✨ ${char.name.split(' ')[0]} • Toon Host`, 0, badgeY + 18);
  ctx.restore();

  ctx.restore();
}

export const VideoPlayerCanvas: React.FC<VideoPlayerCanvasProps> = ({
  project,
  isExportingVideo = false,
  onExportProgress
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0); // 0 to 1
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [exportError, setExportError] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, HTMLImageElement>>({});

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const sceneStartTimeRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const currentScene = project.scenes[currentSceneIndex] || project.scenes[0];

  // Preload all scene images and avatars
  useEffect(() => {
    const imagesToLoad: Record<string, string> = {};
    project.scenes.forEach((scene, i) => {
      if (scene.imageUrl) imagesToLoad[`scene_${scene.id}`] = scene.imageUrl;
      if (scene.avatarPreset) {
        const avatar = HUMAN_AVATAR_PRESETS.find(a => a.id === scene.avatarPreset);
        if (avatar?.image) imagesToLoad[`avatar_${scene.id}`] = avatar.image;
      }
    });

    const activeHuman = HUMAN_AVATAR_PRESETS.find(a => a.id === project.humanStyle) || HUMAN_AVATAR_PRESETS[0];
    if (activeHuman?.image) {
      imagesToLoad['active_human'] = activeHuman.image;
    }

    const loaded: Record<string, HTMLImageElement> = {};
    let loadedCount = 0;
    const keys = Object.keys(imagesToLoad);

    if (keys.length === 0) return;

    keys.forEach(key => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.referrerPolicy = 'no-referrer';
      img.src = imagesToLoad[key];
      img.onload = () => {
        loaded[key] = img;
        loadedCount++;
        if (loadedCount === keys.length) {
          setLoadedImages(prev => ({ ...prev, ...loaded }));
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === keys.length) {
          setLoadedImages(prev => ({ ...prev, ...loaded }));
        }
      };
    });
  }, [project]);

  // Handle Play/Pause speech & music
  useEffect(() => {
    if (isPlaying) {
      if (!isMuted && project.bgMusic !== 'none') {
        globalVideoAudio.playMusic(project.bgMusic, project.bgMusicVolume);
      }
      playCurrentSceneVoice();
    } else {
      globalVideoAudio.stopMusic();
      globalVideoAudio.stopAudioClip();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }

    return () => {
      globalVideoAudio.stopMusic();
      globalVideoAudio.stopAudioClip();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, currentSceneIndex]);

  const playCurrentSceneVoice = () => {
    if (isMuted || !currentScene) return;

    if (currentScene.audioUrl) {
      globalVideoAudio.playAudioClip(currentScene.audioUrl);
    } else {
      speakNarrationText(
        currentScene.narration,
        project.language,
        project.voiceGender,
        project.voicePitch,
        project.voiceRate
      );
    }
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions based on aspect ratio
    const width = project.aspectRatio === '9:16' ? 720 : project.aspectRatio === '1:1' ? 800 : 1280;
    const height = project.aspectRatio === '9:16' ? 1280 : project.aspectRatio === '1:1' ? 800 : 720;
    canvas.width = width;
    canvas.height = height;

    let localSceneIndex = currentSceneIndex;
    let localSceneStart = performance.now();

    const render = (now: number) => {
      if (!ctx || !canvas) return;

      const scene = project.scenes[localSceneIndex] || project.scenes[0];
      const durationMs = (scene?.duration || 6) * 1000;

      if (!sceneStartTimeRef.current) {
        sceneStartTimeRef.current = now;
        localSceneStart = now;
      }

      let elapsedInScene = isPlaying ? (now - localSceneStart) : 0;
      let progress = Math.min(1, Math.max(0, elapsedInScene / durationMs));
      setSceneProgress(progress);

      // Advance to next scene if finished
      if (isPlaying && elapsedInScene >= durationMs) {
        if (localSceneIndex < project.scenes.length - 1) {
          localSceneIndex++;
          setCurrentSceneIndex(localSceneIndex);
          localSceneStart = now;
          sceneStartTimeRef.current = now;
          playCurrentSceneVoice();
        } else {
          // Finished full video
          setIsPlaying(false);
          localSceneIndex = 0;
          setCurrentSceneIndex(0);
          localSceneStart = now;
          sceneStartTimeRef.current = now;
          if (isRecording && mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
          return;
        }
      }

      // 1. Draw Background & Scene Imagery with Ken Burns Camera Motion
      ctx.save();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      const isCartoonMode = project.videoCategory === 'cartoon_animation' || Boolean(scene?.characterId) || project.humanStyle === 'cartoon_3d';

      if (isCartoonMode) {
        // Draw stylized animated cartoon environment
        const bgThemeId = scene?.backgroundTheme || project.cartoonBackgroundTheme || 'toon_magic_sky';
        const bgTheme = CARTOON_BACKGROUND_THEMES.find(t => t.id === bgThemeId) || CARTOON_BACKGROUND_THEMES[0];

        // Animated Sky Gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, bgTheme.skyGradient[0]);
        skyGrad.addColorStop(0.5, bgTheme.skyGradient[1]);
        skyGrad.addColorStop(1, bgTheme.skyGradient[2]);
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Animated Celestial / Environmental Elements
        if (bgTheme.elements === 'stars_planets') {
          // Twinkling cartoon stars
          for (let s = 0; s < 35; s++) {
            const sx = ((s * 137.5 + (now * 0.01)) % width);
            const sy = ((s * 93.7) % (height * 0.7));
            const sAlpha = 0.4 + 0.6 * Math.sin(now * 0.004 + s);
            const sSize = (s % 3) + 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${sAlpha})`;
            ctx.beginPath();
            ctx.arc(sx, sy, sSize, 0, Math.PI * 2);
            ctx.fill();
          }

          // Glowing Cartoon Planet
          const planetX = width * 0.82;
          const planetY = height * 0.18;
          ctx.save();
          ctx.shadowColor = '#818cf8';
          ctx.shadowBlur = 24;
          const planetGrad = ctx.createRadialGradient(planetX - 15, planetY - 15, 10, planetX, planetY, 55);
          planetGrad.addColorStop(0, '#ec4899');
          planetGrad.addColorStop(0.7, '#8b5cf6');
          planetGrad.addColorStop(1, '#4c1d95');
          ctx.fillStyle = planetGrad;
          ctx.beginPath();
          ctx.arc(planetX, planetY, 50, 0, Math.PI * 2);
          ctx.fill();

          // Planet Ring
          ctx.strokeStyle = 'rgba(244, 114, 182, 0.7)';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.ellipse(planetX, planetY, 75, 18, -Math.PI / 6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        } else {
          // Drifting Fluffy Cartoon Clouds
          for (let c = 0; c < 4; c++) {
            const cloudX = ((c * 260 + now * 0.035) % (width + 300)) - 150;
            const cloudY = 90 + c * 75;
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
            ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(cloudX, cloudY, 32, 0, Math.PI * 2);
            ctx.arc(cloudX + 30, cloudY - 10, 42, 0, Math.PI * 2);
            ctx.arc(cloudX + 68, cloudY, 34, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        // Cartoon Hills / Ground
        ctx.save();
        const groundGrad = ctx.createLinearGradient(0, height * 0.7, 0, height);
        groundGrad.addColorStop(0, bgTheme.groundColor);
        groundGrad.addColorStop(1, '#1e293b');
        ctx.fillStyle = groundGrad;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.78);
        ctx.bezierCurveTo(width * 0.35, height * 0.72, width * 0.65, height * 0.82, width, height * 0.75);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 2. Animated Talking & Moving Cartoon Character
        const activeCharId = scene?.characterId || project.cartoonCharacterId || 'leo_toon';
        const character = CARTOON_CHARACTERS.find(c => c.id === activeCharId) || CARTOON_CHARACTERS[0];
        const action = scene?.characterAction || project.cartoonAction || character.defaultAction;
        const emotion = scene?.characterEmotion || 'happy';

        drawCartoonCharacterOnCanvas(ctx, character, action, emotion, isPlaying, now, width, height, project.aspectRatio === '9:16');
      } else {
        // Photorealistic Human Mode
        const sceneImg = loadedImages[`scene_${scene?.id}`] || loadedImages['active_human'];
        if (sceneImg && sceneImg.complete && sceneImg.naturalWidth > 0) {
          let scale = 1.0;
          let dx = 0;
          let dy = 0;

          if (scene?.transition === 'zoom_in') {
            scale = 1.0 + progress * 0.15;
          } else if (scene?.transition === 'zoom_out') {
            scale = 1.15 - progress * 0.15;
          } else if (scene?.transition === 'slide_left') {
            dx = -progress * 40;
          } else if (scene?.transition === 'slide_right') {
            dx = progress * 40;
          } else if (scene?.transition === 'pan_up') {
            dy = -progress * 30;
          }

          ctx.translate(width / 2 + dx, height / 2 + dy);
          ctx.scale(scale, scale);
          ctx.drawImage(sceneImg, -width / 2 - 20, -height / 2 - 20, width + 40, height + 40);
          ctx.restore();
        } else {
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, '#1e1b4b');
          grad.addColorStop(0.5, '#312e81');
          grad.addColorStop(1, '#0f172a');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        }

        // Cinematic Lighting & Vignette Overlay
        const vig = ctx.createRadialGradient(width / 2, height / 2, width * 0.3, width / 2, height / 2, width * 0.8);
        vig.addColorStop(0, 'rgba(0,0,0,0)');
        vig.addColorStop(1, 'rgba(0,0,0,0.65)');
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, width, height);

        // Realistic Human Presenter Avatar Pip (if active)
        const avatarImg = loadedImages[`avatar_${scene?.id}`] || loadedImages['active_human'];
        if (avatarImg && avatarImg.complete && avatarImg.naturalWidth > 0 && project.humanStyle !== 'documentary') {
          const isVertical = project.aspectRatio === '9:16';
          const avatarSize = isVertical ? 150 : 180;
          const avatarX = isVertical ? 36 : 50;
          const avatarY = isVertical ? height - 260 : height - 230;

          ctx.save();
          ctx.shadowColor = 'rgba(99, 102, 241, 0.6)';
          ctx.shadowBlur = 18;

          ctx.beginPath();
          ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
          ctx.fillStyle = '#1e293b';
          ctx.fill();
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#818cf8';
          ctx.stroke();
          ctx.clip();

          const breath = Math.sin(now * 0.003) * 3;
          ctx.drawImage(avatarImg, avatarX - 10, avatarY - 10 + breath, avatarSize + 20, avatarSize + 20);
          ctx.restore();

          // Host Badge
          ctx.save();
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.strokeStyle = 'rgba(129, 140, 248, 0.5)';
          ctx.lineWidth = 1.5;
          const badgeWidth = avatarSize + 10;
          const badgeX = avatarX - 5;
          const badgeY = avatarY + avatarSize - 12;
          
          ctx.beginPath();
          ctx.roundRect(badgeX, badgeY, badgeWidth, 26, 13);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🎙️ Real AI Host', badgeX + badgeWidth / 2, badgeY + 17);
          ctx.restore();
        }
      }

      // 4. Dynamic Audio Waveform Visualizer
      if (isPlaying) {
        ctx.save();
        const waveY = height - 100;
        const barCount = 24;
        const barWidth = 4;
        const gap = 3;
        const startX = width / 2 - ((barCount * (barWidth + gap)) / 2);

        for (let i = 0; i < barCount; i++) {
          const h = Math.abs(Math.sin(now * 0.008 + i * 0.3) * Math.cos(now * 0.005 + i * 0.5)) * 28 + 6;
          const barGrad = ctx.createLinearGradient(0, waveY - h, 0, waveY + h);
          barGrad.addColorStop(0, '#38bdf8');
          barGrad.addColorStop(1, '#818cf8');

          ctx.fillStyle = barGrad;
          ctx.beginPath();
          ctx.roundRect(startX + i * (barWidth + gap), waveY - h / 2, barWidth, h, 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 5. Dynamic Captions & Subtitles Rendering
      if (scene?.subtitles) {
        ctx.save();
        const isVertical = project.aspectRatio === '9:16';
        const fontSize = isVertical ? 28 : 34;
        ctx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = 'center';

        const captionY = isVertical ? height * 0.45 : height * 0.72;
        const text = scene.subtitles;
        const textWidth = ctx.measureText(text).width;

        // Caption Style Variations
        if (project.captionStyle === 'bold_yellow') {
          // Viral MrBeast style bold yellow with black outline
          ctx.lineWidth = 8;
          ctx.strokeStyle = '#000000';
          ctx.strokeText(text, width / 2, captionY);
          ctx.fillStyle = '#fde047'; // Vibrant Yellow
          ctx.fillText(text, width / 2, captionY);
        } else if (project.captionStyle === 'gradient_box') {
          // Glowing Gradient Glass Box
          const boxPaddingX = 24;
          const boxPaddingY = 14;
          const boxX = width / 2 - textWidth / 2 - boxPaddingX;
          const boxY = captionY - fontSize + 2;
          const boxW = textWidth + boxPaddingX * 2;
          const boxH = fontSize + boxPaddingY * 2;

          const gradBox = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY + boxH);
          gradBox.addColorStop(0, 'rgba(129, 140, 248, 0.85)');
          gradBox.addColorStop(1, 'rgba(236, 72, 153, 0.85)');

          ctx.fillStyle = gradBox;
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.roundRect(boxX, boxY, boxW, boxH, 16);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.fillText(text, width / 2, captionY + 8);
        } else if (project.captionStyle === 'cartoon_comic') {
          // Energetic Comic Toon Style with Bold Pop Outline & Drop Shadow
          ctx.lineWidth = 10;
          ctx.strokeStyle = '#0f172a';
          ctx.strokeText(text, width / 2, captionY);
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#facc15';
          ctx.strokeText(text, width / 2, captionY);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(text, width / 2, captionY);
        } else {
          // Karaoke / Modern White with Glowing Shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
          ctx.shadowBlur = 12;
          ctx.fillStyle = '#ffffff';
          ctx.fillText(text, width / 2, captionY);
        }
        ctx.restore();
      }

      // 6. TOP BAR: Scene Marker & Video Title
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
      ctx.beginPath();
      ctx.roundRect(24, 24, width - 48, 42, 12);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      const truncatedTitle = project.title.length > 40 ? project.title.substring(0, 37) + '...' : project.title;
      ctx.fillText(`🎬 ${truncatedTitle}`, 40, 50);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px system-ui, -apple-system, sans-serif';
      ctx.fillText(`Scene ${localSceneIndex + 1}/${project.scenes.length} (${project.language})`, width - 40, 50);
      ctx.restore();

      // 7. BOTTOM PROGRESS BAR
      ctx.save();
      const barY = height - 12;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(0, barY, width, 12);

      // Total Video Progress
      const totalScenes = project.scenes.length;
      const totalProgress = (localSceneIndex + progress) / totalScenes;
      const progGrad = ctx.createLinearGradient(0, 0, width, 0);
      progGrad.addColorStop(0, '#38bdf8');
      progGrad.addColorStop(0.5, '#818cf8');
      progGrad.addColorStop(1, '#ec4899');
      ctx.fillStyle = progGrad;
      ctx.fillRect(0, barY, width * totalProgress, 12);
      ctx.restore();

      // =========================================================================
      // 8. MANDATORY WATERMARK (NEECHE RIGHT SIDE "Danwar AI" COLORFUL DESIGN)
      // "Aur video main watermark Neeche right side Danwar Ai likha hona chahye Colorful design ke saath attractive and clearly easy to read"
      // =========================================================================
      ctx.save();
      const isVertical = project.aspectRatio === '9:16';
      const wmPaddingX = isVertical ? 16 : 20;
      const wmPaddingY = isVertical ? 10 : 12;
      const wmFontSize = isVertical ? 15 : 18;

      ctx.font = `bold ${wmFontSize}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
      const wmText = '✨ Danwar AI';
      const wmTextMetrics = ctx.measureText(wmText);
      const wmTextW = wmTextMetrics.width;

      const wmWidth = wmTextW + wmPaddingX * 2;
      const wmHeight = wmFontSize + wmPaddingY * 2;
      const wmMarginRight = isVertical ? 24 : 32;
      const wmMarginBottom = isVertical ? 36 : 40;

      const wmX = width - wmWidth - wmMarginRight;
      const wmY = height - wmHeight - wmMarginBottom;

      // Colorful Vibrant Glowing Gradient Badge
      // Gradient: Electric Indigo -> Vivid Purple -> Hot Pink -> Cyan Highlight
      const badgeGradient = ctx.createLinearGradient(wmX, wmY, wmX + wmWidth, wmY + wmHeight);
      badgeGradient.addColorStop(0, 'rgba(79, 70, 229, 0.95)');   // Deep Indigo
      badgeGradient.addColorStop(0.4, 'rgba(147, 51, 234, 0.95)'); // Vibrant Purple
      badgeGradient.addColorStop(0.8, 'rgba(236, 72, 153, 0.95)'); // Electric Pink
      badgeGradient.addColorStop(1, 'rgba(6, 182, 212, 0.95)');    // Vivid Cyan

      // Glowing outer shadow
      ctx.shadowColor = 'rgba(147, 51, 234, 0.8)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;

      // Draw rounded colorful pill
      ctx.beginPath();
      ctx.roundRect(wmX, wmY, wmWidth, wmHeight, 20);
      ctx.fillStyle = badgeGradient;
      ctx.fill();

      // Sharp colorful glowing border
      ctx.lineWidth = 2.5;
      const borderGrad = ctx.createLinearGradient(wmX, wmY, wmX + wmWidth, wmY);
      borderGrad.addColorStop(0, '#67e8f9'); // Cyan Glow
      borderGrad.addColorStop(0.5, '#ffffff'); // Crisp White Glow
      borderGrad.addColorStop(1, '#f472b6'); // Rose Glow
      ctx.strokeStyle = borderGrad;
      ctx.stroke();

      // Clear, ultra-crisp readable text with subtle shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 1;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(wmText, wmX + wmPaddingX, wmY + wmHeight - wmPaddingY - 2);

      ctx.restore();
      // =========================================================================

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [project, isPlaying, currentSceneIndex, loadedImages, isRecording, isMuted]);

  // Export / Render Video File directly via Canvas MediaRecorder
  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsRecording(true);
      setIsPlaying(false);
      setCurrentSceneIndex(0);
      recordedChunksRef.current = [];

      // Audio + Video Stream
      globalVideoAudio.init(true);
      const canvasStream = canvas.captureStream(30);

      // Combine Web Audio if destination exists
      if (globalVideoAudio.destinationNode) {
        const audioTracks = globalVideoAudio.destinationNode.stream.getAudioTracks();
        if (audioTracks.length > 0) {
          canvasStream.addTrack(audioTracks[0]);
        }
      }

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      const recorder = new MediaRecorder(canvasStream, {
        mimeType,
        videoBitsPerSecond: 4500000
      });

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        setIsRecording(false);
        setIsPlaying(false);
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const sanitizedTitle = project.title.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_').slice(0, 30);
        a.download = `Danwar_AI_${sanitizedTitle || 'video'}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      recorder.start(200);
      setIsPlaying(true);
    } catch (err: any) {
      console.error("Export Error:", err);
      setIsRecording(false);
      setExportError("Video export could not start. Please ensure your browser supports MediaRecorder.");
      setTimeout(() => setExportError(null), 5000);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-4">
      {exportError && (
        <div className="w-full px-4 py-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl text-center">
          {exportError}
        </div>
      )}
      {/* Video Canvas Container */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex items-center justify-center max-w-full">
        <canvas
          ref={canvasRef}
          className="max-h-[520px] w-auto max-w-full object-contain rounded-2xl cursor-pointer"
          onClick={() => setIsPlaying(!isPlaying)}
        />

        {/* Play Overlay Button if paused */}
        {!isPlaying && (
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all backdrop-blur-sm group"
          >
            <Play size={28} className="translate-x-0.5 group-hover:text-cyan-300 transition-colors" />
          </button>
        )}

        {/* Recording / Exporting Status Banner */}
        {isRecording && (
          <div className="absolute top-4 left-4 right-4 bg-red-600/90 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center justify-between shadow-lg backdrop-blur-md animate-pulse">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              Rendering Video with Danwar AI Watermark & Audio...
            </span>
            <span>Scene {currentSceneIndex + 1}/{project.scenes.length}</span>
          </div>
        )}
      </div>

      {/* Playback Controls & Video Export */}
      <div className="w-full flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-slate-200 shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-xl text-white transition-all shadow-md"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentSceneIndex(0);
              setSceneProgress(0);
            }}
            className="p-2.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
            title="Restart Video"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2.5 rounded-xl transition-colors ${isMuted ? 'text-rose-400 hover:bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        {/* Scene Indicator Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[240px] px-2 py-1 bg-slate-950/60 rounded-xl">
          {project.scenes.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentSceneIndex(idx);
                setSceneProgress(0);
                if (isPlaying) playCurrentSceneVoice();
              }}
              className={`h-2 rounded-full transition-all ${
                currentSceneIndex === idx 
                  ? 'w-6 bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-sm' 
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              title={`Scene ${idx + 1}`}
            />
          ))}
        </div>

        {/* Export Video Button */}
        <button
          onClick={handleExportVideo}
          disabled={isRecording}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
        >
          {isRecording ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Rendering...</span>
            </>
          ) : (
            <>
              <Download size={15} />
              <span>Export Video (MP4/WebM)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
