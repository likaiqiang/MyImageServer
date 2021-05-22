#!/bin/sh
const OSS = require('ali-oss')
const path = require('path')
const fs = require('fs')
const client = new OSS({
    region: 'oss-cn-hongkong',
    accessKeyId: 'LTAI5tMh7amxkxfKtoEDkQqv',
    accessKeySecret: 'LKusxdRCTGGz4o9fExj373c33mL4Ov',
    bucket: 'likaiqiang-website'
})
const searchFolder = (folder,callback)=>{
    if(typeof folder === 'undefined'){
        folder = path.join(__dirname,'./public')
    }
    if(fs.statSync(folder).isFile()){
        callback(folder)
        return
    }
    fs.readdir(folder,(err,paths)=>{
        for(let p of paths){
            const lastP = path.join(folder,`${p}`)
            fs.stat(lastP,(error, stats)=>{
                if(!err){
                    if(stats.isFile()){
                        typeof callback === 'function' && callback(lastP)
                    }
                    else {
                        searchFolder(lastP,callback)
                    }
                } else {
                    console.error(err)
                }
            })
        }
    })
}
const entry = path.join(__dirname,'./public')
searchFolder(entry,(p)=>{
    const relativePath = path.relative(entry,p)
    const lastP = '/img-server/' +  relativePath.split(path.sep).join('/')
    client.put(lastP, fs.createReadStream(p)).then((result) => {
        console.log('done');
    });
})
