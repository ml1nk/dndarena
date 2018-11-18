function upload(accept) {
    let res;
    let rej;
    const promise = new Promise((resolve, reject)=>{res=resolve; rej=reject;});
    const f=document.createElement('input');
    f.style.display='none';
    f.type='file';
    f.name='file';
    if(accept) f.accept = accept;
    document.body.appendChild(f);
    f.click();
    f.addEventListener("change",(event) => {
        if (typeof window.FileReader !== 'function') return rej();
        let input = event.target;
        if (!input || !input.files || !input.files[0]) return rej();
        let file = input.files[0];
        let fr = new FileReader();
        fr.onload = e=>res(e.target.result);
        fr.onerror = ()=>rej();
        fr.readAsText(file);
    });
    promise.then(()=>document.body.removeChild(f),()=>document.body.removeChild(f));
    return promise;
}

module.exports = upload;

