using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AudioReadTrimApp
{
    class AudioTrack
    {
        private string song;
        private string filePath;

        public AudioTrack(string song, string filePath)
        {
            this.song = song;
            this.filePath = filePath;
        }

        public override string ToString()
        {
            return "{" +
                "song: '" + song + "', " +
                "file: '" + filePath + "'" +
                "}";
        }
    }
}
