if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('dist/service-worker.js');
    });
}

module.exports = new Promise((resolve)=>{
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        resolve(e);
    });
});