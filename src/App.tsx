import React, {useState,useRef} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {usePaste, useUpload} from "./hooks";
import './App.css';

function App() {
  const [url,changeUrl] = useState<string>('')
  const [html,changeHtml] = useState<string>('')
  const [md,changeMd] = useState<string>('')
  const updateUrl = useRef((name:string)=>{
    const url = 'https://likaiqiang-blog.oss-cn-beijing.aliyuncs.com/images/' + name
    changeUrl(url)
    changeHtml(`<img src=${url} alt=""/>`)
    changeMd(`![${name}](${url})`)
  })
  const {upload} = useUpload()
  usePaste(updateUrl.current)
  return (
      <div id="main">
        <section>
          <div className="holder-wrapper">
            <div className="image-holder" title="点击上传图片到微博相册"/>
            <input type="file" multiple onChange={e=>{
              upload.current(e,updateUrl.current)
            }}/>
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

