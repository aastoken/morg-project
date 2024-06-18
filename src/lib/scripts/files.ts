'use server';
import config from '../../../morg_config/config.json';
import fs from 'fs';
import path from 'path';

const configPath = path.resolve(__dirname, '../../../../morg_config/config.json');

export async function setRootFolder(path: string|FormData){
  console.log("Path: ",path);
  if(typeof(path) === 'string'){
    config.library_root = path;
  }
  else{
    const formDataEntry = path.get('path');
    if (typeof formDataEntry === 'string') {
      console.log("FormDataEntry:",formDataEntry)
      config.library_root = formDataEntry;
      console.log("Library root:",config.library_root);
    } else {
      // Handle the case where formDataEntry is a File or null
      config.library_root = '';
    }
  }
  const updatedConfig = JSON.stringify(config, null, 2);
  fs.writeFile(configPath, updatedConfig, 'utf8', (err) => {
    if (err) {
      console.error('Error writing config file:', err);
    } else {
      console.log('Config file updated successfully.');
    }
  });

}