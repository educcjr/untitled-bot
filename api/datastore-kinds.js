module.exports = process.env.NODE_ENV === 'test' ? {
  USER: 'UserTESTKIND',
  AUDIO_GREETING: 'AudioGreetingTESTKIND'
} : {
  USER: 'User',
  AUDIO_GREETING: 'AudioGreeting'
};
