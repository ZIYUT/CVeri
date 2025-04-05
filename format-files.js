const { exec } = require('child_process');
const path = require('path');

const filePatterns = [
  'src/**/*.js',
  'src/**/*.jsx',
  'src/**/*.ts',
  'src/**/*.tsx',
  'src/**/*.json',
];

const formatFiles = () => {
  const command = `npx prettier --write "${filePatterns.join('" "')}"`;
  console.log('Running format command:', command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Formatting failed:', error.message);
      return;
    }
    if (stderr) {
      console.error('Error output:', stderr);
      return;
    }
    console.log('Formatting complete:', stdout);
  });
};
formatFiles();
