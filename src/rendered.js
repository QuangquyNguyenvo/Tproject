require.config({
    paths: { 'vs': 'https://unpkg.com/monaco-editor@0.40.0/min/vs' }
  });
  
  require(['vs/editor/editor.main'], function() {
    console.log('Monaco Editor loaded'); // Kiểm tra nếu Monaco Editor đã tải thành công
  
    var editor = monaco.editor.create(document.getElementById('editor'), {
      value: [
        '#include <iostream>',
        'using namespace std;',
        '',
        'int main() {',
        '  cout << "Hello, world!" << endl;',
        '  return 0;',
        '}'
      ].join('\n'),
      language: 'cpp',
      theme: 'vs-dark'
    });
  
    console.log('Monaco Editor created'); // Kiểm tra nếu Monaco Editor đã khởi tạo thành công
  });
  preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    runCode: (code) => ipcRenderer.invoke('run-code', code)
});