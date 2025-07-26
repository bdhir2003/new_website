const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/student-portfolio');

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  youtubeUrl: {
    type: String,
    required: true,
  },
  thumbnail: String,
  category: String,
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const VideoModel = mongoose.model('Video', VideoSchema);

async function addSampleVideo() {
  try {
    const sampleVideo = {
      title: "Sample Video - My Work Presentation",
      description: "This is a sample video showcasing my work in maternal and child health research. This video demonstrates the impact of our programs and the communities we serve.",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Sample YouTube URL
      category: "Presentation",
      featured: true
    };

    const result = await VideoModel.create(sampleVideo);
    console.log('Sample video added:', result);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addSampleVideo();
