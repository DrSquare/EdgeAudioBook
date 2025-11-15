"""Text-to-Speech engine wrapper"""
import logging
import os

logger = logging.getLogger(__name__)

class TTSEngine:
    """
    Wrapper for Text-to-Speech engines
    """
    
    def __init__(self, engine='pyttsx3'):
        """Initialize TTS engine"""
        self.engine = engine
        logger.info(f"Initializing TTS Engine: {engine}")
        
        if engine == 'pyttsx3':
            try:
                import pyttsx3
                self.tts = pyttsx3.init()
                self.engine_loaded = True
            except Exception as e:
                logger.warning(f"pyttsx3 not available: {e}, using mock")
                self.engine_loaded = False
        elif engine == 'gtts':
            try:
                from gtts import gTTS
                self.gtts = gTTS
                self.engine_loaded = True
            except ImportError:
                logger.warning("gTTS not available, using mock")
                self.engine_loaded = False
        else:
            self.engine_loaded = False
    
    def text_to_speech(self, text, output_path, voice='female', speed=1.0, audio_format='mp3'):
        """
        Convert text to speech and save as audio file
        
        Args:
            text: Text to convert
            output_path: Path to save audio file
            voice: Voice type ('male' or 'female')
            speed: Speech rate (0.5 to 2.0)
            audio_format: Output format ('mp3' or 'wav')
        """
        logger.info(f"Generating audio: {output_path}")
        
        try:
            if self.engine == 'pyttsx3' and self.engine_loaded:
                self._generate_with_pyttsx3(text, output_path, voice, speed)
            elif self.engine == 'gtts' and self.engine_loaded:
                self._generate_with_gtts(text, output_path)
            else:
                # Mock implementation
                self._generate_mock(text, output_path)
                
        except Exception as e:
            logger.error(f"TTS generation failed: {e}")
            # Fallback to mock
            self._generate_mock(text, output_path)
    
    def _generate_with_pyttsx3(self, text, output_path, voice, speed):
        """Generate audio using pyttsx3"""
        # Set voice properties
        voices = self.tts.getProperty('voices')
        
        # Try to set voice based on preference
        if voice == 'female' and len(voices) > 1:
            self.tts.setProperty('voice', voices[1].id)
        elif voice == 'male' and len(voices) > 0:
            self.tts.setProperty('voice', voices[0].id)
        
        # Set speech rate (default is usually 200)
        rate = self.tts.getProperty('rate')
        self.tts.setProperty('rate', rate * speed)
        
        # Save to file
        # Note: pyttsx3 typically saves as WAV
        wav_path = output_path.replace('.mp3', '.wav')
        self.tts.save_to_file(text, wav_path)
        self.tts.runAndWait()
        
        # Convert WAV to MP3 if needed
        if output_path.endswith('.mp3'):
            try:
                from pydub import AudioSegment
                audio = AudioSegment.from_wav(wav_path)
                audio.export(output_path, format='mp3', bitrate='128k')
                os.remove(wav_path)  # Remove temporary WAV file
            except Exception as e:
                logger.warning(f"Could not convert to MP3: {e}, keeping WAV")
                os.rename(wav_path, output_path.replace('.mp3', '.wav'))
    
    def _generate_with_gtts(self, text, output_path):
        """Generate audio using gTTS"""
        tts = self.gtts(text=text, lang='en')
        
        # gTTS generates MP3 by default
        if output_path.endswith('.wav'):
            mp3_path = output_path.replace('.wav', '.mp3')
            tts.save(mp3_path)
            
            # Convert MP3 to WAV if needed
            try:
                from pydub import AudioSegment
                audio = AudioSegment.from_mp3(mp3_path)
                audio.export(output_path, format='wav')
                os.remove(mp3_path)
            except Exception as e:
                logger.warning(f"Could not convert to WAV: {e}, keeping MP3")
                os.rename(mp3_path, output_path)
        else:
            tts.save(output_path)
    
    def _generate_mock(self, text, output_path):
        """Generate mock audio file for demo purposes"""
        logger.info("Using mock TTS generation")
        
        # Create a minimal WAV file with silence
        # This is just for demo - in production, use real TTS
        try:
            from pydub import AudioSegment
            from pydub.generators import Sine
            
            # Generate a short tone as placeholder
            duration_ms = len(text.split()) * 100  # 100ms per word
            tone = Sine(440).to_audio_segment(duration=min(duration_ms, 5000))
            
            if output_path.endswith('.mp3'):
                tone.export(output_path, format='mp3', bitrate='128k')
            else:
                tone.export(output_path, format='wav')
                
        except Exception as e:
            logger.warning(f"Could not generate mock audio: {e}")
            # Create empty file as last resort
            with open(output_path, 'wb') as f:
                f.write(b'')
