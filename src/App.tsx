import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import './App.css';
const OSS = require('ali-oss');
const client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: 'LTAI5tMh7amxkxfKtoEDkQqv',
  accessKeySecret: 'LKusxdRCTGGz4o9fExj373c33mL4Ov',
  bucket: 'likaiqiang-blog'
})

function App() {
  const [url,changeUrl] = useState<string>('')
  const [html,changeHtml] = useState<string>('')
  const [md,changeMd] = useState<string>('')
  const uploadFile = useCallback((e:ChangeEvent<HTMLInputElement>)=>{
    const files = Array.from(e.target.files || [])
    for(let file of files){
      const {name} = file
      client.put('/images/' + name,file).then(()=>{
        const url = 'https://likaiqiang-blog.oss-cn-beijing.aliyuncs.com/images/' + name
        changeUrl(url)
        changeHtml(`<img src=${url} alt=""/>`)
        changeMd(`![${name}](${url})`)
      })
    }
  },[])
  useEffect(()=>{
    document.addEventListener('paste',(event)=>{
      const items = event.clipboardData && event.clipboardData.items;
      let file = null;
      if (items && items.length) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            file = items[i].getAsFile();
            break;
          }
        }
      }
      if(file){
        const name = uuidv4() + '-' + file.name
        client.put('/images/' + name,file).then(()=>{
          const url = 'https://likaiqiang-blog.oss-cn-beijing.aliyuncs.com/images/' + name
          changeUrl(url)
          changeHtml(`<img alt="" src=${url}/>`)
          changeMd(`![${name}](${url})`)
        })
      }
    })
  },[])
  return (
      <div id="main">
        <section>
          <div className="holder-wrapper">
            <div className="image-holder" title="点击上传图片到微博相册"/>
            <input type="file" multiple onChange={uploadFile}/>
          </div>
          <div className="table-wrapper">
            <table width="100%">
              <tbody>
              <tr className="type-1">
                <td><span className="title">URL</span></td>
                <td><input value={url} type="text" disabled readOnly
                           placeholder="Uniform Resource Locator"/>
                </td>
                <td>
                  <CopyToClipboard text={url}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className="button-copy" datatype="URL">Copy</a>
                  </CopyToClipboard>
                </td>
              </tr>
              <tr className="type-2">
                <td><span className="title">HTML</span></td>
                <td><input value={html} type="text" disabled readOnly
                           placeholder="HyperText Markup Language"/>
                </td>
                <td>
                  <CopyToClipboard text={html}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className="button-copy" datatype="HTML">Copy</a>
                  </CopyToClipboard>
                </td>
              </tr>
              <tr className="type-4">
                <td><span className="title">Markdown</span></td>
                <td>
                  <input value={md} type="text" disabled readOnly  placeholder="Markdown"/>
                </td>
                <td>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <CopyToClipboard text={md}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className="button-copy" datatype="Markdown">Copy</a>
                  </CopyToClipboard>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
  )
}
export  default  App

