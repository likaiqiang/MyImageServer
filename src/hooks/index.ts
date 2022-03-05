import {ChangeEvent, useEffect, useRef} from "react";
import {v4 as uuidv4} from "uuid";
const OSS = require('ali-oss');
interface Upload{
    (e:ChangeEvent<HTMLInputElement>,callback:(name:string)=>void): void
}

let {
    REACT_APP_BUCKET,
    REACT_APP_REGION,
    REACT_APP_ACCESSKEYSECRET,
    REACT_APP_ACCESSKEYID
} = process.env

REACT_APP_ACCESSKEYSECRET = atob(REACT_APP_ACCESSKEYSECRET || '')
REACT_APP_ACCESSKEYID = atob(REACT_APP_ACCESSKEYID || '')

export const useOss = ()=>{
    const client = useRef(new OSS({
        region: REACT_APP_REGION,
        accessKeyId: REACT_APP_ACCESSKEYID,
        accessKeySecret: REACT_APP_ACCESSKEYSECRET,
        bucket: REACT_APP_BUCKET
    }))
    const put = useRef((file:File,name:string,callback:(name:string)=>void)=>{
        client.current.put('/images/' + name,file).then(()=>{
            callback(name)
        })
    })
    return {client,put}
}

export const useUpload = ()=>{
    const {put} = useOss()
    const upload =  useRef<(Upload)>((e,callback)=>{
        const files = Array.from(e.target.files || [])
        for(let file of files){
            const {name} = file
            put.current(file,name,callback)
        }
    })
    return {upload}
}
export const usePaste = (callback:(name:string)=>void)=>{
    const {put} = useOss()
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
                put.current(file,name,callback)
            }
        })
    },[put,callback])
}
