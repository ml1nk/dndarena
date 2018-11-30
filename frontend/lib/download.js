function download(name, type, data, charset = 'utf-8') {
  let element = document.createElement('a');

  element.setAttribute('href',
      'data:' + type + ';'
    + (charset ? 'charset=' + charset + ';' : '')
    + 'name='+ encodeURIComponent(name)
    + (charset===false ? ';base64,' : ',')
    + (charset ? encodeURIComponent(data) : data)
  );
  element.setAttribute('download', name);

  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

module.exports = download;