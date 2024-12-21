export type GPT = {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  tags: string[];
  upvotes: number;
  launchDate: string;
  url: string;
}

export const categories = [
  "3D Modeling & Design", "Accessibility Tools", "Advertising & Marketing", "AI Art & Design",
  "AI Assistants", "AI Chatbots", "AI Coding & Development", "AI Gaming",
  "AI Music & Audio", "AI Video & Animation", "AI Voice Generation", "AI Writing & Editing",
  "Astronomy", "Augmented Reality (AR)", "Big Data Analytics", "Bioinformatics",
  "Blockchain & Cryptocurrency", "Business Intelligence", "Chemistry", "Cloud Computing",
  "Computer Vision", "Content Generation", "Content Creation", "Content Scheduling", "Copywriting",
  "Creative Writing", "Customer Relationship Management (CRM)", "Customer Support",
  "Cybersecurity", "Data Analytics", "Deep Learning", "DIY & Hobbies",
  "E-Commerce", "Education & E-Learning", "Edge AI", "Entertainment & Film",
  "Environmental Science", "Ethical AI Tools", "Fashion & Style", "Finance & Investing",
  "Fitness Tracking", "Gaming Industry", "Gaming Tools", "Genomics",
  "Graphic Design", "Health & Fitness", "Healthcare & Medicine", "Home Automation",
  "Human Resources & Recruitment", "Influencer Tools", "IoT & Smart Devices",
  "Language Learning", "Legal & Compliance", "Logistics & Supply Chain",
  "Machine Learning", "Manufacturing", "Mental Health & Wellness", "Music Discovery",
  "Music Production", "Natural Language Processing (NLP)", "News Aggregation",
  "Open Source AI Tools", "Personal Development", "Philosophy", "Photo Editing",
  "Physics", "Political Science", "Productivity & Organization", "Quantum Computing",
  "Quantum Research", "Real Estate", "Recipe & Cooking Assistants", "Retail & Sales",
  "Robotics & Automation", "Sales Enablement", "Script Writing", "Self-Improvement",
  "Social Media Management", "Sports Analysis", "Theater & Performance", "Translator Tools", "Travel & Hospitality",
  "Travel Planning", "Video Editing", "Virtual Reality (VR)", "Wearable Technology",
  "Weather & Meteorology", "Weather Forecasting"
];


export const tags = [
  "Accessibility", "Advertising", "AI", "AI Ethics", "Analysis", "Art Creation",
  "Assistant", "Augmented Reality", "Automation", "Big Data", "Blockchain",
  "Business Intelligence", "Career Planning", "Chat", "Chatbot", "Code Completion",
  "Collaboration", "Content Creation", "Content Management", "Conversation",
  "Creative", "Cybersecurity", "Data Analysis", "Deep Learning", "Design",
  "E-Learning", "Education", "Entertainment", "Environmental Science",
  "Fashion Design", "Finance", "Financial Planning", "Fitness Tracking",
  "Forecasting", "Gaming", "Graphic Design", "Health", "Healthcare",
  "Home Automation", "Human Resources", "Image Editing", "Image Generation",
  "Illustration", "Information", "Influencer Tools", "Inspiration",
  "Internet of Things", "Language Learning", "Language Model", "Law", "Learning",
  "Legal", "Machine Learning", "Marketing", "Mental Health", "Model",
  "Music Composition", "Natural Language Processing", "News Aggregation",
  "Open Source", "Personal Development", "Problem-Solving", "Productivity",
  "Programming", "Quantum Computing", "Recipe Generation", "Robotics", "Sales",
  "Science", "Self-Improvement", "SEO", "Social Media", "Sports Analysis",
  "Storytelling", "Style Transfer", "Technology", "Text Generation", "Translation",
  "Travel", "UI Design", "UX/UI", "Video Editing", "Video Generation",
  "Video Production", "Virtual Assistant", "Virtual Reality", "Voice Generation",
  "Wearable Technology", "Weather", "Web Development", "Wellness", "Writing", "Yoga"
];
