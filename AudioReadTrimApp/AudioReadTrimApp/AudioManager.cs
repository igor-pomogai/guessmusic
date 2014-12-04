using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.IO;
using NAudio;
using NAudio.Wave;

using System.Text.RegularExpressions;

namespace AudioReadTrimApp
{
    class AudioManager
    {
        private List<AudioTrack> tracks;

        private System.Windows.Forms.RichTextBox myConsole;
        private System.Windows.Forms.ProgressBar myProgress;

        private List<string> files;
        private string strMP3Folder;
        
        //private string strMP3SourceFilename = "06. ГРОТ - Я реален.mp3";
        //private string strMP3OutputFilename = "output.mp3";

        private int neededSecAmount;
        private int startSecond;

        public AudioManager(System.Windows.Forms.RichTextBox richTextBox, System.Windows.Forms.ProgressBar progressBar)
        {
            this.myConsole = richTextBox;
            this.myProgress = progressBar;
        }

        public void initializeAudioFolder(String folderName, List<string> filesInFolder, int secAmount, int fromSec)
        {
            strMP3Folder = folderName;
            files = filesInFolder;
            neededSecAmount = secAmount;
            startSecond = fromSec;
        }

        public void trimAudioFiles()
        {
            tracks = new List<AudioTrack>();

            for (int i = 0; i < files.Count; i++)
            {
                string fileName = strMP3Folder + "\\" + files[i];
                using (Mp3FileReader reader = new Mp3FileReader(fileName))
                {
                    //Console.WriteLine(reader.TotalTime.TotalMilliseconds);
                    int count = 1;
                    Mp3Frame mp3Frame = reader.ReadNextFrame();

                    Int32 unixTimestamp = (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;

                    string trackName = "track_" + unixTimestamp + "_" + i + ".mp3";
                 
                    try
                    {
                        if (!Directory.Exists(strMP3Folder + "\\out"))
                        {
                            DirectoryInfo di = Directory.CreateDirectory(strMP3Folder + "\\out");
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine("The process failed: {0}", e.ToString());
                    }
                    finally { }

                    System.IO.FileStream _fs = new System.IO.FileStream(strMP3Folder + 
                        "\\out\\" + trackName, System.IO.FileMode.Create, System.IO.FileAccess.Write);

                    while (mp3Frame != null)
                    {
                        double frameDurationinMs = Math.Floor((mp3Frame.SampleCount * 1.0 / mp3Frame.SampleRate) * 1000);

                        //Console.WriteLine("Frame [" + count + "] duration: " + frameDurationinMs + " ms");

                        if (count > ((neededSecAmount + startSecond) * 1000) / frameDurationinMs)
                        {
                            break;
                        }

                        if (count > (startSecond * 1000) / frameDurationinMs) 
                        {
                            _fs.Write(mp3Frame.RawData, 0, mp3Frame.RawData.Length);
                            
                        }
                        
                        count++;

                        mp3Frame = reader.ReadNextFrame();
                    }

                    _fs.Close();

                    //myConsole.Text += "File [" + files[i] + "] croped and saved as [" + trackName + "]" + "\n";
                    Console.WriteLine("File [" + files[i] + "] croped and saved as [" + trackName + "]");

                    // string[] stringSeparators = new string[] {".mp3"};
                    // string[] fileNameArr = files[i].Split(stringSeparators, StringSplitOptions.None);

                    string pattern = @"(\.mp3)|([,_'.])|(\(\S+\))|(^\d+[.\-\s)(,_]+)";
                    string trimPattern = @"\s{2,}";
                    string replacement = " ";
                    Regex rgx = new Regex(pattern);
                    
                    //string result = rgx.Replace("110.Marron_5_\"-_th'is_lo've(muzoff.com).mp3", replacement);
                    string result = rgx.Replace(files[i], replacement);
                    
                    rgx = new Regex(trimPattern);
                    result = rgx.Replace(result, replacement);
                    
               
                    tracks.Add(new AudioTrack(result, "tracks/" + trackName));

                    myConsole.Text += tracks[i].ToString() + (i < files.Count - 1 ? ",\n" : "\n\n");
                }

                myProgress.Value++;
            }
            
        }
    }
}
