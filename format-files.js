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
  console.log('运行格式化命令:', command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('格式化失败:', error.message);
      return;
    }
    if (stderr) {
      console.error('错误输出:', stderr);
      return;
    }
    console.log('格式化完成:', stdout);
  });
};
formatFiles();
