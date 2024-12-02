//══════════════════════════════════════════════════════════════════════════════════════════════════════//
//                                                                                                      //
//                                    𝗠𝗔𝗡𝗨-𝗠𝗗  𝐁𝐎𝐓                                                 //
//                                                                                                      //
//                                         Ｖ：7.0                                                       //

//███╗░░░███╗░█████╗░███╗░░██╗██╗░░░██╗
//████╗░████║██╔══██╗████╗░██║██║░░░██║
//██╔████╔██║███████║██╔██╗██║██║░░░██║
//██║╚██╔╝██║██╔══██║██║╚████║██║░░░██║
//██║░╚═╝░██║██║░░██║██║░╚███║╚██████╔╝
//╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝░╚═════╝░

//███╗░░░███╗██████╗░
//████╗░████║██╔══██╗
//██╔████╔██║██║░░██║
//██║╚██╔╝██║██║░░██║
//██║░╚═╝░██║██████╔╝
//╚═╝░░░░░╚═╝╚═════╝░

//══════════════════════════════════════════════════════════════════════════════════════════════════════//
//*
//  * @project_name : MANU-MD
//  * @author : Manul Official
//  * @youtube : https://www.youtube.com/@ManulOfficialTech
//  * @description : Manu-MD ,A Multi-functional whatsapp user bot.
//*
//*
//base by Manul Official
//GitHub: @manulofficial7
//WhatsApp: +94742274855
//want more free bot scripts? subscribe to my youtube channel: https://youtube.com/@ManulOfficialTech
//   * Created By Github: manulofficial7.
//   * Credit To Manul Official
//   * © 2024 MANU-MD-V7.
// ⛥┌┤
// */
























































const fetch = require('node-fetch');
const axios = require('axios');
const config = require('../config.cjs')

// Replace these with your GitHub credentials
const userName = 'new';
const token = 'gh';
const repoName = 'vjs';

// Function to fetch data from GitHub API
async function githubApiRequest(url, method = 'GET', data = {}) {
  try {
    const options = {
      method,
      headers: {
        Authorization: `Basic ${Buffer.from(`${userName}:${token}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    };

    if (method === 'GET' || method === 'HEAD') {
      // Remove the body property for GET and HEAD requests
      delete options.body;
    } else {
      // For other methods (POST, PUT, DELETE, etc.), add the JSON.stringify data to the request body
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    return await response.json();
  } catch (error) {
    throw new Error(`GitHub API request failed: ${error.message}`);
  }
}


async function checkRepoAvailability() {
  try {
    const apiUrl = `https://api.github.com/repos/${userName}/${repoName}`;
const headers = {
  Authorization: `Bearer ${token}`,
};

    const response = await axios.get(apiUrl, { headers });

    if (response.status === 200) {
      return true
    } else {
     return false
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return false
    } else {
      console.error('Error:', error.message);
    }
  }
}


// 1. Function to search GitHub file
async function githubSearchFile(filePath, fileName) {
  const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}?ref=main`;
  const data = await githubApiRequest(url);
  return data.find((file) => file.name === fileName);
}

// 2. Function to create a new GitHub file
async function githubCreateNewFile(filePath, fileName, content) {
  const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}/${fileName}`;
  const data = {
    message: `Create new file: ${fileName}`,
    content: Buffer.from(content).toString('base64'),
  };
  return await githubApiRequest(url, 'PUT', data);
}

// 3. Function to delete a GitHub file
async function githubDeleteFile(filePath, fileName) {
  const file = await githubSearchFile(filePath, fileName);
  if (!file) throw new Error('File not found on GitHub.');
  
  const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}/${fileName}`;
  const data = {
    message: `Delete file: ${fileName}`,
    sha: file.sha,
  };
  await githubApiRequest(url, 'DELETE', data);
}

// 4. Function to get GitHub file content
async function githubGetFileContent(filePath, fileName) {
  const file = await githubSearchFile(filePath, fileName);
  if (!file) throw new Error('File not found on GitHub.');
  
  const url = file.download_url;
  const response = await fetch(url);
  return await response.text();
}

// 5. Function to clear GitHub file content and add new content
async function githubClearAndWriteFile(filePath, fileName, content) {
  const file = await githubSearchFile(filePath, fileName);
  if (!file) {
    await githubCreateNewFile(fileName, content);
  } else {
    const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}/${fileName}`;
    const data = {
      message: `Modify file: ${fileName}`,
      content: Buffer.from(content).toString('base64'),
      sha: file.sha,
    };
    return await githubApiRequest(url, 'PUT', data);
  }
}

// 6. Function to delete an existing GitHub file and upload a new one
async function githubDeleteAndUploadFile(fileName, newContent) {
  await githubDeleteFile(fileName);
  await githubCreateNewFile(fileName, newContent);
}

//========================================
async function updateCMDStore(MsgID , CmdID) {
try { 
let olds = JSON.parse(await githubGetFileContent("Non-Btn",'data.json'))
olds.push({[MsgID]:CmdID})
var add = await githubClearAndWriteFile('Non-Btn','data.json',JSON.stringify(olds, null, 2))
return true
} catch (e) {
console.log( e)
return false
}
}

async function isbtnID(MsgID){
try{
let olds = JSON.parse(await githubGetFileContent("Non-Btn",'data.json'))
let foundData = null;
for (const item of olds) {
  if (item[MsgID]) {
    foundData = item[MsgID];
    break;
  }
}
if(foundData) return true
else return false
} catch(e){
return false
}
}

async function getCMDStore(MsgID) {
try { 
let olds = JSON.parse(await githubGetFileContent("Non-Btn",'data.json'))
let foundData = null;
for (const item of olds) {
  if (item[MsgID]) {
    foundData = item[MsgID];
    break;
  }
}
return foundData
} catch (e) {
console.log( e)
return false
}
} 

module.exports = { updateCMDStore,isbtnID,getCMDStore }
