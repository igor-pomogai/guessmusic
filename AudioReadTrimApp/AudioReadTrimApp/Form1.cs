using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

using System.IO;
using NAudio;
using NAudio.Wave;

using System.Text.RegularExpressions;

namespace AudioReadTrimApp
{
    public partial class Form1 : Form
    {
        AudioManager am;
        
        public Form1()
        {
            InitializeComponent();
            am = new AudioManager(richTextBox1, progressBar1);
        }

        private void button1_Click(object sender, EventArgs e)
        {
            FolderBrowserDialog fbd = new FolderBrowserDialog();
            DialogResult result = fbd.ShowDialog();
            if (result == DialogResult.OK)
            {
                textBox1.Text = fbd.SelectedPath;
            }
        }

        private void button2_Click(object sender, EventArgs e)
        {
            /*
            string pattern = "(\\.mp3)|([\",_'.])|(\\(\\S+\\))|(^\\d+)";//\\w|\\.|\\,|\\(|\\)|\\-)";
            string replacement = " ";
            Regex rgx = new Regex(pattern);
            string result = rgx.Replace("110 Marron_5_\"-_th'is_lo've(muzoff.com).mp3", replacement);
           

            return;


            */


            string folderName = textBox1.Text;
            var skipDirectory = folderName.Length;
            // because we don't want it to be prefixed by a slash
            // if dirPath like "C:\MyFolder", rather than "C:\MyFolder\"
            if (!folderName.EndsWith("" + Path.DirectorySeparatorChar)) skipDirectory++;

            var filenames = Directory
                            .EnumerateFiles(folderName, "*", SearchOption.TopDirectoryOnly)
                            .Select(f => f.Substring(skipDirectory));
           
            int secAmount = (int) numericUpDown1.Value;
            int fromSec = (int) numericUpDown2.Value;

            progressBar1.Value = 0;
            progressBar1.Maximum = filenames.Count();

            am.initializeAudioFolder(folderName, filenames.ToList(), secAmount, fromSec);
            am.trimAudioFiles();
        }

        private void button3_Click(object sender, EventArgs e)
        {
            richTextBox1.Text = "";
        }
    }
}
