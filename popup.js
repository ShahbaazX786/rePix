document.addEventListener('DOMContentLoaded', () => {
  const openFullPageBtn = document.getElementById('open-full-page-btn');
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');

  openFullPageBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('fullpage.html') });
  });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  dropZone.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      handleFile(e.target.files[0]);
    }
  });

  function handleFile(file) {
    const formatSelect = document.getElementById('format-select').value;
    alert(`Ready to convert ${file.name} to ${formatSelect}!\n\n(Conversion logic coming in Step 5!)`);
  }
});
